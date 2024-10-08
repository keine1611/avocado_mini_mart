import '@babel/register'
import express from 'express'
import dotenv from 'dotenv'
import { route } from './routes'
import cookieParser from 'cookie-parser'
import { connectToDB, syncDatabase } from './config'
import cors from 'cors'
import { delayResponse, logRequest, authenticateToken } from './middlewares'

const port = 1611
dotenv.config()
const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}

connectToDB()
// syncDatabase()
app.use(cors(corsOptions))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(logRequest)
app.use(delayResponse(1000))
app.use(authenticateToken())

route(app)

app.listen(port, () => console.log('BE start successful'))
