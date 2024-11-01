import {
  usePaypalCreateOrderMutation,
  usePaypalVerifyOrderMutation,
} from '@/services'
import { FormInstance } from 'antd'
import React, { useEffect } from 'react'
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

  const createOrder = async () => {
    const data = form.getFieldsValue()
    const formData = new FormData()
    formData.append('items', JSON.stringify(items))
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string)
    })
    const res = await createPaypalOrder(formData)
    return res.data.orderID
  }

  const onApprove = async (data: any, actions: any) => {
    console.log(data)
    try {
      const capture = await actions.order.capture()
      const res = await verifyPaypalOrder({ orderID: capture.id })
      if (res.data) {
        showToast.success(res.data.message || 'Order verified')
      }
    } catch (error: any) {
      showToast.error(error.data.message || 'Failed to verify order')
    }
  }

  const onError = (err: any) => {
    showToast.error(err.data.message || 'Failed to create order')
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        onClick={onClick}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </PayPalScriptProvider>
  )
}

export { PayPalButton }
