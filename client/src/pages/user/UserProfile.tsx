import React, { useEffect, useState } from 'react'
import {
  Card,
  Avatar,
  Typography,
  Divider,
  Modal,
  Form,
  Input,
  Button,
  Select,
  Tabs,
  List,
  Upload,
  DatePicker,
  UploadFile,
  GetProp,
  UploadProps,
} from 'antd'
import { useAppDispatch, useAppSelector } from '@/store'
import { authActions } from '@/store'
import {
  stringToDate,
  formatPhoneNumber,
  cities,
  findDistricts,
  findWards,
  getLocation,
} from '@/utils'
import {
  useAddOrderInfoMutation,
  useUpdateOrderInfoMutation,
  useDeleteOrderInfoMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useChangePasswordRequestMutation,
  useResendChangePasswordCodeMutation,
} from '@/services'
import { showToast } from '@/components'
import { OrderInfo } from '@/types'
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { Gender } from '@/enum'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useNavigate } from 'react-router-dom'
dayjs.extend(customParseFormat)

const { Title, Text } = Typography

const { VITE_DATE_FORMAT_API } = import.meta.env

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const UserProfile: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [modalAddAddressOpen, setModalAddAddressOpen] = useState<boolean>(false)
  const [modalUpdateProfileOpen, setModalUpdateProfileOpen] =
    useState<boolean>(false)
  const [modalChangePasswordOpen, setModalChangePasswordOpen] =
    useState<boolean>(false)
  const [editOrderInfo, setEditOrderInfo] = useState<OrderInfo | null>(null)
  const [deleteOrderInfo, { isLoading: isDeletingOrderInfo }] =
    useDeleteOrderInfoMutation()
  const dispatch = useAppDispatch()

  const handleEditOrderInfo = (orderInfo: OrderInfo) => {
    setEditOrderInfo(orderInfo)
    setModalAddAddressOpen(true)
  }

  const handleAddOrderInfo = () => {
    setEditOrderInfo(null)
    setModalAddAddressOpen(true)
  }

  const handleDeleteOrderInfo = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this address?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteOrderInfo(id).unwrap()
          dispatch(authActions.deleteOrderInfo(id))
          showToast.success('Delete address successfully')
        } catch (error: any) {
          showToast.error(error.message || 'Something went wrong')
        }
      },
    })
  }
  const handleChangePassword = () => {
    setModalChangePasswordOpen(true)
  }

  return (
    <div className='container mx-auto'>
      <Card className='shadow-lg rounded-lg' bodyStyle={{ padding: '24px' }}>
        <div className='flex items-center'>
          <Avatar
            size={80}
            src={user?.avatarUrl}
            className='border-2 border-primary'
          />
          <div className='ml-4'>
            <Title level={3} className='mb-0 text-2xl'>
              {`${user?.profile.firstName} ${user?.profile.lastName}`}
            </Title>
            <Text type='secondary' className='text-lg'>
              {user?.email}
            </Text>
          </div>
        </div>
        <Divider className='my-4' />
        <div className='gap-4'>
          <div className='grid grid-cols-1 gap-4 mt-4 px-4'>
            <div className='flex justify-between'>
              <Text strong className='text-lg'>
                Date of birth:
              </Text>
              <Text className='text-lg'>
                {user?.profile.dob ? stringToDate(user?.profile.dob) : 'N/A'}
              </Text>
            </div>
            <div className='flex justify-between'>
              <Text strong className='text-lg'>
                Gender:
              </Text>
              <Text className='capitalize text-lg'>
                {user?.profile.gender?.toString()}
              </Text>
            </div>
            <div className='flex justify-between'>
              <Text strong className='text-lg'>
                Phone:
              </Text>
              <Text className='text-lg'>
                {user?.profile.phone
                  ? formatPhoneNumber(user?.profile.phone)
                  : 'N/A'}
              </Text>
            </div>
            <div className='flex justify-between'>
              <Text strong className='text-lg'>
                Address:
              </Text>
              <Text className='text-lg'>{user?.profile.address}</Text>
            </div>
          </div>
          <Divider />
          <div className='flex flex-col gap-4'>
            <div className='flex justify-between'>
              <p className='text-xl uppercase text-primary'>My address</p>
              <button
                className='btn btn-sm btn-primary hover:bg-primary-focus transition-all duration-300 text-white px-4 py-2 rounded-md'
                onClick={handleAddOrderInfo}
              >
                + Add new address
              </button>
            </div>
            <div className='flex flex-col gap-4 border-2 border-gray-200 rounded-lg p-4 max-h-[300px] overflow-auto'>
              {user?.orderInfos.length === 0 && (
                <Text className='text-lg'>No address</Text>
              )}
              {user?.orderInfos.map((orderInfo) => (
                <div className='flex justify-between border px-4 py-2 border-gray-200 items-center'>
                  <div className='flex flex-col gap-2'>
                    <span className='text-lg'>
                      {orderInfo.fullName}
                      <span className='text-sm text-gray-500'>
                        {` `}| {formatPhoneNumber(orderInfo.phone)}
                      </span>
                    </span>
                    <span className='text-sm text-gray-500'>
                      {orderInfo.address},{' '}
                      {getLocation(
                        orderInfo.provinceCode,
                        orderInfo.districtCode,
                        orderInfo.wardCode
                      )}
                    </span>
                    <span className='text-sm text-gray-500'>
                      {orderInfo.email}
                    </span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <button
                      className='btn btn-sm btn-primary hover:bg-primary-focus transition-all duration-300 text-white rounded-md'
                      onClick={() => handleEditOrderInfo(orderInfo)}
                    >
                      <EditOutlined />
                    </button>
                    <button
                      className='btn btn-sm btn-error hover:bg-error-focus transition-all duration-300 text-white rounded-md'
                      onClick={() => handleDeleteOrderInfo(orderInfo.id)}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex flex-row gap-4 mt-4 w-full justify-center'>
          <button
            onClick={() => setModalUpdateProfileOpen(true)}
            className='btn btn-sm btn-primary hover:bg-primary-focus transition-all duration-300 text-white px-4 py-2 rounded-md'
          >
            Edit Profile
          </button>
          <button
            onClick={handleChangePassword}
            className='btn btn-sm btn-secondary hover:bg-secondary-focus transition-all duration-300 text-white px-4 py-2 rounded-md'
          >
            Change Password
          </button>
        </div>
      </Card>
      <ModalAddAddress
        open={modalAddAddressOpen}
        setOpen={setModalAddAddressOpen}
        editOrderInfo={editOrderInfo}
      />
      <ModalUpdateProfile
        open={modalUpdateProfileOpen}
        setOpen={setModalUpdateProfileOpen}
      />
      <ModalChangePassword
        open={modalChangePasswordOpen}
        setOpen={setModalChangePasswordOpen}
      />
    </div>
  )
}

const ModalAddAddress: React.FC<{
  open: boolean
  setOpen: (open: boolean) => void
  editOrderInfo: OrderInfo | null
}> = ({ open, setOpen, editOrderInfo }) => {
  const [addOrderInfo, { isLoading: isAddingOrderInfo }] =
    useAddOrderInfoMutation()
  const [updateOrderInfo, { isLoading: isUpdatingOrderInfo }] =
    useUpdateOrderInfoMutation()
  const [form] = Form.useForm()
  const state = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const [provinces, setProvinces] = useState(
    cities.sort((a, b) => a.name.localeCompare(b.name))
  )
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [selectedWard, setSelectedWard] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState('province')

  const handleProvinceChange = (code: string) => {
    const province = provinces.find((p) => p.code === code)
    setSelectedProvince(code)
    setSelectedDistrict(null)
    setSelectedWard(null)
    setDistricts(findDistricts(code))
    setWards([])
    setActiveTab('district')
    form.setFieldsValue({ location: province?.name })
  }

  const handleDistrictChange = (code: string) => {
    const district = districts.find((d) => d.code === code)
    setSelectedDistrict(code)
    setSelectedWard(null)
    setWards(findWards(code))
    setActiveTab('ward')
    form.setFieldsValue({
      location: `${district?.name}, ${
        selectedProvince
          ? provinces.find((p) => p.code === selectedProvince)?.name
          : ''
      }`,
    })
  }

  const handleWardChange = (code: string) => {
    const ward = wards.find((w) => w.code === code)
    setSelectedWard(code)
    form.setFieldsValue({
      location: `${ward?.name}, ${
        selectedDistrict
          ? districts.find((d) => d.code === selectedDistrict)?.name
          : ''
      }, ${
        selectedProvince
          ? provinces.find((p) => p.code === selectedProvince)?.name
          : ''
      }`,
    })
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  useEffect(() => {
    if (editOrderInfo) {
      form.setFieldsValue({
        fullName: editOrderInfo.fullName,
        email: editOrderInfo.email,
        phone: editOrderInfo.phone,
        address: editOrderInfo.address,
        location: getLocation(
          editOrderInfo.provinceCode,
          editOrderInfo.districtCode,
          editOrderInfo.wardCode
        ),
      })
      setSelectedProvince(editOrderInfo.provinceCode)
      setSelectedDistrict(editOrderInfo.districtCode)
      setSelectedWard(editOrderInfo.wardCode)
    } else {
      form.resetFields()
    }
  }, [editOrderInfo, form, open])

  const handleOk = async () => {
    await form.validateFields().then(async (values) => {
      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        showToast.error('Please select your location')
        return
      }
      if (!editOrderInfo) {
        const orderInfo: OrderInfo = {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
          address: values.address,
          provinceCode: selectedProvince,
          districtCode: selectedDistrict,
          wardCode: selectedWard,
        } as OrderInfo
        try {
          const res = await addOrderInfo(orderInfo).unwrap()
          if (res.message === 'success') {
            dispatch(authActions.addOrderInfo(res.data))
            showToast.success('Add address successfully')
            setOpen(false)
            form.resetFields()
          }
        } catch (error: any) {
          showToast.error(error.message || 'Something went wrong')
        }
      } else {
        const orderInfo: OrderInfo = {
          id: editOrderInfo.id,
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
          address: values.address,
          provinceCode: selectedProvince,
          districtCode: selectedDistrict,
          wardCode: selectedWard,
        } as OrderInfo
        try {
          const res = await updateOrderInfo(orderInfo).unwrap()
          if (res.message === 'success') {
            showToast.success('Update address successfully')
            dispatch(authActions.addOrderInfo(res.data))
            setOpen(false)
            form.resetFields()
          }
        } catch (error: any) {
          showToast.error(error.message || 'Something went wrong')
        }
      }
    })
  }
  const handleCancel = () => {
    setOpen(false)
    form.resetFields()
  }

  return (
    <Modal open={open} centered footer={null} onCancel={handleCancel}>
      <h2 className='text-xl mb-4 text-primary'>
        {editOrderInfo ? 'Edit address' : 'Add new address'}
      </h2>
      <Form form={form} layout='vertical'>
        <div className='flex flex-col'>
          <Form.Item
            label='Full name'
            name='fullName'
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder='Enter your full name' />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder='Enter your email' />
          </Form.Item>
          <Form.Item
            label='Phone'
            name='phone'
            rules={[
              {
                required: true,
                message: 'Please enter your phone number',
                pattern: /^0\d{9}$/,
                min: 10,
                max: 10,
              },
            ]}
          >
            <Input placeholder='Enter your phone number' />
          </Form.Item>
          <Form.Item
            label='Optional address'
            name='address'
            rules={[{ required: true, message: 'Please enter your address' }]}
          >
            <Input placeholder='Enter your address' />
          </Form.Item>
          <Form.Item
            label='Location'
            name='location'
            rules={[
              { required: true, message: 'Please select your location' },
              {
                validator: (_, value) => {
                  if (selectedWard && selectedDistrict && selectedProvince) {
                    return Promise.resolve()
                  }
                  return Promise.reject('Please select your location')
                },
              },
            ]}
          >
            <Select
              placeholder='Select location'
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => e.stopPropagation()}
              dropdownRender={(menu) => (
                <div className='w-full px-2'>
                  <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    className='w-full'
                  >
                    <Tabs.TabPane tab='Province' key='province'>
                      <List
                        className='w-full max-h-[200px] overflow-auto px-2'
                        dataSource={provinces}
                        renderItem={(province) => (
                          <List.Item
                            className='hover:bg-gray-200 cursor-pointer rounded-md'
                            key={province.code}
                            onMouseDown={() =>
                              handleProvinceChange(province.code)
                            }
                            style={{ padding: '4px 8px' }}
                          >
                            {province.name}
                          </List.Item>
                        )}
                      />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab='District' key='district'>
                      <List
                        className='w-full max-h-[200px] overflow-auto px-2'
                        dataSource={districts}
                        renderItem={(district) => (
                          <List.Item
                            className='hover:bg-gray-200 cursor-pointer rounded-md'
                            key={district.code}
                            style={{ padding: '4px 8px' }}
                            onMouseDown={() =>
                              handleDistrictChange(district.code)
                            }
                          >
                            {district.name}
                          </List.Item>
                        )}
                      />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab='Ward' key='ward'>
                      <List
                        className='w-full max-h-[200px] overflow-auto px-2'
                        dataSource={wards}
                        renderItem={(ward) => (
                          <List.Item
                            className='hover:bg-gray-200 cursor-pointer rounded-md'
                            key={ward.code}
                            style={{ padding: '4px 8px' }}
                            onClick={() => handleWardChange(ward.code)}
                          >
                            {ward.name}
                          </List.Item>
                        )}
                      />
                    </Tabs.TabPane>
                  </Tabs>
                </div>
              )}
            />
          </Form.Item>
        </div>
        <div className='flex justify-end mt-4 gap-4'>
          <button
            onClick={handleCancel}
            className='btn btn-sm btn-error text-white'
          >
            Cancel
          </button>
          <button
            onClick={handleOk}
            disabled={isAddingOrderInfo || isUpdatingOrderInfo}
            className='btn btn-sm btn-primary text-white'
          >
            {isAddingOrderInfo || isUpdatingOrderInfo ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </Form>
    </Modal>
  )
}

const ModalUpdateProfile: React.FC<{
  open: boolean
  setOpen: (open: boolean) => void
}> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation()
  const [filelist, setFileList] = useState<UploadFile[]>([])

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      showToast.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    return isJpgOrPng && isLt2M
  }

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user)
      setFileList(
        user.avatarUrl
          ? [
              {
                uid: '-1',
                name: 'avatar',
                status: 'done',
                url: user.avatarUrl,
              },
            ]
          : []
      )
    }
  }, [user])

  const handleSubmit = async () => {
    await form.validateFields().then(async (values) => {
      const formData = new FormData()
      formData.append('profile[firstName]', values.profile.firstName ?? '')
      formData.append('profile[lastName]', values.profile.lastName ?? '')
      formData.append('profile[gender]', values.profile.gender ?? '')
      formData.append(
        'profile[dob]',
        dayjs(values.profile.dob).format(VITE_DATE_FORMAT_API) ?? ''
      )
      formData.append('profile[phone]', values.profile.phone ?? '')
      formData.append('profile[address]', values.profile.address ?? '')
      if (filelist.length > 0) {
        formData.append('avatar', filelist[0].originFileObj ?? '')
      }
      try {
        const res = await updateProfile(formData).unwrap()
        dispatch(authActions.updateAvatar(res.data.avatarUrl))
        dispatch(authActions.updateProfile(res.data.profile))
        showToast.success('Update profile successfully')
        setOpen(false)
      } catch (error: any) {
        showToast.error(error.message || 'Something went wrong')
      }
    })
  }

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      className='modal-update-profile'
      centered
      width={800}
    >
      <div className='bg-white p-4'>
        <h2 className='text-2xl font-bold mb-6 text-primary'>Edit User</h2>
        <Form form={form} layout='vertical' className='space-y-4'>
          <Form.Item name='avatar' label=''>
            <div className='flex justify-center'>
              <Upload
                name='avatar'
                listType='picture-circle'
                fileList={filelist}
                accept='image/*'
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
                beforeUpload={beforeUpload}
              >
                {filelist.length < 1 && (
                  <div className='flex flex-col items-center'>
                    <UploadOutlined />
                    <div className='mt-2'>Upload Avatar</div>
                  </div>
                )}
              </Upload>
            </div>
          </Form.Item>

          <div className='grid md:grid-cols-2 md:gap-4'>
            <Form.Item
              name={['profile', 'firstName']}
              label='First Name'
              rules={[
                { required: true, message: 'Please enter a first name' },
                { min: 3, message: 'First name must be at least 3 characters' },
                {
                  max: 30,
                  message: 'First name must be at most 30 characters',
                },
                {
                  pattern: /^[a-zA-Z]+$/,
                  message: 'First name must contain only letters',
                },
              ]}
            >
              <Input className='w-full' />
            </Form.Item>
            <Form.Item
              name={['profile', 'lastName']}
              label='Last Name'
              rules={[
                { required: true, message: 'Please enter a last name' },
                { min: 3, message: 'Last name must be at least 3 characters' },
                { max: 30, message: 'Last name must be at most 30 characters' },
                {
                  pattern: /^[a-zA-Z]+$/,
                  message: 'Last name must contain only letters',
                },
              ]}
            >
              <Input className='w-full' />
            </Form.Item>

            <Form.Item
              name={['profile', 'gender']}
              label='Gender'
              rules={[{ required: true, message: 'Please enter a gender' }]}
            >
              <Select>
                <Select.Option value={Gender.MALE}>Male</Select.Option>
                <Select.Option value={Gender.FEMALE}>Female</Select.Option>
                <Select.Option value={Gender.OTHER}>Other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={['profile', 'dob']}
              label='Date of Birth'
              rules={[
                { required: true, message: 'Please enter a date of birth' },
              ]}
              getValueProps={(value) => ({
                value: value ? dayjs(value, VITE_DATE_FORMAT_API) : null,
              })}
            >
              <DatePicker format={'DD/MM/YYYY'} className='w-full' />
            </Form.Item>

            <Form.Item
              name={['profile', 'phone']}
              label='Phone'
              rules={[
                { required: true, message: 'Please enter a phone number' },
                {
                  pattern: /^[0-9]{10}$/,
                  message: 'Please enter a valid phone number',
                },
              ]}
            >
              <Input className='w-full' />
            </Form.Item>
            <Form.Item
              name={['profile', 'address']}
              label='Address'
              rules={[{ required: true, message: 'Please enter an address' }]}
            >
              <Input className='w-full' />
            </Form.Item>
          </div>

          <div className='flex justify-end space-x-4 mt-6'>
            <Button
              onClick={() => setOpen(false)}
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </Button>
            <Button
              type='primary'
              className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
              loading={isUpdatingProfile}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

