import { Op } from 'sequelize'
import { ORDER_STATUS } from '@/enum'
import { Order } from '@/models'

const { DATE_FORMAT } = process.env
export const orderService = {
  getNumberOfCancelledOrdersOfAccountIn24Hours: async (accountId) => {
    const orders = await Order.findAll({
      where: {
        accountId,
        createdAt: {
          [Op.gte]: global.dayjs().subtract(24, 'hours').format(DATE_FORMAT),
        },
        orderStatus: ORDER_STATUS.CANCELLED,
      },
    })

    return orders.length
  },
  getNumberOfReturnedOrdersOfAccountIn7Days: async (accountId) => {
    const orders = await Order.findAll({
      where: {
        accountId,
        orderStatus: ORDER_STATUS.RETURNED,
        createdAt: {
          [Op.gte]: global.dayjs().subtract(7, 'days').format(DATE_FORMAT),
        },
      },
    })
    return orders.length
  },
}
