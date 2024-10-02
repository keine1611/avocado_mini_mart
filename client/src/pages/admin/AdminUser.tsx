import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  TableProps,
  Select,
  DatePicker,
  Upload,
  UploadFile,
  message,
  GetProp,
  UploadProps,
} from 'antd'
import {
  useGetAllAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from '@/services'
import { Account } from '@/types'
import { RoleAccount } from '@/enum'
import dayjs from 'dayjs'
import { UploadOutlined } from '@ant-design/icons'

const { VITE_DATE_FORMAT_API, VITE_DATE_FORMAT_DISPLAY } = import.meta.env

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const AdminUser: React.FC = () => {
  const [form] = Form.useForm()
  const { data: accounts, refetch } = useGetAllAccountQuery()
  const [createAccount] = useCreateAccountMutation()
  const [updateAccount] = useUpdateAccountMutation()
  const [deleteAccount] = useDeleteAccountMutation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleCreateOrUpdate = async () => {
    form.validateFields().then(async (values: Account) => {
      try {
        const formData = new FormData()
        formData.append('email', values.email)
        formData.append('password', values.password)
        formData.append('role', values.role)
        formData.append('profile[firstName]', values.profile.firstName ?? '')
        formData.append('profile[lastName]', values.profile.lastName ?? '')
        formData.append(
          'profile[dob]',
          dayjs(values.profile?.dob).format(VITE_DATE_FORMAT_API)
        )
        formData.append('profile[phone]', values.profile.phone ?? '')
        formData.append('profile[address]', values.profile.address ?? '')
        if (fileList.length > 0) {
          formData.append('avatar', fileList[0].originFileObj ?? '')
        }

        if (editingAccount) {
          await updateAccount({ ...editingAccount, ...formData })
        } else {
          await createAccount(formData).unwrap()
          message.success('User created successfully')
        }
        setIsModalVisible(false)
        refetch()
      } catch (error) {
        message.error('Failed to create or update user')
      }
    })
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    await deleteAccount(id)
    refetch()
  }

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const columns: TableProps<Account>['columns'] = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: string) => role.charAt(0).toUpperCase() + role.slice(1),
    },
    {
      title: 'Actions',
      render: (_, account: Account) => (
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => handleEdit(account)}
            className='bg-blue-500 text-white rounded-md hover:bg-blue-600 px-4 py-2'
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(account.id)}
            className='bg-red-500 text-white rounded-md hover:bg-red-600 px-4 py-2'
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Button
        onClick={() => setIsModalVisible(true)}
        className='mb-4 bg-primary text-white rounded-md hover:bg-primary-dark px-4 py-2'
      >
        Add User
      </Button>
      <Table
        dataSource={accounts?.data}
        columns={columns}
        rowKey='id'
        className='bg-white shadow-md rounded-lg'
      />
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className='custom-modal'
        centered
      >
        <div className='bg-white p-4'>
          <h2 className='text-2xl font-bold mb-6 text-primary'>
            {editingAccount ? 'Edit User' : 'Create User'}
          </h2>
          <Form
            form={form}
            initialValues={
              editingAccount || {
                email: '',
                role: 'USER',
                profile: {
                  firstName: '',
                  lastName: '',
                  dob: '',
                  phone: '',
                  address: '',
                },
              }
            }
            onFinish={handleCreateOrUpdate}
            layout='vertical'
            className='space-y-4'
          >
            <Form.Item
              name='avatar'
              label=''
              valuePropName='fileList'
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e
                }
                return e && e.fileList
              }}
            >
              <div className='flex justify-center'>
                <Upload
                  name='avatar'
                  listType='picture-circle'
                  accept='image/*'
                  onChange={({ fileList }) => setFileList(fileList)}
                  maxCount={1}
                  beforeUpload={beforeUpload}
                >
                  {fileList.length < 1 && (
                    <div className='flex flex-col items-center'>
                      <UploadOutlined />
                      <div className='mt-2'>Upload Avatar</div>
                    </div>
                  )}
                </Upload>
              </div>
            </Form.Item>
            <Form.Item
              name='email'
              label='Email'
              rules={[{ required: true, message: 'Please enter an email' }]}
            >
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
            </Form.Item>
            <Form.Item
              name='password'
              label='Password'
              rules={[{ required: true, message: 'Please enter a password' }]}
            >
              <Input
                type='password'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </Form.Item>
            <Form.Item
              name='role'
              label='Role'
              rules={[{ required: true, message: 'Please enter a role' }]}
            >
              <Select
                options={Object.values(RoleAccount).map((role) => ({
                  value: role,
                  label: role.charAt(0).toUpperCase() + role.slice(1),
                }))}
                className='w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary'
              />
            </Form.Item>
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
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
            </Form.Item>
            <Form.Item
              name={['profile', 'lastName']}
              label='Last Name'
              rules={[
                { required: true, message: 'Please enter a last name' },
                { min: 3, message: 'Last name must be at least 3 characters' },
                {
                  max: 30,
                  message: 'Last name must be at most 30 characters',
                },
                {
                  pattern: /^[a-zA-Z]+$/,
                  message: 'Last name must contain only letters',
                },
              ]}
            >
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
            </Form.Item>
            <Form.Item
              name={['profile', 'dob']}
              label='Date of Birth'
              rules={[
                { required: true, message: 'Please enter a date of birth' },
              ]}
            >
              <DatePicker
                format={VITE_DATE_FORMAT_DISPLAY}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              />
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
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
            </Form.Item>
            <Form.Item
              name={['profile', 'address']}
              label='Address'
              rules={[{ required: true, message: 'Please enter an address' }]}
            >
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
            </Form.Item>

            <div className='flex justify-end space-x-4 mt-6'>
              <Button
                onClick={() => setIsModalVisible(false)}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export { AdminUser }
