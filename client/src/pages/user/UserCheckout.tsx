import React, { useState } from 'react'
import { Form, Input, Button, Select, Radio, Divider } from 'antd'
import {
  cities,
  findDistricts,
  findWards,
  formatCurrency,
  getCheckedCartFromLocalStorage,
} from '@/utils'
import { Cart } from '@/types'
import {
  useGetListCartProductsByIdsQuery,
  useGetDiscountCodeByCodeQuery,
  useLazyGetDiscountCodeByCodeQuery,
} from '@/services'
import { PayPalButton } from '@/components'
import { SearchOutlined } from '@ant-design/icons'
import { DISCOUNT_TYPE } from '@/enum'
const { Option } = Select

const UserCheckout: React.FC = () => {
  const [form] = Form.useForm()

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('creditCard')
  const [discountCode, setDiscountCode] = useState<string>('')
  const cartChecked = getCheckedCartFromLocalStorage()
  const { data: cartItems } = useGetListCartProductsByIdsQuery(
    cartChecked.map((item: Cart) => item.productId)
  )
  const [
    getDiscountCodeByCode,
    { data: discountCodeData, isLoading: isLoadingDiscountCode },
  ] = useLazyGetDiscountCodeByCodeQuery()

  const items = cartChecked.map((item: Cart) => ({
    quantity: item.quantity,
    productId: item.productId,
  }))

  const [provinces, setProvinces] = useState(cities)
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  const provisional = cartItems?.data?.reduce(
    (acc: number, item: Cart) =>
      acc + (item.product?.standardPrice || 0) * item.quantity,
    0
  )

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
      discountCode: discountCode,
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

  const [discountInfo, setDiscountInfo] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleApplyDiscount = async () => {
    if (discountCode) {
      const res = await getDiscountCodeByCode(discountCode)
      if (res.data?.data) {
        setDiscountInfo(res.data.data)
        setErrorMessage('')
      } else {
        setErrorMessage('Mã giảm giá không hợp lệ')
        setDiscountInfo(null)
      }
    }
  }

  return (
    <div className='w-screen h-screen flex'>
      <div className='w-full bg-white md:px-24 px-4 md:py-10 py-2 grid lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2 flex flex-col items-center justify-center'>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleFinish}
            initialValues={{
              shippingMethod: 'standard',
            }}
          >
            <div className='lg:grid lg:grid-cols-2 gap-10'>
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
        <div className='lg:col-span-1'>
          <h2 className='text-2xl font-bold mb-4 text-primary'>
            Your Products
          </h2>
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
            <div className='mt-4'>
              <div className='flex flex-row items-center gap-2 justify-between'>
                <span>Provisional</span>
                <span>{formatCurrency(provisional || 0)}</span>
              </div>
              <div className='flex flex-row items-center gap-2 justify-between'>
                <span>Shipping fee</span>
                <span>
                  {shippingMethod === 'standard' ? '$10.00' : '$20.00'}
                </span>
              </div>
              {discountInfo && (
                <>
                  <Divider />
                  <div className='flex flex-row items-center gap-2 justify-between font-bold'>
                    <span>Total</span>
                    <span>
                      {formatCurrency(
                        (provisional || 0) +
                          (shippingMethod === 'standard' ? 10 : 20)
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className='flex flex-row items-center gap-2'>
              <input
                className='input input-bordered w-full'
                placeholder='Enter discount code'
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <Button
                className='btn btn-primary text-white'
                onClick={handleApplyDiscount}
                loading={isLoadingDiscountCode}
                disabled={!discountCode}
              >
                Apply
              </Button>
            </div>
            {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
            {discountInfo && (
              <div className='mt-2'>
                <span className='font-bold text-primary'>Giảm giá:</span>{' '}
                {discountInfo.discountType === DISCOUNT_TYPE.PERCENTAGE
                  ? `${discountInfo.discountValue}%`
                  : formatCurrency(discountInfo.discountValue)}
              </div>
            )}
          </div>
          <div className='mt-4'>
            {paymentMethod === 'paypal' ? (
              <PayPalButton form={form} items={items} />
            ) : (
              <button className='btn btn-secondary w-full text-white'>
                Order now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { UserCheckout }
