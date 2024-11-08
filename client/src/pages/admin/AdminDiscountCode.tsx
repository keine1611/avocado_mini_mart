import React, { useState } from 'react'
import {
  Table,
  TableProps,
  Button,
  Modal,
  Form,
  Input,
  message,
  InputRef,
  Select,
  DatePicker,
  Switch,
} from 'antd'
import { DiscountCode, MainCategory } from '@/types'
import {
  useGetDiscountCodesQuery,
  useCreateDiscountCodeMutation,
  useUpdateDiscountCodeMutation,
  useDeleteDiscountCodeMutation,
} from '@/services'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { stringToDateTime } from '@/utils'
import { DISCOUNT_TYPE } from '@/enum'
import dayjs from 'dayjs'
import { loadingActions, useAppDispatch } from '@/store'

const VITE_DATE_FORMAT_API = import.meta.env.VITE_DATE_FORMAT_API

const AdminDiscountCode: React.FC = () => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingDiscountCode, setEditingDiscountCode] =
    useState<DiscountCode | null>(null)
  const [searchedColumn, setSearchedColumn] = useState('')
  let searchInput: InputRef | null = null

  const { data, error, isLoading } = useGetDiscountCodesQuery()
  const [createDiscountCode, { isLoading: isCreating }] =
    useCreateDiscountCodeMutation()
  const [updateDiscountCode, { isLoading: isUpdating }] =
    useUpdateDiscountCodeMutation()
  const [deleteDiscountCode, { isLoading: isDeleting }] =
    useDeleteDiscountCodeMutation()

  const handleCreate = () => {
    setEditingDiscountCode(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (discountCode: DiscountCode) => {
    setEditingDiscountCode(discountCode)
    form.setFieldsValue(discountCode)
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      dispatch(loadingActions.setLoading(true))
      await deleteDiscountCode(id).unwrap()
      message.success('Discount Code deleted successfully')
    } catch (err) {
      message.error('Failed to delete Discount Code')
    }
    dispatch(loadingActions.setLoading(false))
  }

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingDiscountCode) {
          await updateDiscountCode({
            id: editingDiscountCode.id,
            ...values,
            expiryDate:
              dayjs(values.expiryDate).format(VITE_DATE_FORMAT_API) ?? '',
          }).unwrap()
          message.success('Discount Code updated successfully')
        } else {
          await createDiscountCode({
            ...values,
            expiryDate:
              dayjs(values.expiryDate).format(VITE_DATE_FORMAT_API) ?? '',
          }).unwrap()
          message.success('Discount Code created successfully')
        }
        setIsModalVisible(false)
        form.resetFields()
      } catch (err: any) {
        message.error(err.data?.message)
      }
    })
  }

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm()
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: any) => {
    clearFilters()
  }

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Button
          type='primary'
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput?.select(), 100)
      }
    },
  })

  const columns: TableProps<DiscountCode>['columns'] = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Discount Type',
      dataIndex: 'discountType',
      key: 'discountType',
      render: (text: any) =>
        text === DISCOUNT_TYPE.PERCENTAGE ? 'Percentage' : 'Fixed',
      ...getColumnSearchProps('discountType'),
    },
    {
      title: 'Discount Value',
      dataIndex: 'discountValue',
      key: 'discountValue',
      ...getColumnSearchProps('discountValue'),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (text: any) => stringToDateTime(text),
    },
    {
      title: 'Usage Limit',
      dataIndex: 'usageLimit',
      key: 'usageLimit',
      ...getColumnSearchProps('usageLimit'),
    },
    {
      title: 'Times Used',
      dataIndex: 'timesUsed',
      key: 'timesUsed',
      ...getColumnSearchProps('timesUsed'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => handleEdit(record)}
            className=' btn btn-square btn-sm border border-primary text-primary hover:border hover:border-primary hover:text-primary'
          >
            <EditOutlined className='text-primary' />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className=' btn btn-square btn-sm border border-red-500 text-red-500 hover:border hover:border-red-500 hover:text-red-500'
          >
            <DeleteOutlined className='text-red-500' />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className='w-full h-full overflow-y-auto p-4'>
      <Button icon={<PlusOutlined />} onClick={handleCreate} className='mb-4'>
        Add Discount Code
      </Button>
      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => record.id}
        loading={isLoading}
        className='bg-white shadow-md rounded-lg'
        scroll={{ x: 'max-content' }}
      />
      <Modal
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        className='custom-modal'
        footer={null}
        centered
      >
        <div className='bg-white p-4'>
          <h2 className='text-2xl font-bold mb-6 text-primary'>
            {editingDiscountCode
              ? 'Edit Discount Code'
              : 'Create Discount Code'}
          </h2>
          <Form form={form} layout='vertical' className='space-y-4'>
            <Form.Item
              name='code'
              label='Code'
              rules={[{ required: true, message: 'Please input the code!' }]}
            >
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
            </Form.Item>
            <Form.Item
              name='discountType'
              label='Discount Type'
              rules={[
                { required: true, message: 'Please select the discount type!' },
              ]}
            >
              <Select className='w-full  rounded-md focus:outline-none focus:ring-2 focus:ring-primary'>
                {Object.values(DISCOUNT_TYPE).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='discountValue'
              label='Discount Value'
              rules={[
                { required: true, message: 'Please input the discount value!' },
              ]}
            >
              <Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary' />
            </Form.Item>
            <Form.Item
              name='expiryDate'
              label='Expiry Date'
              rules={[
                { required: true, message: 'Please input the expiry date!' },
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
              name='usageLimit'
              label='Usage Limit'
              rules={[
                { required: true, message: 'Please input the usage limit!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='isActive' label='Is Active'>
              <Switch />
            </Form.Item>
            <div className='flex justify-end space-x-4 mt-6'>
              <Button
                onClick={() => setIsModalVisible(false)}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </Button>
              <Button
                onClick={handleModalOk}
                type='primary'
                className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
                loading={isCreating || isUpdating}
              >
                {editingDiscountCode ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export { AdminDiscountCode }
