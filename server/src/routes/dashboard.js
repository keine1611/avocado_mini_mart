import express from 'express'
import { dashboardController } from '@/controllers/dashboard'

const dashboardRouter = express.Router()

dashboardRouter.get('/', dashboardController.getDashboardData)

export { dashboardRouter }
