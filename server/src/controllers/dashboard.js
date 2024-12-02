import {
  calculateTotalOrders,
  calculateTotalEarnings,
  calculateProfit,
} from '@/services'
import dayjs from 'dayjs'
import {
  calculateEarningsComparisonByPeriod,
  calculateTopProductSoldComparisonByPeriod,
  getTotalNewCustomers,
  calculateProfitComparisonByPeriod,
  getProductSalesDataByPeriod,
  getChartProductAnalyticsDataByPeriod,
  getProductPriceHistory,
} from '@/services'
import { Product, BatchProduct, models } from '@/models'
import { Op } from 'sequelize'
import { formatError } from '@/utils'
import sequelize from '@/config/database'
const { DATE_FORMAT } = process.env

const dashboardController = {
  getDashboardData: async (req, res) => {
    try {
      const startOfMonth = dayjs().startOf('month').format(DATE_FORMAT)
      const endOfMonth = dayjs().endOf('month').format(DATE_FORMAT)

      const lastMonthStartOfMonth = dayjs()
        .subtract(1, 'month')
        .startOf('month')
        .format(DATE_FORMAT)
      const lastMonthEndOfMonth = dayjs()
        .subtract(1, 'month')
        .endOf('month')
        .format(DATE_FORMAT)

      const totalProfitDataThisMonth = await calculateProfit({
        startDateString: startOfMonth,
        endDateString: endOfMonth,
      })
      const totalOrdersDataThisMonth = await calculateTotalOrders({
        startDateString: startOfMonth,
        endDateString: endOfMonth,
      })
      const totalEarningsDataThisMonth = await calculateTotalEarnings({
        startDateString: startOfMonth,
        endDateString: endOfMonth,
      })

      const totalProfitDataLastMonth = await calculateProfit({
        startDateString: lastMonthStartOfMonth,
        endDateString: lastMonthEndOfMonth,
      })
      const totalOrdersDataLastMonth = await calculateTotalOrders({
        startDateString: lastMonthStartOfMonth,
        endDateString: lastMonthEndOfMonth,
      })
      const totalEarningsDataLastMonth = await calculateTotalEarnings({
        startDateString: lastMonthStartOfMonth,
        endDateString: lastMonthEndOfMonth,
      })
      const totalNewCustomersDataThisMonth = await getTotalNewCustomers({
        startDateString: startOfMonth,
        endDateString: endOfMonth,
      })
      const totalNewCustomersDataLastMonth = await getTotalNewCustomers({
        startDateString: lastMonthStartOfMonth,
        endDateString: lastMonthEndOfMonth,
      })

      res.json({
        totalProfitData: {
          thisMonth: totalProfitDataThisMonth,
          lastMonth: totalProfitDataLastMonth,
        },
        totalOrdersData: {
          thisMonth: totalOrdersDataThisMonth,
          lastMonth: totalOrdersDataLastMonth,
        },
        totalEarningsData: {
          thisMonth: totalEarningsDataThisMonth,
          lastMonth: totalEarningsDataLastMonth,
        },
        totalNewCustomersData: {
          thisMonth: totalNewCustomersDataThisMonth,
        },
      })
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Error fetching dashboard data',
      })
    }
  },
  getEarningsComparisonByPeriod: async (req, res) => {
    try {
      const { period } = req.query
      const earningsComparisonByPeriod =
        await calculateEarningsComparisonByPeriod({
          period,
        })
      res.status(200).json(earningsComparisonByPeriod)
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Error fetching earnings comparison data',
      })
    }
  },
  getTopProductSoldComparisonByPeriod: async (req, res) => {
    try {
      const { period } = req.query
      const topProductSoldComparisonByPeriod =
        await calculateTopProductSoldComparisonByPeriod({
          period,
        })
      res.status(200).json(topProductSoldComparisonByPeriod)
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Error fetching product sold comparison data',
      })
    }
  },
  getProfitComparisonByPeriod: async (req, res) => {
    try {
      const { period } = req.query
      const profitComparisonByPeriod = await calculateProfitComparisonByPeriod({
        period,
      })
      res.status(200).json(profitComparisonByPeriod)
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Error fetching profit comparison data',
      })
    }
  },
  getProductSalesDataByPeriod: async (req, res) => {
    try {
      const { period } = req.query
      const productSalesDataByPeriod = await getProductSalesDataByPeriod({
        period,
      })
      res.status(200).json(productSalesDataByPeriod)
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Error fetching sale analytics data',
      })
    }
  },
  getChartProductAnalyticsDataByPeriod: async (req, res) => {
    try {
      const { period } = req.query
      const productId = req.params.productId
      const chartProductAnalyticsDataByPeriod =
        await getChartProductAnalyticsDataByPeriod({
          period,
          productId,
        })
      res.status(200).json(chartProductAnalyticsDataByPeriod)
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Error fetching chart product analytics data',
      })
    }
  },
  getProductPriceHistory: async (req, res) => {
    try {
      const productId = req.params.productId
      const productPriceHistory = await getProductPriceHistory({ productId })
      res.status(200).json(productPriceHistory)
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Error fetching product price history',
      })
    }
  },
  getProductData: async (req, res) => {
    try {
      const productId = req.params.productId
      const product = await Product.findOne({
        where: { id: productId },
        include: [
          { model: models.Brand, as: 'brand' },
          { model: models.ProductImage, as: 'productImages' },
          {
            model: models.SubCategory,
            as: 'subCategory',
            include: [{ model: models.MainCategory, as: 'mainCategory' }],
          },
          {
            model: models.Review,
            as: 'reviews',
            attributes: ['rating', 'comment', 'createdAt'],
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: models.Account,
                as: 'account',
                attributes: ['email', 'avatarUrl'],
              },
              {
                model: models.ReviewMedia,
                as: 'reviewMedia',
                attributes: ['url', 'mediaType'],
              },
            ],
          },
        ],
      })

      const productDiscounts = await models.ProductDiscount.findAll({
        where: { productId: product.id },
        include: {
          model: models.Discount,
          as: 'discount',
          where: { isActive: true },
        },
        attributes: ['discountPercentage'],
        order: [['discountPercentage', 'DESC']],
      })

      const rating =
        product.reviews.length > 0
          ? product.reviews.reduce((acc, review) => {
              return acc + review.rating
            }, 0) / product.reviews.length
          : 0
      const maxDiscount =
        productDiscounts.length > 0 ? productDiscounts[0].discountPercentage : 0

      const batchProducts = await BatchProduct.findAll({
        where: { productId: product.id, quantity: { [Op.gt]: 0 } },
      })

      let totalQuantity = 0
      let totalValue = 0

      batchProducts.forEach((batch) => {
        if (dayjs(batch.expiredDate, DATE_FORMAT).isAfter(dayjs())) {
          totalQuantity += batch.quantity
          totalValue += batch.quantity * batch.price
        }
      })

      const averagePurchasePrice =
        totalQuantity > 0 ? totalValue / totalQuantity : 0

      res.status(200).json({
        message: 'Product detail retrieved successfully',
        data: {
          ...product.dataValues,
          maxDiscount,
          totalQuantity,
          rating,
          averagePurchasePrice,
        },
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
}

export { dashboardController }
