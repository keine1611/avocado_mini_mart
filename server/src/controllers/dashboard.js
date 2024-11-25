import {
  calculateTotalOrders,
  calculateTotalSales,
  calculateCogs,
  calculateProfit,
} from '@/services'
import dayjs from 'dayjs'

const { DATE_FORMAT } = process.env

const dashboardController = {
  getDashboardData: async (req, res) => {
    try {
      const data = await calculateProfit({
        startDateString: dayjs().startOf('day').format(DATE_FORMAT),
        endDateString: dayjs().endOf('day').format(DATE_FORMAT),
      })

      res.json({
        data,
      })
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Error fetching dashboard data',
      })
    }
  },
}

export { dashboardController }
