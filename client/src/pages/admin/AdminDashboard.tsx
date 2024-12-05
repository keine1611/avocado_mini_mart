import React, { useEffect, useState } from 'react'
import {
  useGetDashboardDataQuery,
  useGetEarningsComparisonByPeriodQuery,
  useGetProfitComparisonByPeriodQuery,
  useGetTopProductSoldComparisonByPeriodQuery,
} from '@/services/dashboard'
import { FaMoneyBill, FaShoppingBag } from 'react-icons/fa'
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'
import { FaChartLine } from 'react-icons/fa6'
import { formatCurrency } from '@/utils/currency'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

  if (isLoading)
    return (
      <div className='text-center flex items-center justify-center h-full min-h-80vh'>
        <Loading size='loading-lg' />
      </div>
    )
  if (error)
    return (
      <div className='text-center text-red-500'>
        Error fetching dashboard data
      </div>
    )

  return (
    <div className='py-6 bg-gray-100 h-full flex flex-col gap-6 md:px-24 px-4 overflow-y-auto'>
      <div className=''>
        <h1 className='text-2xl font-medium mb-6 text-gray-800'>Overview</h1>
        <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 w-full justify-between'>
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
              {dashboardData.totalNewCustomersData.lastMonth <= 0 ? (
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
                )
              ) : (
                <>
                  <FaArrowTrendUp className='text-green-500' />
                  <p className='text-green-500'>
                    {100}% <span className='text-gray-500'>last month</span>
                  </p>
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
            The past 24 hours
          </option>
          <option className='text-gray-500' value='week'>
            The past 7 days
          </option>
          <option className='text-gray-500' value='month'>
            The past 30 days
          </option>
          <option className='text-gray-500' value='year'>
            The past year
          </option>
        </select>
      </div>
      {isLoading || isFetching ? (
        <div className='text-center flex items-center justify-center h-full min-80vh'>
          <Loading />
        </div>
      ) : (
        <ResponsiveContainer width='100%' height='90%'>
          <LineChart
            data={earningsComparisonByPeriodData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f0f0f0'
              vertical={false}
            />
            <XAxis
              dataKey='name'
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '12px',
              }}
              content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div className='custom-tooltip bg-white shadow-lg rounded-lg p-3 text-sm'>
                      <p className='text-sm font-medium mb-2 text-gray-600'>
                        {payload[0].payload.name}
                      </p>
                      <div className='space-y-2'>
                        <p className='text-sm text-green-500'>
                          {formatCurrency(payload[0].value ?? 0)}
                        </p>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type='monotone'
              dataKey='revenue'
              stroke='#3BA66B'
              strokeWidth={2}
              dot={false}
              activeDot={false}
              animationDuration={1500}
              animationEasing='ease-in-out'
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
            The past 24 hours
          </option>
          <option className='text-gray-500' value='week'>
            The past 7 days
          </option>
          <option className='text-gray-500' value='month'>
            The past 30 days
          </option>
          <option className='text-gray-500' value='year'>
            The past year
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
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f0f0f0'
              vertical={false}
            />
            <XAxis
              dataKey='name'
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '12px',
              }}
              content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div className='custom-tooltip bg-white shadow-lg rounded-lg p-3 text-sm'>
                      <p className='text-sm font-medium mb-2 text-gray-600'>
                        {payload[0].payload.name}
                      </p>
                      <div className='space-y-2'>
                        <p className='text-sm text-green-500'>
                          {formatCurrency(payload[0].value ?? 0)}
                        </p>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type='monotone'
              dataKey='profit'
              stroke='#3BA66B'
              strokeWidth={2}
              dot={false}
              activeDot={false}
              animationDuration={1500}
              animationEasing='ease-in-out'
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

const TableTopProductSold: React.FC = () => {
  const { data: topProductSoldData } =
    useGetTopProductSoldComparisonByPeriodQuery(
      { period: 'month' },
      {
        skip: undefined,
        refetchOnMountOrArgChange: true,
      }
    )
  return (
    <div className='overflow-x-auto px-2 bg-white p-6 rounded-2xl shadow-lg'>
      <table className='table w-full table-fixed'>
        <thead className=''>
          <tr>
            <th className='uppercase text-sm text-gray-600'>Product</th>
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
        <tbody className='text-sm  overflow-y-auto'>
          {topProductSoldData?.map((product: any, index: number) => (
            <tr key={index}>
              <td className='flex items-center justify-start'>
                <img
                  src={product.product.mainImage}
                  alt={product.name}
                  className='h-20 w-20 rounded-full'
                />
                <span className='ml-2 truncate line-clamp-2 text-wrap '>
                  {product.product.name}
                </span>
              </td>
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
