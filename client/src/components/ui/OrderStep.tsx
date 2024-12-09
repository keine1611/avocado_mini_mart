import { ORDER_STATUS } from '@/enum/orderStatus'
import React from 'react'
import { ConfigProvider, Steps } from 'antd'
import {
  FaHourglassStart,
  FaCheckCircle,
  FaShippingFast,
  FaBoxOpen,
  FaTimesCircle,
  FaBan,
} from 'react-icons/fa'

const { Step } = Steps

const { VITE_COLOR_PRIMARY } = import.meta.env

export const OrderStep: React.FC<{ status: ORDER_STATUS }> = ({ status }) => {
  const getSteps = () => {
    const steps = [
      {
        label: 'Pending',
        status: ORDER_STATUS.PENDING,
        icon: <FaHourglassStart />,
      },
      {
        label: 'Confirmed',
        status: ORDER_STATUS.CONFIRMED,
        icon: <FaCheckCircle />,
      },
      {
        label: 'Shipping',
        status: ORDER_STATUS.SHIPPING,
        icon: <FaShippingFast />,
      },
      {
        label: 'Delivered',
        status: ORDER_STATUS.DELIVERED,
        icon: <FaBoxOpen />,
      },
    ]

    if (status === ORDER_STATUS.CANCELLED) {
      steps.push({
        label: 'Cancelled',
        status: ORDER_STATUS.CANCELLED,
        icon: <FaTimesCircle />,
      })
    } else if (status === ORDER_STATUS.REJECTED) {
      steps.push({
        label: 'Rejected',
        status: ORDER_STATUS.REJECTED,
        icon: <FaBan />,
      })
    } else if (status === ORDER_STATUS.RETURNED) {
      steps.push({
        label: 'Returned',
        status: ORDER_STATUS.RETURNED,
        icon: <FaBan />,
      })
    }

    return steps
  }

  const steps = getSteps()
  const currentStepIndex = steps.findIndex((step) => step.status === status)

  return (
    <ConfigProvider theme={{ token: { colorPrimary: VITE_COLOR_PRIMARY } }}>
      <Steps current={currentStepIndex} className='w-full px-2 my-4'>
        {steps.map((step, index) => (
          <Step
            key={step.status}
            icon={
              <div className='flex flex-col gap-2 text-md items-center justify-center'>
                {step.icon}
                <div className=''>{step.label}</div>
              </div>
            }
            status={
              index <= currentStepIndex
                ? step.status === ORDER_STATUS.CANCELLED ||
                  step.status === ORDER_STATUS.REJECTED ||
                  step.status === ORDER_STATUS.RETURNED
                  ? 'error'
                  : 'finish'
                : 'wait'
            }
          />
        ))}
      </Steps>
    </ConfigProvider>
  )
}
