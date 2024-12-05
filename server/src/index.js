import '@babel/register'
import express from 'express'
import dotenv from 'dotenv'
import { route } from './routes'
import cookieParser from 'cookie-parser'
import { connectToDB, syncDatabase } from './config'
import cors from 'cors'
import { setupWebSocket } from './socket'
import http from 'http'
import { logRequest, delayResponse, authenticateToken } from './middlewares'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh'
global.dayjs = (date) => dayjs(date).tz(DEFAULT_TIMEZONE)

dotenv.config()
const port = process.env.PORT
const app = express()
const server = http.createServer(app)

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

connectToDB()
// syncDatabase()

const io = setupWebSocket(server)

app.use(logRequest)
app.use(delayResponse(0))
app.use(authenticateToken())

route(app)

server.listen(port, () => console.log('BE start successful'))
