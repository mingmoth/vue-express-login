import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import passportAuth from './passport.js'
import { v4 as uuidv4 } from 'uuid';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { getDb, saveDb } from '../helpers/db.js'

const rpName = 'vue-express-login';
const rpId = 'localhost';
const localOrigin = 'http://localhost:3000';

const authenticated = passportAuth.authenticate('jwt', { session: false })

const router = express.Router()

router.post('/auth/register', (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.json({ status: 'error', message: '請輸入帳號及密碼'})
    }
    const db = getDb()

    const username = req.body.username
    const password = req.body.password

    if(db.users[username]) {
        return res.json({ status: 'error', message: '帳號已被註冊'})
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    db.users[username] = {
        id: uuidv4(),
        username,
        password: hash
    }
    saveDb(db)
    return res.json({ status: 'ok', message: `${ username } 已成功被註冊`})
})

router.post('/auth/login', (req, res) => {
    try {
        if(!req.body.username || !req.body.password) {
            return res.json({ status: 'error', message: '請輸入帳號及密碼'})
        }
        const db = getDb()
        const username = req.body.username
        const password = req.body.password
        const user = db.users[username]
        if(!user) {
            return res.json({ status: 'error', message: '查無此帳號'})
        }
        if(!bcrypt.compareSync(password, user.password)) {
            return res.json({ status: 'error', message: '帳號或密碼錯誤'})
        }

        const userData = { ...user }
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        res.json({
            status: 'ok',
            message: '登入成功',
            data: {
                token,
                ...userData,
            }
        })
    } catch (error) {
        console.log('error', error)
        res.json({
            status: 'error',
            message: '登入失敗',
        })
    }
})

router.post('/auth/logout', authenticated, (req, res) => {
    req.session.destroy()
    req.logout(() => {
        return res.json({ status: 'ok', message: '登出成功'})
    })
})

router.post('/auth/registerRequest', authenticated, async (req, res) => {
    const username = req?.body?.username
    const userId = req?.body?.id

    if(!username || !userId) {
        return res.json({ status: 'error', message: '申請權限不足'})
    }

    // 產生裝置註冊選項
    const options = await generateRegistrationOptions({
        rpName,
        rpID: rpId,
        userID: userId,
        userName: username,
        // 設定要排除的驗證器，避免驗證器重複註冊
        excludeCredentials: [],
        timeout: 60000
    })

    // Keep the challenge value in a session.
    req.session.challenge = options.challenge;

    // (資料庫)
    // 將 challenge 存入資料庫
    // 實務上 challenge 是會到期的，到期時間依照 options 的 timeout 設定
    // 所以存到 cache 就足夠了，不一定需要存到資料庫
    // saveUserRegisterChallenge(username, options.challenge);

    res.json({ status: 'ok', message: '開始註冊', data: options })
})

router.post('/auth/registerResponse', async (req, res) => {
    const username = req.body.username;
    const userId = req.body.id;
    const credential = req.body.credentials;

    if(!username || !userId || !credential) {
        return res.json({ status: 'error', message: '註冊權限不足'})
    }

    const db = getDb()
    const user = db.users[username]
    if(!user) {
        return res.json({ status: 'error', message: '查無此帳號'})
    }

    // Set expected values.
    const expectedChallenge = req.session.challenge;
    const expectedOrigin = localOrigin;
    const expectedRPID = rpId || process.env.HOSTNAME;

    try {
        // Use SimpleWebAuthn's handy function to verify the registration request.
        const verification = await verifyRegistrationResponse({
            response: credential,
            expectedChallenge,
            expectedOrigin,
            expectedRPID,
            requireUserVerification: false,
        });

        const { verified, registrationInfo } = verification;

        // If the verification failed, throw.
        if (!verified) {
            throw new Error('User verification failed.');
        }

        const { credentialPublicKey, credentialID } = registrationInfo;

        // Base64URL encode ArrayBuffers.
        const base64PublicKey = isoBase64URL.fromBuffer(credentialPublicKey);
        const base64CredentialID = isoBase64URL.fromBuffer(credentialID);

        const userData = { ...user }
        delete userData.password

        const userCredential = {
            ...userData,
            credential_id: base64CredentialID,
            public_key: base64PublicKey,
            platform: req.useragent.platform,
            transports: credential.response.transports || [],
            registered: (new Date()).getTime(),
            last_used: null,
        };

        // Store the registration result.
        db.credentials[userData.id] = userCredential;

        saveDb(db)

        // Delete the challenge from the session.
        delete req.session.challenge;

        // Respond with the user information.
        return res.json({ status: 'ok', message: '註冊成功', data: userCredential });
    } catch (error) {
        delete req.session.challenge;

        console.error(error);
        return res.status(400).send({ error: error.message });
    }

})

router.get('/*', (_req, res) => {
    res.render('index.html.ejs')
})

export default router