const ModalChangePassword: React.FC<{
  open: boolean
  setOpen: (open: boolean) => void
}> = ({ open, setOpen }) => {
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation()
  const [changePasswordRequest, { isLoading: isChangingPasswordRequest }] =
    useChangePasswordRequestMutation()
  const [resendCode, { isLoading: isResending }] =
    useResendChangePasswordCodeMutation()
  const [verified, setVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [resendTimer])

  useEffect(() => {
    console.log(verificationCode)
  }, [verificationCode])

  const handleVerificationCodeChange = (index: number, value: string) => {
    const newCode = verificationCode.split('')

    if (value.length <= 1 && /^\d*$/.test(value)) {
      newCode[index] = value
      setVerificationCode(newCode.join(''))

      if (value && index < 5) {
        const nextInput = document.querySelector(
          `input[data-index="${index + 1}"]`
        ) as HTMLInputElement
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const newCode = pastedData.split('').slice(0, 6)
    setVerificationCode(newCode.join(''))
    const lastInput = document.querySelector(
      `input[data-index="${newCode.length - 1}"]`
    ) as HTMLInputElement
    if (lastInput) lastInput.focus()
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[data-index="${index - 1}"]`
      ) as HTMLInputElement
      if (prevInput) prevInput.focus()
    }
  }

  const handleResendCode = async () => {
    if (resendTimer > 0) return

    try {
      await resendCode().unwrap()
      setVerificationCode('')
      setResendTimer(60)
      showToast.success('New verification code sent to your email')

      const countdown = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      showToast.error(
        error.data.message || 'Failed to resend verification code'
      )
    }
  }

  const handleSubmit = async () => {
    await form.validateFields().then(async (values) => {
      if (!verified) {
        try {
          const res = await changePasswordRequest({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          }).unwrap()
          setVerified(true)
          form.resetFields()
          setResendTimer(60)
          const countdown = setInterval(() => {
            setResendTimer((prev) => {
              if (prev <= 1) {
                clearInterval(countdown)
                return 0
              }
              return prev - 1
            })
          }, 1000)
        } catch (error: any) {
          showToast.error(error.data.message || 'Something went wrong')
        }
      } else {
        if (verificationCode.length !== 6) {
          showToast.error('Please enter a valid 6-digit verification code')
          return
        }
        try {
          const res = await changePassword({
            verificationCode,
          }).unwrap()
          showToast.success('Password changed successfully')
          setOpen(false)
          setVerified(false)
          setVerificationCode('')
          dispatch(authActions.clear())
          navigate('/login', { replace: true })
        } catch (error: any) {
          showToast.error(error.data.message || 'Invalid verification code')
        }
      }
    })
  }

  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false)
        setVerified(false)
        setVerificationCode('')
        form.resetFields()
      }}
      footer={null}
      className='modal-change-password'
      centered
    >
      <div className='bg-white'>
        <h2 className='text-xl font-bold mb-6 text-primary'>
          {verified ? 'Verify' : 'Change'} Password
        </h2>
        {!verified ? (
          <Form form={form} layout='vertical'>
            <Form.Item
              name='oldPassword'
              label='Old Password'
              rules={[
                { required: true, message: 'Please enter your old password' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name='newPassword'
              label='New Password'
              rules={[{ required: true, message: 'Please enter a password' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name='retypePassword'
              label='Retype password'
              rules={[
                { required: true, message: 'Please retype your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject('Passwords do not match')
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        ) : (
          <div className='space-y-4'>
            <div className='text-center text-base text-gray-600'>
              Please enter the verification code sent to your email
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex justify-between gap-2'>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type='text'
                    maxLength={1}
                    value={verificationCode[index] || ''}
                    data-index={index}
                    onChange={(e) =>
                      handleVerificationCodeChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className='w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                  />
                ))}
              </div>
              <div className='flex justify-center'>
                <button
                  onClick={handleResendCode}
                  disabled={isResending || resendTimer > 0}
                  className={`text-primary hover:text-primary-focus text-sm font-medium flex items-center gap-2 ${
                    isResending || resendTimer > 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                    />
                  </svg>
                  {isResending
                    ? 'Sending...'
                    : resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : 'Resend code'}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className='flex justify-end space-x-4 mt-6'>
          <Button
            onClick={() => {
              setOpen(false)
              setVerified(false)
              setVerificationCode('')
              form.resetFields()
            }}
            className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isChangingPasswordRequest || isChangingPassword}
            type='primary'
            className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
          >
            {verified ? 'Verify' : 'Submit'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export { UserProfile }
