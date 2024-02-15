import express from 'express'
import bcrypt from 'bcryptjs'
import fs from 'fs'

const router = express.Router()

export const getDb = () => {
    const fileContent = fs.readFileSync("db.json", { encoding: "utf-8" })
    console.log('fileContent', fileContent)
    return JSON.parse(fileContent);
};

export const saveDb = (db) => {
    fs.writeFileSync("./db.json", JSON.stringify(db));
};

router.get('/*', (_req, res) => {
    res.render('index.html.ejs')
})

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
    return res.json({ status: 'ok', message: '登入成功'})
})

export default router