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
dashboardRouter.get(
  '/product-sales-data-by-period',
  dashboardController.getProductSalesDataByPeriod
)
dashboardRouter.get(
  '/chart-product-analytics-data-by-period/:productId',
  dashboardController.getChartProductAnalyticsDataByPeriod
)
dashboardRouter.get(
  '/product-price-history/:productId',
  dashboardController.getProductPriceHistory
)
dashboardRouter.get(
  '/product-data/:productId',
  dashboardController.getProductData
)
export { dashboardRouter }
