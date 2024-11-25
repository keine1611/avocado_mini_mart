import React from 'react'
import { Link } from 'react-router-dom'
import { useGetDashboardDataQuery } from '@/services/dashboard'
import {
  FaShoppingCart,
  FaCheckCircle,
  FaDollarSign,
  FaMoneyBill,
  FaShoppingBag,
} from 'react-icons/fa'
import { FaChartLine } from 'react-icons/fa6'
import { FcShipped } from 'react-icons/fc'

const AdminDashboard: React.FC = () => {
  const { data: dashboardData, error, isLoading } = useGetDashboardDataQuery()

  if (isLoading) return <div className='text-center'>Loading...</div>
  if (error)
    return (
      <div className='text-center text-red-500'>
        Error fetching dashboard data
      </div>
    )

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>Overview</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 max-w-xs'>
          <div className='flex items-center mb-4'>
            <h2 className='text-xl font-lg text-gray-300'>New Orders</h2>
          </div>
          <p className='text-3xl font-bold text-blue-600'>
            {dashboardData.newOrders}
          </p>
          <div className='flex justify-between items-end'>
            <Link to='#' className='text-black hover:underline'>
              See Details
            </Link>
            <div className='flex items-center p-3 border border-gray-100 rounded-lg bg-yellow-50'>
              <FaShoppingBag className='text-yellow-500 text-xl' />
            </div>
          </div>
        </div>
        <div className='bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 max-w-xs'>
          <div className='flex items-center mb-4'>
            <h2 className='text-xl font-lg text-gray-300'>
              Successful Delivery
            </h2>
          </div>
          <p className='text-3xl font-bold text-green-600'>
            #{dashboardData.successfulDelivery}
          </p>
          <div className='flex justify-between items-end'>
            <Link to='#' className='text-black hover:underline'>
              See Details
            </Link>

            <div className='flex items-center p-3 border border-gray-100 rounded-lg bg-yellow-50'>
              <FcShipped className='text-xl' />
            </div>
          </div>
        </div>
        <div className='bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 max-w-xs'>
          <div className='flex items-center mb-4'>
            <h2 className='text-xl font-lg text-gray-300'>Total Earnings</h2>
          </div>
          <p className='text-3xl font-bold text-green-600'>
            ${dashboardData.totalEarnings}
          </p>
          <div className='flex justify-between items-end'>
            <Link to='#' className='text-black hover:underline'>
              See Details
            </Link>
            <div className='flex items-center p-3 border border-gray-100 rounded-lg bg-yellow-50'>
              <FaChartLine className='text-lg' />
            </div>
          </div>
        </div>
        <div className='bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 max-w-xs'>
          <div className='flex items-center mb-4'>
            <h2 className='text-xl font-lg text-gray-300'>Total Profit</h2>
          </div>
          <p className='text-3xl font-bold text-blue-600'>
            ${dashboardData.totalProfit}
          </p>
          <div className='flex justify-between items-end'>
            <Link to='#' className='text-black hover:underline'>
              See Details
            </Link>
            <div className='flex items-center p-3 border border-gray-100 rounded-lg bg-yellow-50'>
              <FaMoneyBill className='text-xl' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AdminDashboard }
