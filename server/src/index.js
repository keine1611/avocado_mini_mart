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

dotenv.config()
const port = process.env.PORT
const app = express()
const server = http.createServer(app)

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors(corsOptions))

connectToDB()
// syncDatabase()

const io = setupWebSocket(server)

app.use(logRequest)
app.use(delayResponse(1000))
app.use(authenticateToken())

route(app)

server.listen(port, () => console.log('BE start successful'))
