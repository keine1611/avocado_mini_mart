import React, { useState } from 'react'
import { Form, Input, Button, Select, Radio, Divider } from 'antd'
import {
  cities,
  findDistricts,
  findWards,
  getCheckedCartFromLocalStorage,
} from '@/utils'
import { Cart } from '@/types'
import { useGetListCartProductsByIdsQuery } from '@/services'
import { PayPalButton } from '@/components'

const { Option } = Select

const UserCheckout: React.FC = () => {
  const [form] = Form.useForm()

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('creditCard')
  const cartChecked = getCheckedCartFromLocalStorage()
  const { data: cartItems } = useGetListCartProductsByIdsQuery(
    cartChecked.map((item: Cart) => item.productId)
  )
  const items = cartChecked.map((item: Cart) => ({
    quantity: item.quantity,
    productId: item.productId,
  }))

  const [provinces, setProvinces] = useState(cities)
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  const handleFinish = (values: any) => {
    const formData = {
      email: values.email,
      fullName: values.fullName,
      phone: values.phone,
      address: values.address,
      provinceCode: values.provinceCode,
      districtCode: values.districtCode,
      wardCode: values.wardCode,
      shippingMethod: shippingMethod,
      paymentMethod: paymentMethod,
      cartItems: cartItems?.data,
    }

    return formData
  }

  const handleProvinceChange = (code: string) => {
    setSelectedProvince(code)
    form.resetFields(['district', 'ward'])
    setDistricts(findDistricts(code))
  }

  const handleDistrictChange = (code: string) => {
    setSelectedDistrict(code)
    form.resetFields(['ward'])
    setWards(findWards(code))
  }

  const inputFields = [
    {
      name: 'email',
      label: 'Email',
      rules: [
        { required: true, message: 'Please enter your email' },
        { isEmail: true, message: 'Invalid email' },
      ],
    },
    {
      name: 'fullName',
      label: 'Full Name',
      rules: [{ required: true, message: 'Please enter your full name' }],
    },
    {
      name: 'phone',
      label: 'Phone Number',
      rules: [{ required: true, message: 'Please enter your phone number' }],
    },
    {
      name: 'address',
      label: 'Optional Address',
      rules: [{ required: false, message: 'Please enter an optional address' }],
    },
  ]

  return (
    <div className='w-screen h-screen flex'>
      <div className='w-full h-full bg-white md:px-24 px-2 md:py-10 py-2 grid grid-cols-3'>
        <div className='col-span-2 flex flex-col items-center justify-center'>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleFinish}
            initialValues={{
              shippingMethod: 'standard',
            }}
          >
            <div className='grid grid-cols-2 gap-10'>
              <div className='col-span-1 space-y-2'>
                <h2 className='text-2xl font-bold mb-4'>Order Information</h2>
                {inputFields.map((field) => (
                  <Form.Item
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    rules={field.rules}
                  >
                    <Input placeholder={`Enter ${field.label.toLowerCase()}`} />
                  </Form.Item>
                ))}
                <Form.Item
                  name='provinceCode'
                  label='Province'
                  rules={[
                    { required: true, message: 'Please select a province!' },
                  ]}
                >
                  <Select
                    onChange={handleProvinceChange}
                    placeholder='Select province'
                  >
                    {provinces.map((province) => (
                      <Option key={province.code} value={province.code}>
                        {province.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name='districtCode'
                  label='District'
                  rules={[
                    { required: true, message: 'Please select a district' },
                  ]}
                >
                  <Select
                    onChange={handleDistrictChange}
                    placeholder='Select district'
                    disabled={!selectedProvince}
                  >
                    {districts.map((district) => (
                      <Option key={district.code} value={district.code}>
                        {district.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name='wardCode'
                  label='Ward'
                  rules={[{ required: true, message: 'Please select a ward' }]}
                >
                  <Select
                    placeholder='Select ward'
                    disabled={!selectedDistrict}
                  >
                    {wards.map((ward) => (
                      <Option key={ward.code} value={ward.code}>
                        {ward.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-span-1'>
                <h3 className='text-lg font-semibold'>Shipping Method</h3>
                <Form.Item
                  name='shippingMethod'
                  rules={[
                    {
                      required: true,
                      message: 'Please select a shipping method',
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) => setShippingMethod(e.target.value)}
                    value={shippingMethod}
                  >
                    <Radio value='standard'>Standard Shipping</Radio>
                    <Radio value='express'>Express Shipping</Radio>
                  </Radio.Group>
                </Form.Item>
                <Divider />
                <h3 className='text-lg font-semibold'>Payment Method</h3>
                <Form.Item
                  name='paymentMethod'
                  rules={[
                    {
                      required: true,
                      message: 'Please select a payment method',
                    },
                  ]}
                >
                  <Select onChange={setPaymentMethod}>
                    <Option value='cod'>Cash on Delivery</Option>
                    <Option value='paypal'>PayPal</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
        <div className='col-span-1'>
          <h2 className='text-2xl font-bold mb-4'>Your Cart</h2>
          <div className='space-y-4'>
            {cartItems?.data?.map((item: Cart) => (
              <div key={item.productId}>
                <div className='flex flex-row items-center justify-between gap-4'>
                  <div className='flex items-center gap-2'>
                    <img
                      src={item.product?.mainImage}
                      alt={item.product?.name}
                      className='w-14 h-14 object-contain'
                    />
                    <div className='flex flex-col items-center gap-2'>
                      <span className='text-md font-semibold'>
                        {item.product?.name}
                      </span>
                      <span className='text-sm text-gray-500'>
                        ${item.product?.standardPrice}
                      </span>
                    </div>
                  </div>
                  <span>x{item.quantity}</span>
                </div>
              </div>
            ))}
            <Divider />
            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span>$25.00</span>
            </div>
            <Form.Item>
              <Input placeholder='Enter discount code' />
            </Form.Item>
          </div>
          <PayPalButton form={form} items={items} />
        </div>
      </div>
    </div>
  )
}

export { UserCheckout }
