import React, { useState } from 'react'
import { Tabs, Card, Row, Col } from 'antd'
import { Order } from '@/types' // Assuming you have an Order type defined
import { enumToArray, formatCurrency } from '@/utils' // Assuming you have a utility to format currency
import { Breadcrumb } from '@/components'
import { useGetUserOrdersQuery } from '@/services'
import { ORDER_STATUS } from '@/enum'

const UserMyOrder: React.FC = () => {
  const { data: orders, isLoading: isLoadingOrders } = useGetUserOrdersQuery()

  const orderStatuses = enumToArray(ORDER_STATUS)

  const [activeTab, setActiveTab] = useState(orderStatuses[0].value)
  return (
    <div>
      <Breadcrumb />
      <div className=' mx-4 md:mx-32 mt-10 '>
        <h1 className='text-2xl font-bold text-primary'>Your history orders</h1>
        <div role='tablist' className='tabs tabs-boxed mt-4'>
          {orderStatuses.map((status, index) => (
            <a
              role='tab'
              className={`tab border-2 border-base-200 rounded-lg text-black checked:bg-primary checked:text-white ${
                activeTab === status.value ? 'tab-active' : ''
              }`}
              key={index}
              onClick={() => setActiveTab(status.value)}
            >
              {status.label}
            </a>
          ))}
        </div>
        <div className=' min-h-[500px] mt-10'></div>
      </div>
    </div>
  )
}

export { UserMyOrder }
