import React, { useEffect, useState } from 'react'
import {
  useGetDashboardDataQuery,
  useGetEarningsComparisonByPeriodQuery,
  useGetProfitComparisonByPeriodQuery,
  useGetTopProductSoldComparisonByPeriodQuery,
} from '@/services/dashboard'
import {
  FaShoppingCart,
  FaCheckCircle,
  FaDollarSign,
  FaMoneyBill,
  FaShoppingBag,
} from 'react-icons/fa'
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'
import { FaChartLine } from 'react-icons/fa6'
import { FcShipped } from 'react-icons/fc'
import { formatCurrency } from '@/utils/currency'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Loading } from '@/components'

const AdminDashboard: React.FC = () => {
  const {
    data: dashboardData,
    error,
    isLoading,
  } = useGetDashboardDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  if (isLoading) return <div className='text-center'>Loading...</div>
  if (error)
    return (
      <div className='text-center text-red-500'>
        Error fetching dashboard data
      </div>
    )

  return (
    <div className='p-6 bg-gray-100 h-full flex flex-col gap-6 px-24 overflow-y-auto'>
      <div className=''>
        <h1 className='text-2xl font-medium mb-6 text-gray-800'>Overview</h1>
        <div className='flex gap-4 w-full justify-between'>
          <div className='bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 w-full'>
            <div className='flex items-center mb-4 gap-2 border-b pb-2'>
              <div className='flex items-center p-3 border border-gray-100 rounded-full bg-yellow-50'>
                <FaShoppingBag className='text-yellow-500 text-xl' />
              </div>
              <h2 className='text-lg font-medium text-black'>New Orders</h2>
            </div>

            <p className='text-2xl font-medium text-black'>
              {dashboardData.totalOrdersData.thisMonth.totalOrders}
            </p>
            <div className='flex items-center gap-2 mt-2'>
              {dashboardData.totalOrdersData.lastMonth.totalOrders <= 0 ? (
                <>
                  <FaArrowTrendUp className='text-green-500' />
                  <p className='text-green-500'>
                    {100}% <span className='text-gray-500'>last month</span>
                  </p>
                </>
              ) : (
                <>
                  {dashboardData.totalOrdersData.thisMonth.totalOrders >
                  dashboardData.totalOrdersData.lastMonth.totalOrders ? (
                    <>
                      <FaArrowTrendUp className='text-green-500' />
                      <p className='text-green-500'>
                        {(
                          ((dashboardData.totalOrdersData.thisMonth
                            .totalOrders -
                            dashboardData.totalOrdersData.lastMonth
                              .totalOrders) /
                            dashboardData.totalOrdersData.lastMonth
                              .totalOrders) *
                          100
                        ).toFixed(2)}
                        % <span className='text-gray-500'>last month</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <FaArrowTrendDown className='text-red-500' />
                      <p className='text-red-500'>
                        {(
                          ((dashboardData.totalOrdersData.lastMonth
                            .totalOrders -
                            dashboardData.totalOrdersData.thisMonth
                              .totalOrders) /
                            dashboardData.totalOrdersData.thisMonth
                              .totalOrders) *
                          100
                        ).toFixed(2)}
                        % <span className='text-gray-500'>last month</span>
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 w-full'>
            <div className='flex items-center mb-4 gap-2 border-b pb-2'>
              <div className='flex items-center p-3 border border-gray-100 rounded-full bg-green-50 '>
                <FaMoneyBill className='text-green-500 text-xl' />
              </div>
              <h2 className='text-lg font-medium text-black'>Earnings</h2>
            </div>

            <p className='text-2xl font-medium text-black mt-2'>
              {formatCurrency(dashboardData.totalEarningsData.thisMonth)}
            </p>
            <div className='flex items-center gap-2 mt-2'>
              {dashboardData.totalEarningsData.lastMonth <= 0 ? (
                <>
                  <FaArrowTrendUp className='text-green-500' />
                  <p className='text-green-500'>
                    {100}% <span className='text-gray-500'>last month</span>
                  </p>
                </>
              ) : (
                <>
                  {dashboardData.totalEarningsData.thisMonth >
                  dashboardData.totalEarningsData.lastMonth ? (
                    <>
                      <FaArrowTrendUp className='text-green-500' />
                      <p className='text-green-500'>
                        {(
                          ((dashboardData.totalEarningsData.thisMonth -
                            dashboardData.totalEarningsData.lastMonth) /
                            dashboardData.totalEarningsData.lastMonth) *
                          100
                        ).toFixed(2)}
                        % <span className='text-gray-500'>last month</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <FaArrowTrendDown className='text-red-500' />
                      <p className='text-red-500'>
                        {(
                          ((dashboardData.totalEarningsData.lastMonth -
                            dashboardData.totalEarningsData.thisMonth) /
                            dashboardData.totalEarningsData.thisMonth) *
                          100
                        ).toFixed(2)}
                        % <span className='text-gray-500'>last month</span>
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 w-full'>
            <div className='flex items-center mb-4 gap-2 border-b pb-2'>
              <div className='flex items-center p-3 border border-gray-100 rounded-full bg-blue-50'>
                <FaChartLine className='text-blue-500 text-xl' />
              </div>
              <h2 className='text-lg font-medium text-black'>Profit</h2>
            </div>

            <p
              className={`text-2xl font-medium text-black mt-2 ${
                dashboardData.totalProfitData.thisMonth <= 0
                  ? 'text-red-500'
                  : 'text-black'
              }`}
            >
              {formatCurrency(dashboardData.totalProfitData.thisMonth)}
            </p>
            <div className='flex items-center gap-2 mt-2'>
              {dashboardData.totalProfitData.lastMonth <= 0 &&
              dashboardData.totalProfitData.thisMonth > 0 ? (
                <>
                  <FaArrowTrendUp className='text-green-500' />
                  <p className='text-green-500'>
                    {100}% <span className='text-gray-500'>last month</span>
                  </p>
                </>
              ) : (
                <>
                  {dashboardData.totalProfitData.thisMonth >
                  dashboardData.totalProfitData.lastMonth ? (
                    <>
                      <FaArrowTrendUp className='text-green-500' />
                      <p className='text-green-500'>
                        {(
                          ((dashboardData.totalProfitData.thisMonth -
                            dashboardData.totalProfitData.lastMonth) /
                            dashboardData.totalProfitData.lastMonth) *
                          100
                        ).toFixed(2)}
                        % <span className='text-gray-500'>last month</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <FaArrowTrendDown className='text-red-500' />
                      <p className='text-red-500'>
                        {(
                          ((dashboardData.totalProfitData.lastMonth -
                            dashboardData.totalProfitData.thisMonth) /
                            dashboardData.totalProfitData.thisMonth) *
                          100
                        ).toFixed(2)}
                        % <span className='text-gray-500'>last month</span>
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 w-full'>
            <div className='flex items-center mb-4 gap-2 border-b pb-2'>
              <div className='flex items-center p-3 border border-gray-100 rounded-full bg-blue-50'>
                <FaChartLine className='text-blue-500 text-xl' />
              </div>
              <h2 className='text-lg font-medium text-black'>New Customers</h2>
            </div>

            <p
              className={`text-2xl font-medium text-black mt-2 ${
                dashboardData.totalNewCustomersData.thisMonth <= 0
                  ? 'text-red-500'
                  : 'text-black'
              }`}
            >
              {dashboardData.totalNewCustomersData.thisMonth}
            </p>
            <div className='flex items-center gap-2 mt-2'>
              {dashboardData.totalNewCustomersData.lastMonth <= 0 &&
              dashboardData.totalNewCustomersData.thisMonth > 0 ? (
                <>
                  <FaArrowTrendUp className='text-green-500' />
                  <p className='text-green-500'>
                    {100}% <span className='text-gray-500'>last month</span>
                  </p>
                </>
              ) : (
                <>
                  {dashboardData.totalNewCustomersData.thisMonth >
                  dashboardData.totalNewCustomersData.lastMonth ? (
                    <>
                      <FaArrowTrendUp className='text-green-500' />
                      <p className='text-green-500'>
                        {(
                          ((dashboardData.totalNewCustomersData.thisMonth -
                            dashboardData.totalNewCustomersData.lastMonth) /
                            dashboardData.totalNewCustomersData.lastMonth) *
                          100
                        ).toFixed(2)}
                        % <span className='text-gray-500'>last month</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <FaArrowTrendDown className='text-red-500' />
                      <p className='text-red-500'>
                        {(
                          ((dashboardData.totalProfitData.lastMonth -
                            dashboardData.totalNewCustomersData.thisMonth) /
                            dashboardData.totalNewCustomersData.thisMonth) *
                          100
                        ).toFixed(2)}
                        % <span className='text-gray-500'>last month</span>
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className=' grid md:grid-cols-2 grid-cols-1 gap-4'>
        <ChartRevenue />
        <ChartProfit />
      </div>
      <TableTopProductSold />
    </div>
  )
}

const ChartRevenue: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('day')
  const [isLoading, setIsLoading] = useState(true)
  const {
    data: earningsComparisonByPeriodData,
    refetch,
    isFetching,
  } = useGetEarningsComparisonByPeriodQuery({ period: selectedPeriod })

  useEffect(() => {
    setIsLoading(true)
    refetch().finally(() => setIsLoading(false))
  }, [selectedPeriod])

  const getDataKey = () => {
    switch (selectedPeriod) {
      case 'day':
        return { current: 'today', previous: 'yesterday' }
      case 'week':
        return { current: 'thisWeek', previous: 'lastWeek' }
      case 'month':
        return { current: 'thisMonth', previous: 'lastMonth' }
      case 'year':
        return { current: 'thisYear', previous: 'lastYear' }
      default:
        return { current: 'thisYear', previous: 'lastYear' }
    }
  }

  const { current, previous } = getDataKey()

  return (
    <div className='bg-white p-6 rounded-2xl shadow-lg h-[300px]'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold mb-4'>Revenue Analytics</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className='flex items-center gap-2 select select-sm'
        >
          <option className='text-gray-500' value='day'>
            Day
          </option>
          <option className='text-gray-500' value='week'>
            Week
          </option>
          <option className='text-gray-500' value='month'>
            Month
          </option>
          <option className='text-gray-500' value='year'>
            Yearly
          </option>
        </select>
      </div>
      {isLoading || isFetching ? (
        <div className='text-center flex items-center justify-center h-full'>
          <Loading />
        </div>
      ) : (
        <ResponsiveContainer width='100%' height='90%'>
          <LineChart
            data={earningsComparisonByPeriodData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const previousValue = payload[0].payload[previous]
                  const currentValue = payload[1].payload[current]

                  const percentageChange =
                    ((currentValue - previousValue) / previousValue) * 100
                  return (
                    <div className='custom-tooltip p-2 bg-white shadow-md rounded text-sm'>
                      <p className='text-sm text-gray-700'>
                        <span className='capitalize text-[#3e8ab3]'>
                          {previous} :{' '}
                        </span>
                        {formatCurrency(previousValue)}
                      </p>
                      <p className='text-sm text-gray-700 mt-2'>
                        <span className='capitalize text-[#3027db]'>
                          {current} :{' '}
                        </span>
                        {formatCurrency(currentValue)}{' '}
                        {previousValue <= 0 ? (
                          currentValue > 0 ? (
                            <>
                              <span className='text-green-500 text-xs'>
                                <FaArrowTrendUp /> {100}%
                              </span>
                            </>
                          ) : (
                            <>
                              <span className='text-red-500 text-xs'>
                                <FaArrowTrendDown /> {0}%
                              </span>
                            </>
                          )
                        ) : (
                          <span
                            className={`${
                              percentageChange >= 0
                                ? 'text-green-500'
                                : 'text-red-500'
                            }`}
                          >
                            <span className='text-xs'>
                              {percentageChange >= 0 ? (
                                <FaArrowTrendUp />
                              ) : (
                                <FaArrowTrendDown />
                              )}{' '}
                              {percentageChange.toFixed(2)}%
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey={current}
              stroke='#052df5'
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type='monotone'
              dataKey={previous}
              stroke='#6e9cb5'
              strokeWidth={2}
              dot={{ r: 4 }}
              strokeDasharray='5 5'
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

const ChartProfit: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('day')
  const [isLoading, setIsLoading] = useState(true)
  const {
    data: profitComparisonByPeriodData,
    refetch,
    isFetching,
  } = useGetProfitComparisonByPeriodQuery({ period: selectedPeriod })

  useEffect(() => {
    setIsLoading(true)
    refetch().finally(() => setIsLoading(false))
  }, [selectedPeriod])

  const getDataKey = () => {
    switch (selectedPeriod) {
      case 'day':
        return { current: 'today', previous: 'yesterday' }
      case 'week':
        return { current: 'thisWeek', previous: 'lastWeek' }
      case 'month':
        return { current: 'thisMonth', previous: 'lastMonth' }
      case 'year':
        return { current: 'thisYear', previous: 'lastYear' }
      default:
        return { current: 'thisYear', previous: 'lastYear' }
    }
  }

  const { current, previous } = getDataKey()

  return (
    <div className='bg-white p-6 rounded-2xl shadow-lg h-[300px]'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold mb-4'>Profit Analytics</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className='flex items-center gap-2 select select-sm'
        >
          <option className='text-gray-500' value='day'>
            Day
          </option>
          <option className='text-gray-500' value='week'>
            Week
          </option>
          <option className='text-gray-500' value='month'>
            Month
          </option>
          <option className='text-gray-500' value='year'>
            Yearly
          </option>
        </select>
      </div>
      {isLoading || isFetching ? (
        <div className='text-center flex items-center justify-center h-full'>
          <Loading />
        </div>
      ) : (
        <ResponsiveContainer width='100%' height='90%'>
          <LineChart
            data={profitComparisonByPeriodData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const previousValue = payload[0].payload[previous]
                  const currentValue = payload[1].payload[current]

                  const percentageChange =
                    ((currentValue - previousValue) / previousValue) * 100
                  return (
                    <div className='custom-tooltip p-2 bg-white shadow-md rounded text-sm'>
                      <p className='text-sm text-gray-700'>
                        <span className='capitalize text-[#3e8ab3]'>
                          {previous} :{' '}
                        </span>
                        {formatCurrency(previousValue)}
                      </p>
                      <p className='text-sm text-gray-700 mt-2'>
                        <span className='capitalize text-[#3027db]'>
                          {current} :{' '}
                        </span>
                        {formatCurrency(currentValue)}{' '}
                        {previousValue <= 0 ? (
                          currentValue > 0 ? (
                            <>
                              <span className='text-green-500 text-xs'>
                                <FaArrowTrendUp /> {100}%
                              </span>
                            </>
                          ) : (
                            <>
                              <span className='text-red-500 text-xs'>
                                <FaArrowTrendDown /> {0}%
                              </span>
                            </>
                          )
                        ) : (
                          <span
                            className={`${
                              percentageChange >= 0
                                ? 'text-green-500'
                                : 'text-red-500'
                            }`}
                          >
                            <span className='text-xs'>
                              {percentageChange >= 0 ? (
                                <FaArrowTrendUp />
                              ) : (
                                <FaArrowTrendDown />
                              )}{' '}
                              {percentageChange.toFixed(2)}%
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey={current}
              stroke='#052df5'
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type='monotone'
              dataKey={previous}
              stroke='#6e9cb5'
              strokeWidth={2}
              dot={{ r: 4 }}
              strokeDasharray='5 5'
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

const TableTopProductSold: React.FC = () => {
  const {
    data: topProductSoldData,
    isLoading,
    error,
  } = useGetTopProductSoldComparisonByPeriodQuery({ period: 'month' })
  return (
    <div className='overflow-x-auto px-2 bg-white p-6 rounded-2xl shadow-lg'>
      <table className='table w-full table-fixed'>
        <thead className=''>
          <tr>
            <th className='w-36 text-center uppercase text-sm text-gray-600'>
              Item
            </th>
            <th className='uppercase text-sm text-gray-600'>Name</th>
            <th className='w-32 text-center uppercase text-sm text-gray-600'>
              Price
            </th>
            <th className='w-32 text-center uppercase text-sm text-gray-600'>
              Sold
            </th>
            <th className=' w-48 text-center uppercase text-sm text-gray-600'>
              Sales
            </th>
          </tr>
        </thead>
        <tbody className='text-sm max-h-[300px] overflow-y-auto'>
          {topProductSoldData?.map((product: any, index: number) => (
            <tr key={index}>
              <td className='flex items-center justify-center'>
                <img
                  src={product.product.mainImage}
                  alt={product.name}
                  className='h-20 w-20 rounded-full'
                />
                <span>{product.name}</span>
              </td>
              <td>{product.product.name}</td>
              <td className='text-center'>
                {formatCurrency(product.product.standardPrice)}
              </td>
              <td className='text-center'>{product.totalSold}</td>
              <td className='text-center'>
                {formatCurrency(product.totalEarnings)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { AdminDashboard }
