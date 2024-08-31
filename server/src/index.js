// import 'module-alias/register'
import '@babel/register'
import express from 'express'
import dotenv from 'dotenv'
import { connectToDB, syncDatabase } from './config'
import { models } from './model'
import { route } from './routes'
import cookieParser from 'cookie-parser'

import cors from 'cors'
import { delayResponse, logRequest } from './middlewares'

const port = 1611
dotenv.config()
const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'all',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}

app.use(cors(corsOptions))

app.use(cookieParser())
app.use(express.json())
// syncDatabase()

app.use(logRequest)
app.use(delayResponse(1000))

route(app)

app.listen(port, () => console.log('BE start successful'))
