import { authController } from '@/controllers'
import express from 'express'
import multer from 'multer'
import { models } from '@/models'
import { importDataToDatabase, readExcelFile } from '@/utils'

export const uploadRouter = express.Router()
const upload = multer({ dest: 'uploads/' })
