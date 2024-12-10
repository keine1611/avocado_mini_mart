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
  Checkbox,
  Tag,
} from 'antd'
import {
  useGetAllAccountQuery,
  useGetAllRoleQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  handleError,
} from '@/services'
import { Account, Role } from '@/types'
import dayjs from 'dayjs'
import { UploadOutlined } from '@ant-design/icons'
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'

import { showToast } from '@/components'
import { stringToDateTime } from '@/utils'
import { Gender } from '@/enum/gender'
import { ACCOUNT_STATUS } from '@/enum/accountStatus'

const { VITE_DATE_FORMAT_API } = import.meta.env

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const AdminUser: React.FC = () => {
  const [form] = Form.useForm()
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isFetching: isFetchingAccounts,
    error,
  } = useGetAllAccountQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const { data: roles } = useGetAllRoleQuery()
  const [createAccount, { isLoading: isLoadingCreateAccount }] =
    useCreateAccountMutation()
  const [updateAccount, { isLoading: isLoadingUpdateAccount }] =
    useUpdateAccountMutation()
  const [deleteAccount] = useDeleteAccountMutation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [filelist, setFileList] = useState<UploadFile[]>([])
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false)

  const [isEditingProfile, setIsEditingProfile] = useState(false)

  useEffect(() => {
    if (error) {
      showToast.error(handleError(error))
    }
  }, [error])

  const handleCreateOrUpdate = async () => {
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData()
        formData.append('roleId', values.roleId)
        if (!editingAccount) {
          formData.append('password', values.password)
          formData.append('email', values.email)
        } else {
          formData.append('status', values.status)
        }
        if (isEditingProfile) {
          formData.append('profile[firstName]', values.profile.firstName ?? '')
          formData.append('profile[lastName]', values.profile.lastName ?? '')
          formData.append(
            'profile[dob]',
            dayjs(values.profile.dob).format(VITE_DATE_FORMAT_API) ?? ''
          )
          formData.append('profile[phone]', values.profile.phone ?? '')
          formData.append('profile[address]', values.profile.address ?? '')
          formData.append('profile[gender]', values.profile.gender ?? '')
        }

        if (filelist.length > 0) {
          formData.append('avatar', filelist[0].originFileObj ?? '')
        }

        if (editingAccount) {
          const id = editingAccount.id
          await updateAccount({ id, account: formData }).unwrap()
        } else {
          await createAccount(formData).unwrap()
          message.success('User created successfully')
        }
        setIsModalVisible(false)
        form.resetFields()
        setFileList([])
      } catch (error: any) {
        const errorMessage = handleError(error)
        message.error(errorMessage || 'Failed to create or update user')
      }
    })
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    form.setFieldsValue(account)
    setFileList(
      account.avatarUrl
        ? [
            {
              uid: '-1',
              name: 'avatar',
              status: 'done',
              url: account.avatarUrl,
            },
          ]
        : []
    )
    setIsModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteAccount(id).unwrap()
          message.success('User deleted successfully')
        } catch (error) {
          message.error('Failed to delete user')
        }
      },
    })
  }

  const handleCreate = () => {
    setEditingAccount(null)
    form.resetFields()
    setFileList([])
    setIsModalVisible(true)
  }

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2

    return isJpgOrPng && isLt2M
  }

  const handleSearch = (confirm: any) => {
    confirm()
  }

  const handleReset = (clearFilters: any) => {
    clearFilters()
  }

  const getColumnSearchProps = (
    dataIndex: string,
    isSelect: boolean = false,
    options: any[] = []
  ) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        {isSelect ? (
          <Select
            style={{ width: 188, marginBottom: 8, display: 'block' }}
            placeholder={`Select ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
          >
            {options.map((option) => (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(confirm)}
            style={{ marginBottom: 8, display: 'block' }}
          />
        )}
        <Button
          type='primary'
          onClick={() => handleSearch(confirm)}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size='small'
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      isSelect
        ? record[dataIndex]?.id === value
        : record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
  })

  const columns: TableProps<Account>['columns'] = [
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      render: (avatarUrl: string) => (
        <img src={avatarUrl} alt='avatar' className='w-10 h-10 rounded-full' />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'First Name',
      dataIndex: 'profile.firstName',
      ...getColumnSearchProps('profile.firstName'),
      render: (_, record: Account) => record.profile?.firstName || '-',
    },
    {
      title: 'Last Name',
      dataIndex: 'profile.lastName',
      ...getColumnSearchProps('profile.lastName'),
      render: (_, record: Account) => record.profile?.lastName || '-',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: Role) => role.name,
      ...getColumnSearchProps('role', true, roles?.data || []),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: ACCOUNT_STATUS) => {
        switch (status) {
          case ACCOUNT_STATUS.ACTIVE:
            return <Tag color='green'>Active</Tag>
          case ACCOUNT_STATUS.RESTRICTED:
            return <Tag color='orange'>Restricted</Tag>
          case ACCOUNT_STATUS.BANNED:
            return <Tag color='red'>Banned</Tag>
          case ACCOUNT_STATUS.DELETED:
            return <Tag color='red'>Deleted</Tag>
        }
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (createdAt: string) => stringToDateTime(createdAt),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      render: (updatedAt: string) => stringToDateTime(updatedAt),
    },
    {
      title: 'Actions',
      render: (_, account: Account) => (
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handleEdit(account)}
              className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
            >
              <EditOutlined className='text-primary' />
            </button>
            <button
              onClick={() => handleDelete(account.id)}
              className=' btn btn-square btn-sm border border-red-500 text-red-500 hover:border hover:border-red-500 hover:text-red-500'
            >
              <DeleteOutlined className='text-red-500' />
            </button>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Button
        onClick={handleCreate}
        className='mb-4 bg-primary text-white rounded-md hover:bg-primary-dark px-4 py-2'
      >
        Add User
      </Button>
      <Table
        dataSource={accounts?.data}
        columns={columns}
        rowKey='id'
        className='bg-white shadow-md rounded-lg'
        scroll={{ x: 'max-content' }}
        loading={isLoadingAccounts || isFetchingAccounts}
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
            onFinish={handleCreateOrUpdate}
            layout='vertical'
            className='space-y-4'
          >
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

            {!editingAccount && (
              <>
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
                  rules={[
                    { required: true, message: 'Please enter a password' },
                  ]}
                >
                  <Input
                    type='password'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  />
                </Form.Item>
              </>
            )}
            <Form.Item
              name='roleId'
              label='Role'
              rules={[{ required: true, message: 'Please enter a role' }]}
            >
              <Select
                options={roles?.data.map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
                onChange={(value) => {
                  form.setFieldValue('roleId', value)
                }}
                className='w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary'
              />
            </Form.Item>
            {editingAccount && (
              <Form.Item name='status' label='Status'>
                <Select>
                  <Select.Option value={ACCOUNT_STATUS.ACTIVE}>
                    Active
                  </Select.Option>
                  <Select.Option value={ACCOUNT_STATUS.RESTRICTED}>
                    Restricted
                  </Select.Option>
                  <Select.Option value={ACCOUNT_STATUS.BANNED}>
                    Banned
                  </Select.Option>
                  <Select.Option value={ACCOUNT_STATUS.DELETED}>
                    Deleted
                  </Select.Option>
                </Select>
              </Form.Item>
            )}
            <Form.Item>
              <Checkbox
                checked={isEditingProfile}
                onChange={(e) => setIsEditingProfile(e.target.checked)}
              >
                {editingAccount ? 'Edit Profile' : 'Create Profile'}
              </Checkbox>
            </Form.Item>

            {isEditingProfile && (
              <>
                <Form.Item
                  name={['profile', 'firstName']}
                  label='First Name'
                  rules={[
                    {
                      required: isEditingProfile,
                      message: 'Please enter a first name',
                    },
                    {
                      min: 3,
                      message: 'First name must be at least 3 characters',
                    },
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
                    {
                      required: isEditingProfile,
                      message: 'Please enter a last name',
                    },
                    {
                      min: 3,
                      message: 'Last name must be at least 3 characters',
                    },
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
                  name={['profile', 'gender']}
                  label='Gender'
                  rules={[
                    {
                      required: isEditingProfile,
                      message: 'Please enter a gender',
                    },
                  ]}
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
                    {
                      required: isEditingProfile,
                      message: 'Please enter a date of birth',
                    },
                  ]}
                  getValueProps={(value) => {
                    return {
                      value: value ? dayjs(value, VITE_DATE_FORMAT_API) : null,
                    }
                  }}
                >
                  <DatePicker
                    format={'DD/MM/YYYY'}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  />
                </Form.Item>
                <Form.Item
                  name={['profile', 'phone']}
                  label='Phone'
                  rules={[
                    {
                      required: isEditingProfile,
                      message: 'Please enter a phone number',
                    },
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
                  rules={[
                    {
                      required: isEditingProfile,
                      message: 'Please enter an address',
                    },
                  ]}
                >
                  <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
                </Form.Item>
              </>
            )}

            <div className='flex justify-end space-x-4 mt-6'>
              <Button
                onClick={() => setIsModalVisible(false)}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </Button>
              {editingAccount && (
                <Button
                  type='primary'
                  className='px-4 py-2 bg-secondary text-white rounded-md'
                  onClick={() => setIsChangePasswordModalVisible(true)}
                >
                  Change Password
                </Button>
              )}
              <Button
                type='primary'
                htmlType='submit'
                className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
                loading={isLoadingCreateAccount || isLoadingUpdateAccount}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <Modal
        open={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        footer={null}
        className='modal-change-password'
        centered
      >
        <div className='bg-white p-4'>
          <h2 className='text-2xl font-bold mb-6 text-primary'>
            Change Password
          </h2>
          <Form layout='vertical'>
            <Form.Item name='password' label='Password'>
              <Input type='password' />
            </Form.Item>
            <Form.Item name={'retypePassword'} label='Retype password'>
              <Input type='password' />
            </Form.Item>
          </Form>
          <div className='flex justify-end space-x-4 mt-6'>
            <Button
              onClick={() => setIsChangePasswordModalVisible(false)}
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </Button>
            <Button
              type='primary'
              className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export { AdminUser }
