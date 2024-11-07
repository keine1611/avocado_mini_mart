import {
  usePaypalCreateOrderMutation,
  usePaypalVerifyOrderMutation,
} from '@/services'
import { FormInstance } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { showToast } from './MyToast'

interface PayPalButtonProps {
  form: FormInstance
  items: {
    quantity: number
    id: number
  }[]
}

const initialOptions = {
  clientId:
    'AerBDGpkuUbN1vbkY2jB3PmxmP8ijXS0D8qnWEzcpvaZEtTg7bAp_qEt52BRkXnFav1z7pA_cGl8Cp6F',
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ form, items }) => {
  const [createPaypalOrder] = usePaypalCreateOrderMutation()
  const [verifyPaypalOrder] = usePaypalVerifyOrderMutation()
  const orderCodeRef = useRef<string | null>(null)

  const [orderCode, setOrderCode] = useState<string | null>(null)

  useEffect(() => {
    orderCodeRef.current = orderCode
  }, [orderCode])

  const validateForm = async () => {
    try {
      await form.validateFields()
      return true
    } catch (error) {
      return false
    }
  }

  const onClick = async (data: any, action: any) => {
    const isValid = await validateForm()
    if (!isValid) {
      return action.reject()
    }
    return action.resolve()
  }

  const createOrder = async (data: any, actions: any) => {
    try {
      const data = await form.getFieldsValue()
      const itemString = JSON.stringify(items)
      const reqData = { items: itemString, ...data, discount: 0 }
      const res = await createPaypalOrder(reqData).unwrap()
      setOrderCode(res.orderCode)
      return res.paymentOrderID
    } catch (error: any) {
      showToast.error(error.message || 'Failed to create order')
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
    } catch (error: any) {
      showToast.error(error.message || 'Failed to verify order')
    }
  }

  const onCancel = () => {
    showToast.error('Order cancelled')
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        onClick={onClick}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
        forceReRender={['commit-order']}
      />
    </PayPalScriptProvider>
  )
}

export { PayPalButton }
