import React from 'react'
import { OrderLog } from '@/types/OrderLog'
import { stringToDateTime } from '@/utils'
import {
  FaHourglassStart,
  FaCheckCircle,
  FaShippingFast,
  FaBoxOpen,
  FaTimesCircle,
  FaBan,
} from 'react-icons/fa'
import { ORDER_STATUS } from '@/enum/orderStatus'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const { VITE_DATE_FORMAT_API } = import.meta.env

interface OrderLogTimelineProps {
  logs: OrderLog[]
}

const OrderLogTimeline: React.FC<OrderLogTimelineProps> = ({ logs }) => {
  const getStatusIcon = (status: ORDER_STATUS) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return <FaHourglassStart className='text-primary' />
      case ORDER_STATUS.CONFIRMED:
        return <FaCheckCircle className='text-primary' />
      case ORDER_STATUS.SHIPPING:
        return <FaShippingFast className='text-primary' />
      case ORDER_STATUS.DELIVERED:
        return <FaBoxOpen className='text-primary' />
      case ORDER_STATUS.CANCELLED:
        return <FaTimesCircle className='text-red-500' />
      case ORDER_STATUS.REJECTED:
        return <FaBan className='text-red-500' />
      default:
        return null
    }
  }

  const getStatusText = (status: ORDER_STATUS) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'Your order is pending.'
      case ORDER_STATUS.CONFIRMED:
        return 'Your order has been confirmed.'
      case ORDER_STATUS.SHIPPING:
        return 'Your order is being shipped.'
      case ORDER_STATUS.DELIVERED:
        return 'Your order has been delivered.'
      case ORDER_STATUS.CANCELLED:
        return 'Your order has been cancelled.'
      case ORDER_STATUS.REJECTED:
        return 'Your order was rejected.'
      default:
        return 'Unknown status.'
    }
  }

  return (
    <div className='relative border-l-2 border-gray-200 pl-4'>
      {[...logs]
        .sort((a, b) =>
          dayjs(b.updatedAt, VITE_DATE_FORMAT_API).diff(
            dayjs(a.updatedAt, VITE_DATE_FORMAT_API)
          )
        )
        .map((log) => (
          <div key={log.id} className='mb-8 ml-4'>
            <div
              className={`absolute w-3 h-3 rounded-full -left-1.5 border border-white ${
                log.status === ORDER_STATUS.CANCELLED ||
                log.status === ORDER_STATUS.REJECTED
                  ? 'bg-red-500'
                  : 'bg-primary'
              }`}
            ></div>
            <time className='mb-1 text-sm font-normal leading-none text-gray-400'>
              {stringToDateTime(log.updatedAt)}
            </time>
            <div className='flex items-center'>
              {getStatusIcon(log.status as ORDER_STATUS)}
              <p className='text-md  text-gray-900  ml-2'>
                {getStatusText(log.status as ORDER_STATUS)}
              </p>
            </div>
          </div>
        ))}
    </div>
  )
}

export { OrderLogTimeline }
