import express from 'express'
import { dashboardController } from '@/controllers/dashboard'

const dashboardRouter = express.Router()

dashboardRouter.get('/', dashboardController.getDashboardData)
dashboardRouter.get(
  '/earnings-comparison-by-period',
  dashboardController.getEarningsComparisonByPeriod
)
dashboardRouter.get(
  '/top-product-sold-comparison-by-period',
  dashboardController.getTopProductSoldComparisonByPeriod
)
dashboardRouter.get(
  '/profit-comparison-by-period',
  dashboardController.getProfitComparisonByPeriod
)
export { dashboardRouter }
