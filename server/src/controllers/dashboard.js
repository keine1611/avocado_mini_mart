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
} from '@/services'

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
}

export { dashboardController }
