import { Op } from 'sequelize'
import { ORDER_STATUS, ACCOUNT_STATUS } from '@/enum'
import { Order, Account, OrderLog } from '@/models'

const { DATE_FORMAT } = process.env
export const orderService = {
  getNumberOfCancelledOrdersOfAccountIn24Hours: async (accountId) => {
    const account = await Account.findByPk(accountId)
    if (!account) {
      throw new Error('Account not found')
    }

    const orders = await Order.findAll({
      where: {
        accountId,
        createdAt: {
          [Op.gte]: global.dayjs().subtract(24, 'hours').format(DATE_FORMAT),
        },
        orderStatus: ORDER_STATUS.CANCELLED,
      },
      include: [
        {
          model: OrderLog,
          as: 'orderLogs',
          where: {
            status: ORDER_STATUS.CANCELLED,
            updatedBy: account.email,
          },
        },
      ],
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
