import {
  Order,
  OrderItem,
  Batch,
  BatchProduct,
  Product,
  Account,
  OrderItemBatch,
} from '@/models'
import { models } from '@/models'
import { Op } from 'sequelize'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Sequelize } from 'sequelize'
import { ORDER_STATUS } from '@/enum'
import { gte } from 'lodash'
import { mode } from 'crypto-js'
dayjs.extend(customParseFormat)

const { DATE_FORMAT } = process.env

export const calculateTotalOrders = async ({
  startDateString,
  endDateString,
}) => {
  const totalOrders = await Order.count({
    where: {
      createdAt: {
        [Op.between]: [startDateString, endDateString],
      },
    },
  })

  const totalPendingOrders = await Order.count({
    where: {
      createdAt: { [Op.between]: [startDateString, endDateString] },
      orderStatus: { [Op.eq]: ORDER_STATUS.PENDING },
    },
  })
  const totalDeliveredOrders = await Order.count({
    where: {
      createdAt: { [Op.between]: [startDateString, endDateString] },
      orderStatus: { [Op.eq]: ORDER_STATUS.DELIVERED },
    },
  })
  const totalShippingOrders = await Order.count({
    where: {
      createdAt: { [Op.between]: [startDateString, endDateString] },
      orderStatus: { [Op.eq]: ORDER_STATUS.SHIPPING },
    },
  })
  const totalCancelledOrders = await Order.count({
    where: {
      createdAt: { [Op.between]: [startDateString, endDateString] },
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
  const orderItemBatches = await OrderItemBatch.findAll({
    include: [
      {
        model: models.OrderItem,
        as: 'orderItem',
        required: true,
        include: [
          {
            model: models.Order,
            as: 'order',
            where: {
              createdAt: { [Op.between]: [startDateString, endDateString] },
              orderStatus: { [Op.ne]: ORDER_STATUS.CANCELLED },
            },
          },
        ],
      },
    ],
  })

  let totalCogs = 0

  for (const orderItemBatch of orderItemBatches) {
    const batchProduct = await models.BatchProduct.findOne({
      where: {
        batchId: orderItemBatch.batchId,
        productId: orderItemBatch.orderItem.productId,
      },
    })
    if (batchProduct) {
      totalCogs += orderItemBatch.quantity * batchProduct.price
    }
  }

  return totalCogs
}

export const calculateProfit = async ({ startDateString, endDateString }) => {
  const totalEarnings = await calculateTotalEarnings({
    startDateString,
    endDateString,
  })
  const totalCogs = await calculateCogs({ startDateString, endDateString })
  return totalEarnings - totalCogs
}

export const getTotalNewCustomers = async ({
  startDateString,
  endDateString,
}) => {
  const totalNewCustomers = await Account.count({
    where: { createdAt: { [Op.between]: [startDateString, endDateString] } },
  })
  return totalNewCustomers
}

// Chart Earnings(Revenue)
export const calculateEarningsComparisonByHour = async () => {
  const today = dayjs().startOf('day')
  const yesterday = dayjs().subtract(1, 'day').startOf('day')
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const earningsComparison = await Promise.all(
    hours.map(async (hour) => {
      const startOfTodayHour = today.add(hour, 'hour').format(DATE_FORMAT)
      const endOfTodayHour = today.add(hour + 1, 'hour').format(DATE_FORMAT)
      const startOfYesterdayHour = yesterday
        .add(hour, 'hour')
        .format(DATE_FORMAT)
      const endOfYesterdayHour = yesterday
        .add(hour + 1, 'hour')
        .format(DATE_FORMAT)

      const todayEarnings = await calculateTotalEarnings({
        startDateString: startOfTodayHour,
        endDateString: endOfTodayHour,
      })

      const yesterdayEarnings = await calculateTotalEarnings({
        startDateString: startOfYesterdayHour,
        endDateString: endOfYesterdayHour,
      })

      return {
        name: today.add(hour, 'hour').format('HH:mm'),
        today: todayEarnings,
        yesterday: yesterdayEarnings,
      }
    })
  )

  return earningsComparison
}

export const calculateEarningsComparisonByWeek = async () => {
  const startOfThisWeek = dayjs().startOf('week')
  const startOfLastWeek = dayjs().subtract(1, 'week').startOf('week')
  const days = Array.from({ length: 7 }, (_, i) => i)

  const earningsComparison = []
  for (const day of days) {
    const startOfThisDay = startOfThisWeek.add(day, 'day').format(DATE_FORMAT)
    const endOfThisDay = startOfThisWeek.add(day + 1, 'day').format(DATE_FORMAT)
    const startOfLastDay = startOfLastWeek.add(day, 'day').format(DATE_FORMAT)
    const endOfLastDay = startOfLastWeek.add(day + 1, 'day').format(DATE_FORMAT)
    const earningsThisWeek = await calculateTotalEarnings({
      startDateString: startOfThisDay,
      endDateString: endOfThisDay,
    })
    const earningsLastWeek = await calculateTotalEarnings({
      startDateString: startOfLastDay,
      endDateString: endOfLastDay,
    })
    earningsComparison.push({
      name: startOfThisWeek.add(day, 'day').format('dddd'),
      thisWeek: earningsThisWeek,
      lastWeek: earningsLastWeek,
    })
  }
  return earningsComparison
}

export const calculateEarningsComparisonByMonth = async () => {
  const startOfThisMonth = dayjs().startOf('month')
  const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month')
  const days = Array.from({ length: 30 }, (_, i) => i)

  const earningsComparison = []
  for (const day of days) {
    const startOfThisDay = startOfThisMonth.add(day, 'day').format(DATE_FORMAT)
    const endOfThisDay = startOfThisMonth
      .add(day + 1, 'day')
      .format(DATE_FORMAT)
    const startOfLastDay = startOfLastMonth.add(day, 'day').format(DATE_FORMAT)
    const endOfLastDay = startOfLastMonth
      .add(day + 1, 'day')
      .format(DATE_FORMAT)
    const earningsThisMonth = await calculateTotalEarnings({
      startDateString: startOfThisDay,
      endDateString: endOfThisDay,
    })
    const earningsLastMonth = await calculateTotalEarnings({
      startDateString: startOfLastDay,
      endDateString: endOfLastDay,
    })
    earningsComparison.push({
      name: dayjs(startOfThisDay).format('DD'),
      thisMonth: earningsThisMonth,
      lastMonth: earningsLastMonth,
    })
  }
  return earningsComparison
}

export const calculateEarningsComparisonByYear = async () => {
  const startOfThisYear = dayjs().startOf('year')
  const startOfLastYear = dayjs().subtract(1, 'year').startOf('year')
  const months = Array.from({ length: 12 }, (_, i) => i)

  const earningsComparison = []
  for (const month of months) {
    const startOfThisMonth = startOfThisYear
      .add(month, 'month')
      .format(DATE_FORMAT)
    const endOfThisMonth = startOfThisYear
      .add(month + 1, 'month')
      .format(DATE_FORMAT)
    const startOfLastMonth = startOfLastYear
      .add(month, 'month')
      .format(DATE_FORMAT)
    const endOfLastMonth = startOfLastYear
      .add(month + 1, 'month')
      .format(DATE_FORMAT)
    const earningsThisMonth = await calculateTotalEarnings({
      startDateString: startOfThisMonth,
      endDateString: endOfThisMonth,
    })
    const earningsLastMonth = await calculateTotalEarnings({
      startDateString: startOfLastMonth,
      endDateString: endOfLastMonth,
    })
    earningsComparison.push({
      name: dayjs(startOfThisMonth).format('MMM'),
      thisYear: earningsThisMonth,
      lastYear: earningsLastMonth,
    })
  }
  return earningsComparison
}

export const calculateEarningsComparisonByPeriod = async ({ period }) => {
  switch (period) {
    case 'day':
      return await calculateEarningsComparisonByHour()
    case 'week':
      return await calculateEarningsComparisonByWeek()
    case 'month':
      return await calculateEarningsComparisonByMonth()
    case 'year':
      return await calculateEarningsComparisonByYear()
    default:
      return []
  }
}

// Chart Profit
export const calculateProfitComparisonByHour = async () => {
  const today = dayjs().startOf('day')
  const yesterday = dayjs().subtract(1, 'day').startOf('day')
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const profitComparison = await Promise.all(
    hours.map(async (hour) => {
      const startOfTodayHour = today.add(hour, 'hour').format(DATE_FORMAT)
      const endOfTodayHour = today.add(hour + 1, 'hour').format(DATE_FORMAT)
      const startOfYesterdayHour = yesterday
        .add(hour, 'hour')
        .format(DATE_FORMAT)
      const endOfYesterdayHour = yesterday
        .add(hour + 1, 'hour')
        .format(DATE_FORMAT)

      const todayProfit = await calculateProfit({
        startDateString: startOfTodayHour,
        endDateString: endOfTodayHour,
      })

      const yesterdayProfit = await calculateProfit({
        startDateString: startOfYesterdayHour,
        endDateString: endOfYesterdayHour,
      })

      return {
        name: today.add(hour, 'hour').format('HH:mm'),
        today: todayProfit,
        yesterday: yesterdayProfit,
      }
    })
  )

  return profitComparison
}

export const calculateProfitComparisonByWeek = async () => {
  const startOfThisWeek = dayjs().startOf('week')
  const startOfLastWeek = dayjs().subtract(1, 'week').startOf('week')
  const days = Array.from({ length: 7 }, (_, i) => i)

  const profitComparison = []
  for (const day of days) {
    const startOfThisDay = startOfThisWeek.add(day, 'day').format(DATE_FORMAT)
    const endOfThisDay = startOfThisWeek.add(day + 1, 'day').format(DATE_FORMAT)
    const startOfLastDay = startOfLastWeek.add(day, 'day').format(DATE_FORMAT)
    const endOfLastDay = startOfLastWeek.add(day + 1, 'day').format(DATE_FORMAT)
    const profitThisWeek = await calculateProfit({
      startDateString: startOfThisDay,
      endDateString: endOfThisDay,
    })
    const profitLastWeek = await calculateProfit({
      startDateString: startOfLastDay,
      endDateString: endOfLastDay,
    })
    profitComparison.push({
      name: startOfThisWeek.add(day, 'day').format('dddd'),
      thisWeek: profitThisWeek,
      lastWeek: profitLastWeek,
    })
  }
  return profitComparison
}

export const calculateProfitComparisonByMonth = async () => {
  const startOfThisMonth = dayjs().startOf('month')
  const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month')
  const days = Array.from({ length: 30 }, (_, i) => i)

  const profitComparison = []
  for (const day of days) {
    const startOfThisDay = startOfThisMonth.add(day, 'day').format(DATE_FORMAT)
    const endOfThisDay = startOfThisMonth
      .add(day + 1, 'day')
      .format(DATE_FORMAT)
    const startOfLastDay = startOfLastMonth.add(day, 'day').format(DATE_FORMAT)
    const endOfLastDay = startOfLastMonth
      .add(day + 1, 'day')
      .format(DATE_FORMAT)
    const earningsThisMonth = await calculateProfit({
      startDateString: startOfThisDay,
      endDateString: endOfThisDay,
    })
    const earningsLastMonth = await calculateProfit({
      startDateString: startOfLastDay,
      endDateString: endOfLastDay,
    })
    profitComparison.push({
      name: dayjs(startOfThisDay).format('DD'),
      thisMonth: earningsThisMonth,
      lastMonth: earningsLastMonth,
    })
  }
  return profitComparison
}

export const calculateProfitComparisonByYear = async () => {
  const startOfThisYear = dayjs().startOf('year')
  const startOfLastYear = dayjs().subtract(1, 'year').startOf('year')
  const months = Array.from({ length: 12 }, (_, i) => i)

  const profitComparison = []
  for (const month of months) {
    const startOfThisMonth = startOfThisYear
      .add(month, 'month')
      .format(DATE_FORMAT)
    const endOfThisMonth = startOfThisYear
      .add(month + 1, 'month')
      .format(DATE_FORMAT)
    const startOfLastMonth = startOfLastYear
      .add(month, 'month')
      .format(DATE_FORMAT)
    const endOfLastMonth = startOfLastYear
      .add(month + 1, 'month')
      .format(DATE_FORMAT)
    const earningsThisMonth = await calculateProfit({
      startDateString: startOfThisMonth,
      endDateString: endOfThisMonth,
    })
    const earningsLastMonth = await calculateProfit({
      startDateString: startOfLastMonth,
      endDateString: endOfLastMonth,
    })
    profitComparison.push({
      name: dayjs(startOfThisMonth).format('MMM'),
      thisYear: earningsThisMonth,
      lastYear: earningsLastMonth,
    })
  }
  return profitComparison
}

export const calculateProfitComparisonByPeriod = async ({ period }) => {
  switch (period) {
    case 'day':
      return await calculateProfitComparisonByHour()
    case 'week':
      return await calculateProfitComparisonByWeek()
    case 'month':
      return await calculateProfitComparisonByMonth()
    case 'year':
      return await calculateProfitComparisonByYear()
    default:
      return []
  }
}

// Table Product
export const calculateTopProductSoldComparisonInTimePeriod = async ({
  startDateString,
  endDateString,
}) => {
  const orderItems = await OrderItem.findAll({
    include: [
      {
        model: Order,
        as: 'order',
        where: {
          orderStatus: { [Op.ne]: ORDER_STATUS.CANCELLED },
          createdAt: {
            [Op.between]: [startDateString, endDateString],
          },
        },
        attributes: [],
      },
      { model: Product, as: 'product' },
    ],
    attributes: [
      'productId',
      'product.name',
      'product.mainImage',
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold'],
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal(
            '`OrderItem`.`price` * (1 - `OrderItem`.`discount` / 100)*`OrderItem`.`quantity`'
          )
        ),
        'totalEarnings',
      ],
    ],
    group: ['productId'],
    order: [[Sequelize.col('totalSold'), 'DESC']],
  })

  return orderItems
}
export const calculateTopProductSoldComparisonByPeriod = async ({ period }) => {
  let startDateString
  let endDateString
  switch (period) {
    case 'day':
      startDateString = dayjs().startOf('day').format(DATE_FORMAT)
      endDateString = dayjs().endOf('day').format(DATE_FORMAT)
      return await calculateTopProductSoldComparisonInTimePeriod({
        startDateString,
        endDateString,
      })
    case 'week':
      startDateString = dayjs().startOf('week').format(DATE_FORMAT)
      endDateString = dayjs().endOf('week').format(DATE_FORMAT)
      return await calculateTopProductSoldComparisonInTimePeriod({
        startDateString,
        endDateString,
      })
    case 'month':
      startDateString = dayjs().startOf('month').format(DATE_FORMAT)
      endDateString = dayjs().endOf('month').format(DATE_FORMAT)
      return await calculateTopProductSoldComparisonInTimePeriod({
        startDateString,
        endDateString,
      })
    case 'year':
      startDateString = dayjs().startOf('year').format(DATE_FORMAT)
      endDateString = dayjs().endOf('year').format(DATE_FORMAT)
      return await calculateTopProductSoldComparisonInTimePeriod({
        startDateString,
        endDateString,
      })
    default:
      return []
  }
}
