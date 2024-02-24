import 'dotenv/config'

import passport from "passport";
import passportJWT from 'passport-jwt'
import { getDb } from '../helpers/db.js'

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtSecret = process.env.JWT_SECRET

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = jwtSecret

const passportAuth = passport

passportAuth.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    const db = getDb()
    const user = db.users[jwt_payload.username]
    if(!user) {
        return done(null, false, { status: 'error', message: '查無此帳號' })
    }
    return done(null, user)
}))

export default passportAuth