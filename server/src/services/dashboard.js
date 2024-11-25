import { Order, OrderItem, Batch, BatchProduct } from '@/models'
import { Op } from 'sequelize'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Sequelize } from 'sequelize'
import { ORDER_STATUS } from '@/enum'
import { gte } from 'lodash'
dayjs.extend(customParseFormat)

const { DATE_FORMAT } = process.env

export const calculateTotalRevenue = async () => {
  const startOfDay = dayjs().startOf('day').toDate()
  const startOfWeek = dayjs().startOf('week').toDate()
  const startOfMonth = dayjs().startOf('month').toDate()
  const startOfYear = dayjs().startOf('year').toDate()

  const revenueByDay = await Order.sum('totalAmount', {
    where: {
      createdAt: {
        [Op.gte]: dayjs(startOfDay, 'DDMMYYYYHHmmss').toDate(),
      },
    },
  })

  const revenueByWeek = await Order.sum('totalAmount', {
    where: {
      createdAt: {
        [Op.gte]: dayjs(startOfWeek, 'DDMMYYYYHHmmss').toDate(),
      },
    },
  })

  const revenueByMonth = await Order.sum('totalAmount', {
    where: {
      createdAt: {
        [Op.gte]: dayjs(startOfMonth, 'DDMMYYYYHHmmss').toDate(),
      },
    },
  })

  const revenueByYear = await Order.sum('totalAmount', {
    where: {
      createdAt: {
        [Op.gte]: dayjs(startOfYear, 'DDMMYYYYHHmmss').toDate(),
      },
    },
  })

  return {
    revenueByDay,
    revenueByWeek,
    revenueByMonth,
    revenueByYear,
  }
}

export const calculateTotalOrders = async ({ days }) => {
  const startDate = dayjs()
    .subtract(days, 'days')
    .startOf('day')
    .format(DATE_FORMAT)

  const totalOrders = await Order.count({
    where: {
      createdAt: {
        [Op.gte]: startDate,
      },
    },
  })

  const totalPendingOrders = await Order.count({
    where: {
      createdAt: { [Op.gte]: startDate },
      orderStatus: { [Op.eq]: ORDER_STATUS.PENDING },
    },
  })
  const totalDeliveredOrders = await Order.count({
    where: {
      createdAt: { [Op.gte]: startDate },
      orderStatus: { [Op.eq]: ORDER_STATUS.DELIVERED },
    },
  })
  const totalShippingOrders = await Order.count({
    where: {
      createdAt: { [Op.gte]: startDate },
      orderStatus: { [Op.eq]: ORDER_STATUS.SHIPPING },
    },
  })
  const totalCancelledOrders = await Order.count({
    where: {
      createdAt: { [Op.gte]: startDate },
      orderStatus: { [Op.eq]: ORDER_STATUS.CANCELLED },
    },
  })

  return {
    totalOrders,
    totalPendingOrders,
    totalDeliveredOrders,
    totalShippingOrders,
    totalCancelledOrders,
  }
}

export const calculateTotalEarnings = async ({
  startDateString,
  endDateString,
}) => {
  const orders = await Order.findAll({
    where: {
      [Op.and]: [
        {
          createdAt: {
            [Op.between]: [startDateString, endDateString],
          },
        },
        {
          orderStatus: {
            [Op.ne]: ORDER_STATUS.CANCELLED,
          },
        },
      ],
    },
  })

  return orders.reduce((acc, curr) => acc + curr.totalAmount, 0)
}

export const calculateCogs = async ({ startDateString, endDateString }) => {
  const soldProducts = await OrderItem.findAll({
    include: [
      {
        model: Order,
        as: 'order',
        where: {
          createdAt: {
            [Op.between]: [startDateString, endDateString],
          },
          orderStatus: {
            [Op.eq]: ORDER_STATUS.DELIVERED,
          },
        },
        attributes: [],
      },
    ],
    group: ['productId'],
    attributes: [
      'productId',
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold'],
    ],
  })

  let totalCogs = 0

  for (const product of soldProducts) {
    const lots = await BatchProduct.findAll({
      attributes: [[Sequelize.fn('AVG', Sequelize.col('price')), 'avgPrice']],
      where: {
        productId: product.dataValues.productId,
      },
      include: [
        {
          model: Batch,
          as: 'batch',
          attributes: [],
          where: {
            arrivalDate: {
              [Op.lte]: endDateString,
            },
          },
        },
      ],
      group: ['productId'],
    })
    if (lots.length > 0) {
      totalCogs += product.dataValues.totalSold * lots[0].dataValues.avgPrice
    }
  }

  return totalCogs
}

export const calculateProfit = async ({ startDateString, endDateString }) => {
  const totalEarnings = await calculateTotalEarnings({ days: 30 })
  const totalCogs = await calculateCogs({ startDateString, endDateString })
  return totalEarnings - totalCogs
}
