import {
  Order,
  OrderItem,
  Batch,
  BatchProduct,
  Product,
  Account,
  OrderItemBatch,
  PriceHistory,
} from '@/models'
import { models } from '@/models'
import { Op } from 'sequelize'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Sequelize } from 'sequelize'
import { ORDER_STATUS } from '@/enum'

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
            [Op.eq]: ORDER_STATUS.DELIVERED,
          },
        },
      ],
    },
  })

  return orders.reduce((acc, curr) => acc + curr.totalAmount - curr.discount, 0)
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
              orderStatus: { [Op.eq]: ORDER_STATUS.DELIVERED },
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
  const now = global.dayjs()
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const earningsComparison = await Promise.all(
    hours.map(async (hour) => {
      const startOfHour = now.subtract(24 - hour, 'hour').format(DATE_FORMAT)
      const endOfHour = now.subtract(23 - hour, 'hour').format(DATE_FORMAT)

      const earnings = await calculateTotalEarnings({
        startDateString: startOfHour,
        endDateString: endOfHour,
      })

      return {
        name: `${now.subtract(23 - hour, 'hour').format('DD/MM')} ${now
          .subtract(23 - hour, 'hour')
          .format('HH')}h`,
        revenue: earnings,
      }
    })
  )

  return earningsComparison
}

export const calculateEarningsComparisonByWeek = async () => {
  const now = global.dayjs()
  const days = Array.from({ length: 7 }, (_, i) => i)

  const earningsComparison = await Promise.all(
    days.map(async (day) => {
      const startOfDay = now
        .subtract(6 - day, 'day')
        .startOf('day')
        .format(DATE_FORMAT)
      const endOfDay = now
        .subtract(6 - day, 'day')
        .endOf('day')
        .format(DATE_FORMAT)

      const earnings = await calculateTotalEarnings({
        startDateString: startOfDay,
        endDateString: endOfDay,
      })

      return {
        name: now.subtract(6 - day, 'day').format('DD/MM'),
        revenue: earnings,
      }
    })
  )
  return earningsComparison
}

export const calculateEarningsComparisonByMonth = async () => {
  const now = global.dayjs()
  const days = Array.from({ length: 30 }, (_, i) => i)

  const earningsComparison = await Promise.all(
    days.map(async (day) => {
      const startOfDay = now
        .subtract(29 - day, 'day')
        .startOf('day')
        .format(DATE_FORMAT)
      const endOfDay = now
        .subtract(29 - day, 'day')
        .endOf('day')
        .format(DATE_FORMAT)

      const earnings = await calculateTotalEarnings({
        startDateString: startOfDay,
        endDateString: endOfDay,
      })

      return {
        name: now.subtract(29 - day, 'day').format('DD/MM'),
        revenue: earnings,
      }
    })
  )

  return earningsComparison
}

