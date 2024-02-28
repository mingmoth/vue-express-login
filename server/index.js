import bodyParser from 'body-parser'
import express from 'express'
import session from 'express-session'
import path from 'path'
import useragent from 'express-useragent'
import router from './routes/index.js'
import assets from './assets/index.js'

const app = express()
const port = 3000

const publicPath = path.join(path.resolve(), "public")
app.use('/', express.static(publicPath))
app.use("/src", assets)

app.use(useragent.express());

app.use(session({
    secret: 'vue-express-login',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());

app.use(router)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})