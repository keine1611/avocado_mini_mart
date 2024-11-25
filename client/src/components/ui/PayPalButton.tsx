import {
  usePaypalCreateOrderMutation,
  usePaypalVerifyOrderMutation,
} from '@/services'
import React, { useEffect, useState, useRef } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { showToast } from './MyToast'
import { OrderInfo } from '@/types'
import { useNavigate } from 'react-router-dom'
interface PayPalButtonProps {
  items: {
    quantity: number
    productId: number
  }[]
  selectedOrderInfo: Omit<OrderInfo, 'id' | 'accountId'> | null
  shippingMethod: string
  discountCode: string
}

const initialOptions = {
  clientId:
    'AerBDGpkuUbN1vbkY2jB3PmxmP8ijXS0D8qnWEzcpvaZEtTg7bAp_qEt52BRkXnFav1z7pA_cGl8Cp6F',
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  items,
  selectedOrderInfo,
  shippingMethod,
  discountCode,
}) => {
  const [createPaypalOrder] = usePaypalCreateOrderMutation()
  const [verifyPaypalOrder] = usePaypalVerifyOrderMutation()
  const orderCodeRef = useRef<string | null>(null)
  const navigate = useNavigate()
  const [orderCode, setOrderCode] = useState<string | null>(null)

  useEffect(() => {
    orderCodeRef.current = orderCode
  }, [orderCode])

  const createOrder = async (data: any, actions: any) => {
    try {
      if (!selectedOrderInfo) {
        showToast.error('Please select an address')
        actions.reject()
      }
      if (items.length === 0) {
        showToast.error('Please add at least one item to the cart')
        actions.reject()
      }
      if (shippingMethod === '') {
        showToast.error('Please select a shipping method')
        actions.reject()
      }

      const itemString = JSON.stringify(items)
      const reqData = {
        items: itemString,
        ...selectedOrderInfo,
        shippingMethod,
        discountCode: discountCode ? discountCode : null,
      }
      const res = await createPaypalOrder(reqData).unwrap()
      setOrderCode(res.orderCode)
      return res.paymentOrderID
    } catch (error: any) {
      showToast.error(error.data.message || 'Failed to create order')
    }
  }

  const onApprove = async (data: any, actions: any) => {
    try {
      const capture = await actions.order.capture()
      const res = await verifyPaypalOrder({
        paypalOrderID: capture.id,
        orderCode: orderCodeRef.current,
      }).unwrap()
      showToast.success(res.message || 'Order completed')
      setTimeout(() => {
        navigate('/account/orders')
      }, 2000)
    } catch (error: any) {
      showToast.error(error.data.message || 'Failed to verify order')
    }
  }

  const onCancel = () => {
    showToast.error('Order cancelled')
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
        forceReRender={[items, selectedOrderInfo, shippingMethod, discountCode]}
      />
    </PayPalScriptProvider>
  )
}

export { PayPalButton }