export const calculateEarningsComparisonByYear = async () => {
  const startOfYear = global.dayjs().startOf('year')
  const currentMonth = global.dayjs().month()
  const months = Array.from({ length: currentMonth + 1 }, (_, i) => i)

  const earningsComparison = []
  for (const month of months) {
    const startOfMonth = startOfYear.add(month, 'month').format(DATE_FORMAT)
    const endOfMonth = startOfYear.add(month + 1, 'month').format(DATE_FORMAT)

    const earnings = await calculateTotalEarnings({
      startDateString: startOfMonth,
      endDateString: endOfMonth,
    })

    earningsComparison.push({
      name: dayjs(startOfMonth).format('MMM'),
      revenue: earnings,
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
  const now = global.dayjs()
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const profitComparison = await Promise.all(
    hours.map(async (hour) => {
      const startOfHour = now.subtract(24 - hour, 'hour').format(DATE_FORMAT)
      const endOfHour = now.subtract(23 - hour, 'hour').format(DATE_FORMAT)

      const profit = await calculateProfit({
        startDateString: startOfHour,
        endDateString: endOfHour,
      })

      return {
        name: `${now.subtract(23 - hour, 'hour').format('DD/MM')} ${now
          .subtract(23 - hour, 'hour')
          .format('HH')}h`,
        profit: profit,
      }
    })
  )

  return profitComparison
}

export const calculateProfitComparisonByWeek = async () => {
  const now = global.dayjs()
  const days = Array.from({ length: 7 }, (_, i) => i)

  const profitComparison = await Promise.all(
    days.map(async (day) => {
      const startOfDay = now
        .subtract(6 - day, 'day')
        .startOf('day')
        .format(DATE_FORMAT)
      const endOfDay = now
        .subtract(6 - day, 'day')
        .endOf('day')
        .format(DATE_FORMAT)

      const profit = await calculateProfit({
        startDateString: startOfDay,
        endDateString: endOfDay,
      })

      return {
        name: now.subtract(6 - day, 'day').format('DD/MM'),
        profit: profit,
      }
    })
  )
  return profitComparison
}

export const calculateProfitComparisonByMonth = async () => {
  const now = global.dayjs()
  const days = Array.from({ length: 30 }, (_, i) => i)

  const productAnalyticsData = await Promise.all(
    days.map(async (day) => {
      const startDateString = now
        .subtract(29 - day, 'day')
        .startOf('day')
        .format(DATE_FORMAT)
      const endDateString = now
        .subtract(29 - day, 'day')
        .endOf('day')
        .format(DATE_FORMAT)

      const profit = await calculateProfit({
        startDateString,
        endDateString,
      })

      return {
        name: now.subtract(29 - day, 'day').format('DD/MM'),
        profit: profit,
      }
    })
  )
  return productAnalyticsData
}

export const calculateProfitComparisonByYear = async () => {
  const startOfYear = global.dayjs().startOf('year')
  const currentMonth = global.dayjs().month()
  const months = Array.from({ length: currentMonth + 1 }, (_, i) => i)

  const profitComparison = []
  for (const month of months) {
    const startOfMonth = startOfYear.add(month, 'month').format(DATE_FORMAT)
    const endOfMonth = startOfYear.add(month + 1, 'month').format(DATE_FORMAT)

    const profit = await calculateProfit({
      startDateString: startOfMonth,
      endDateString: endOfMonth,
    })

    profitComparison.push({
      name: dayjs(startOfMonth).format('MMM'),
      profit: profit,
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
          orderStatus: { [Op.eq]: ORDER_STATUS.DELIVERED },
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
      'product.slug',
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
      startDateString = global.dayjs().startOf('day').format(DATE_FORMAT)
      endDateString = global.dayjs().endOf('day').format(DATE_FORMAT)
      return await calculateTopProductSoldComparisonInTimePeriod({
        startDateString,
        endDateString,
      })
    case 'week':
      startDateString = global.dayjs().startOf('week').format(DATE_FORMAT)
      endDateString = global.dayjs().endOf('week').format(DATE_FORMAT)
      return await calculateTopProductSoldComparisonInTimePeriod({
        startDateString,
        endDateString,
      })
    case 'month':
      startDateString = global.dayjs().startOf('month').format(DATE_FORMAT)
      endDateString = global.dayjs().endOf('month').format(DATE_FORMAT)
      return await calculateTopProductSoldComparisonInTimePeriod({
        startDateString,
        endDateString,
      })
    case 'year':
      startDateString = global.dayjs().startOf('year').format(DATE_FORMAT)
      endDateString = global.dayjs().endOf('year').format(DATE_FORMAT)
      return await calculateTopProductSoldComparisonInTimePeriod({
        startDateString,
        endDateString,
      })
    default:
      return []
  }
}

// Sale Analytics
export const getProductSalesDataByPeriod = async ({ period }) => {
  let startDateString
  let endDateString
  const now = global.dayjs()

  switch (period) {
    case 'day':
      startDateString = now.subtract(24, 'hour').format(DATE_FORMAT)
      endDateString = now.format(DATE_FORMAT)
      return await getProductSalesData({ startDateString, endDateString })
    case 'week':
      startDateString = now.subtract(7, 'day').format(DATE_FORMAT)
      endDateString = now.format(DATE_FORMAT)
      return await getProductSalesData({ startDateString, endDateString })
    case 'month':
      startDateString = now.subtract(30, 'day').format(DATE_FORMAT)
      endDateString = now.format(DATE_FORMAT)
      return await getProductSalesData({ startDateString, endDateString })
    case 'year':
      startDateString = now.startOf('year').format(DATE_FORMAT)
      endDateString = now.endOf('year').format(DATE_FORMAT)
      return await getProductSalesData({ startDateString, endDateString })
  }
}
export const getProductSalesData = async ({
  startDateString,
  endDateString,
}) => {
  const productSalesData = await Product.findAll({
    attributes: [
      'id',
      'name',
      'slug',
      'mainImage',
      [
        Sequelize.fn(
          'COALESCE',
          Sequelize.fn('SUM', Sequelize.col('orderItems.quantity')),
          0
        ),
        'totalQuantitySold',
      ],
      [
        Sequelize.fn(
          'COALESCE',
          Sequelize.fn(
            'SUM',
            Sequelize.literal(
              '`orderItems`.`price` * (1 - `orderItems`.`discount` / 100) * `orderItems`.`quantity`'
            )
          ),
          0
        ),
        'totalRevenue',
      ],
      [
        Sequelize.literal(`
          COALESCE(
            SUM(
              \`orderItems\`.\`price\` * (1 - \`orderItems\`.\`discount\` / 100) * \`orderItems\`.\`quantity\` - 
              \`orderItems->orderItemBatches\`.\`quantity\` * \`batchProducts\`.\`price\`
            ),
            0
          )
        `),
        'totalProfit',
      ],
    ],
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        attributes: [],
        required: false,
        include: [
          {
            model: Order,
            as: 'order',
            attributes: [],
            required: true,
            where: {
              createdAt: {
                [Op.between]: [startDateString, endDateString],
              },
              orderStatus: {
                [Op.eq]: ORDER_STATUS.DELIVERED,
              },
            },
          },
          {
            model: OrderItemBatch,
            as: 'orderItemBatches',
            attributes: [],
            required: false,
          },
        ],
      },
      {
        model: BatchProduct,
        as: 'batchProducts',
        attributes: [],
        required: false,
      },
    ],
    group: ['Product.id'],
    order: [[Sequelize.literal('totalQuantitySold'), 'DESC']],
  })

  return productSalesData
}

//chart product analytics
export const getProductAnalyticsData = async ({
  productId,
  startDateString,
  endDateString,
}) => {
  const productAnalyticsData = await Product.findOne({
    where: { id: productId },
    attributes: [
      'id',
      'name',
      'mainImage',
      [
        Sequelize.fn(
          'COALESCE',
          Sequelize.fn('SUM', Sequelize.col('orderItems.quantity')),
          0
        ),
        'totalQuantitySold',
      ],
      [
        Sequelize.fn(
          'COALESCE',
          Sequelize.fn(
            'SUM',
            Sequelize.literal(
              '`orderItems`.`price` * (1 - `orderItems`.`discount` / 100) * `orderItems`.`quantity`'
            )
          ),
          0
        ),
        'totalRevenue',
      ],
      [
        Sequelize.literal(`
          COALESCE(
            SUM(
              \`orderItems\`.\`price\` * (1 - \`orderItems\`.\`discount\` / 100) * \`orderItems\`.\`quantity\` - 
              \`orderItems->orderItemBatches\`.\`quantity\` * \`batchProducts\`.\`price\`
            ),
            0
          )
        `),
        'totalProfit',
      ],
    ],
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        attributes: [],
        required: false,
        include: [
          {
            model: Order,
            as: 'order',
            attributes: [],
            required: true,
            where: {
              createdAt: {
                [Op.between]: [startDateString, endDateString],
              },
              orderStatus: {
                [Op.eq]: ORDER_STATUS.DELIVERED,
              },
            },
          },
          {
            model: OrderItemBatch,
            as: 'orderItemBatches',
            attributes: [],
            required: false,
          },
        ],
      },
      {
        model: BatchProduct,
        as: 'batchProducts',
        attributes: [],
        required: false,
      },
    ],
    group: ['Product.id'],
    order: [[Sequelize.literal('totalQuantitySold'), 'DESC']],
  })

  return productAnalyticsData.toJSON()
}

export const getChartProductAnalyticsDataByPeriod = async ({
  period,
  productId,
}) => {
  switch (period) {
    case 'day':
      return await getChartProductAnalyticsDataInDay({ productId })
    case 'week':
      return await getChartProductAnalyticsDataInWeek({ productId })
    case 'month':
      return await getChartProductAnalyticsDataInMonth({ productId })
    case 'year':
      return await getChartProductAnalyticsDataInYear({ productId })
    default:
      return []
  }
}

export const getChartProductAnalyticsDataInDay = async ({ productId }) => {
  const now = global.dayjs()
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const productAnalyticsData = await Promise.all(
    hours.map(async (hour) => {
      const startDateString = now
        .subtract(23 - hour, 'hour')
        .startOf('hour')
        .format(DATE_FORMAT)
      const endDateString = now
        .subtract(22 - hour, 'hour')
        .startOf('hour')
        .format(DATE_FORMAT)

      const productAnalyticsData = await getProductAnalyticsData({
        productId,
        startDateString,
        endDateString,
      })
      return {
        name: `${now.subtract(23 - hour, 'hour').format('DD/MM')} ${now
          .subtract(23 - hour, 'hour')
          .format('HH:00')}`,
        totalQuantitySold: productAnalyticsData.totalQuantitySold,
        totalRevenue: productAnalyticsData.totalRevenue,
        totalProfit: productAnalyticsData.totalProfit,
      }
    })
  )
  return productAnalyticsData
}

export const getChartProductAnalyticsDataInWeek = async ({ productId }) => {
  const now = global.dayjs()
  const days = Array.from({ length: 7 }, (_, i) => i)

  const productAnalyticsData = await Promise.all(
    days.map(async (day) => {
      const startDateString = now
        .subtract(6 - day, 'day')
        .startOf('day')
        .format(DATE_FORMAT)
      const endDateString = now
        .subtract(6 - day, 'day')
        .endOf('day')
        .format(DATE_FORMAT)

      const productAnalyticsData = await getProductAnalyticsData({
        productId,
        startDateString,
        endDateString,
      })
      return {
        name: now.subtract(6 - day, 'day').format('DD/MM'),
        totalQuantitySold: productAnalyticsData.totalQuantitySold,
        totalRevenue: productAnalyticsData.totalRevenue,
        totalProfit: productAnalyticsData.totalProfit,
      }
    })
  )
  return productAnalyticsData
}

export const getChartProductAnalyticsDataInMonth = async ({ productId }) => {
  const now = global.dayjs()
  const days = Array.from({ length: 30 }, (_, i) => i)

  const productAnalyticsData = await Promise.all(
    days.map(async (day) => {
      const startDateString = now
        .subtract(29 - day, 'day')
        .startOf('day')
        .format(DATE_FORMAT)
      const endDateString = now
        .subtract(29 - day, 'day')
        .endOf('day')
        .format(DATE_FORMAT)

      const productAnalyticsData = await getProductAnalyticsData({
        productId,
        startDateString,
        endDateString,
      })
      return {
        name: now.subtract(29 - day, 'day').format('DD/MM'),
        totalQuantitySold: productAnalyticsData.totalQuantitySold,
        totalRevenue: productAnalyticsData.totalRevenue,
        totalProfit: productAnalyticsData.totalProfit,
      }
    })
  )
  return productAnalyticsData
}

export const getChartProductAnalyticsDataInYear = async ({ productId }) => {
  const startOfYear = global.dayjs().startOf('year')
  const months = Array.from({ length: 12 }, (_, i) => i)

  const productAnalyticsData = await Promise.all(
    months.map(async (month) => {
      const startDateString = startOfYear
        .add(month, 'month')
        .format(DATE_FORMAT)
      const endDateString = startOfYear
        .add(month, 'month')
        .endOf('month')
        .format(DATE_FORMAT)
      const productAnalyticsData = await getProductAnalyticsData({
        productId,
        startDateString,
        endDateString,
      })
      return {
        name: startOfYear.add(month, 'month').format('MMM'),
        totalQuantitySold: productAnalyticsData.totalQuantitySold,
        totalRevenue: productAnalyticsData.totalRevenue,
        totalProfit: productAnalyticsData.totalProfit,
      }
    })
  )
  return productAnalyticsData
}

export const getProductPriceHistory = async ({ productId }) => {
  const priceHistories = await PriceHistory.findAll({
    where: { productId },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['name', 'mainImage'],
      },
    ],
    order: [['changedAt', 'DESC']],
  })

  const priceHistoryWithMetrics = await Promise.all(
    priceHistories.map(async (history) => {
      const nextHistory = await PriceHistory.findOne({
        where: {
          productId,
          changedAt: { [Op.gt]: history.changedAt },
        },
        order: [['changedAt', 'ASC']],
      })

      const endDate = nextHistory
        ? nextHistory.changedAt
        : global.dayjs().format(DATE_FORMAT)

      // Get sales and revenue
      const salesMetrics = await OrderItem.findOne({
        attributes: [
          [
            Sequelize.fn('SUM', Sequelize.col('OrderItem.quantity')),
            'totalQuantitySold',
          ],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                '`OrderItem`.`price` * (1 - `OrderItem`.`discount` / 100) * `OrderItem`.`quantity`'
              )
            ),
            'totalRevenue',
          ],
        ],
        include: [
          {
            model: Order,
            as: 'order',
            attributes: [],
            required: true,
            where: {
              createdAt: {
                [Op.between]: [history.changedAt, endDate],
              },
              orderStatus: ORDER_STATUS.DELIVERED,
            },
          },
        ],
        where: { productId },
        raw: true,
      })

      const orderItemBatches = await OrderItemBatch.findAll({
        attributes: ['quantity'],
        include: [
          {
            model: OrderItem,
            as: 'orderItem',
            required: true,
            include: [
              {
                model: Order,
                as: 'order',
                required: true,
                where: {
                  createdAt: {
                    [Op.between]: [history.changedAt, endDate],
                  },
                  orderStatus: ORDER_STATUS.DELIVERED,
                },
              },
            ],
            where: { productId },
          },
          {
            model: Batch,
            as: 'batch',
            required: true,
            include: [
              {
                model: BatchProduct,
                as: 'batchProducts',
                required: true,
                where: { productId },
                attributes: ['price'],
              },
            ],
          },
        ],
      })

      let totalCogs = 0
      for (const batch of orderItemBatches) {
        totalCogs += batch.quantity * batch.batch.batchProducts[0].price
      }

      return {
        id: history.id,
        oldPrice: history.oldPrice,
        newPrice: history.newPrice,
        changedAt: history.changedAt,
        changedBy: history.changedBy,
        product: history.product,
        periodStart: history.changedAt,
        periodEnd: endDate,
        totalQuantitySold: parseInt(salesMetrics?.totalQuantitySold || 0),
        totalRevenue: parseFloat(salesMetrics?.totalRevenue || 0),
        totalProfit: parseFloat((salesMetrics?.totalRevenue || 0) - totalCogs),
      }
    })
  )

  return priceHistoryWithMetrics
}
