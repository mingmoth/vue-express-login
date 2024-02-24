import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import passportAuth from './passport.js'
import { getDb, saveDb } from '../helpers/db.js'

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

        console.log('req.user', req?.user)

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
    req.logout(() => {
        return res.json({ status: 'ok', message: '登出成功'})
    })
})

router.post('/auth/registerRequest', authenticated, async (req, res) => {
    const username = req?.body?.username
    if(!username) {
        res.json({
            message: 'Can not create passkey without username'
        })
    }
    const cookie = req.headers.cookie

    const values = cookie.split(';').reduce((acc, cur) => {
        const [key, value] = cur.split('=')
        acc[key.trim()] = value
        return acc
    }, {})

    const CookieUserName = values['username']

    const sessionUser = req.session.user?.username
    console.log('username', username)
    console.log('sessionUser', sessionUser)
    console.log('CookieUserName', CookieUserName)
    if(username !== sessionUser || username !==CookieUserName) {
        return res.json({ status: 'error', message: '權限不足'})
    }
    // 產生裝置註冊選項
    // const options = await generateRegistrationOptions({
    //     rpName,
    //     rpID: rpId,
    //     userID: username,
    //     userName: username,
    //     // 設定要排除的驗證器，避免驗證器重複註冊
    //     excludeCredentials: [],
    //     timeout: 60000
    // })
    // console.log('options', options)

    // Keep the challenge value in a session.
    // req.session.challenge = options.challenge;

    // (資料庫)
    // 將 challenge 存入資料庫
    // 實務上 challenge 是會到期的，到期時間依照 options 的 timeout 設定
    // 所以存到 cache 就足夠了，不一定需要存到資料庫
    // saveUserRegisterChallenge(username, options.challenge);

    // res.json(options)

    res.json({ status: 'ok', message: '開始註冊'})
})

router.get('/*', (_req, res) => {
    res.render('index.html.ejs')
})

export default router