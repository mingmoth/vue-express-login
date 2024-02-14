import express from 'express'
import path from 'path'
import router from './routes/index.js'
import assets from './assets/index.js'

const app = express()
const port = 3000

const publicPath = path.join(path.resolve(), "public")
app.use('/', express.static(publicPath))
app.use("/src", assets)
app.use(router)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})