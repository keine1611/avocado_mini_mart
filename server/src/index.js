import 'module-alias/register'
import express from 'express'
import dotenv from 'dotenv'
import { connectToDB, syncDatabase } from './config'
import { models } from './model'
import { route } from './routes'
import cookieParser from 'cookie-parser'
import { logRequest } from './middlewares/logRequest'

const port = 1611
dotenv.config()
const app = express()

//tạo file để lưu log vào file

app.use(cookieParser())
app.use(express.json())
syncDatabase()

app.use(logRequest)

route(app)

app.listen(port, () => console.log('BE start successful'))
