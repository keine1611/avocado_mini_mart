import { useEffect, useState } from 'react'
import { BatchProduct, Product } from '@/types'
import { Select, Table, Tabs, Tag, Tooltip } from 'antd'
import {
  useGetAllProductWithoutPaginationQuery,
  useLazyGetBatchProductQuery,
  useLazyGetExpiredProductQuery,
  useLazyGetNearlyExpiredProductQuery,
  useLazyGetProductLowStockQuery,
} from '@/services'
import { ColumnsType } from 'antd/es/table'
import { formatCurrency, formatQuantity, stringToDate } from '@/utils'
import { exportExcel } from '@/utils'
import dayjs from 'dayjs'

const AdminBatchProduct: React.FC = () => {
  const { data: products } = useGetAllProductWithoutPaginationQuery()
  const [
    getBatchProduct,
    { isLoading: isBatchProductLoading, isFetching: isBatchProductFetching },
  ] = useLazyGetBatchProductQuery()

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [batchProduct, setBatchProduct] = useState<{
    product: Product & { stock: number; expectedStock: number }
    batchProduct: BatchProduct[]
  } | null>(null)
  const [activeTab, setActiveTab] = useState<
    'lowStock' | 'nearlyExpired' | 'expired' | 'batchProduct'
  >('batchProduct')
  const handleProductSelect = (value: string | null) => {
    const product = products?.data?.find((p) => p.id.toString() == value)
    setSelectedProduct(product || null)
  }

  useEffect(() => {
    const fetchBatchProduct = async () => {
      if (selectedProduct) {
        const { data } = await getBatchProduct(selectedProduct.id)
        setBatchProduct(data?.data || null)
      }
    }
    fetchBatchProduct()
  }, [selectedProduct])

  const columns: ColumnsType<BatchProduct> = [
    {
      title: 'Batch Code',
      dataIndex: 'batch.code',
      key: 'batch.code',
      render: (_, record) => {
        return record.batch?.code
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Initial Quantity',
      dataIndex: 'initialQuantity',
      key: 'initialQuantity',
      sorter: (a, b) => a.initialQuantity - b.initialQuantity,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => {
        return formatCurrency(record.price)
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Arrival Date',
      dataIndex: 'batch.arrivalDate',
      key: 'batch.arrivalDate',
      render: (_, record) => {
        return stringToDate(record.batch?.arrivalDate || '')
      },
      sorter: (a, b) =>
        Number(a.batch?.arrivalDate) - Number(b.batch?.arrivalDate),
    },
    {
      title: 'Status',
      dataIndex: 'batch.isActive',
      key: 'batch.isActive',
      render: (_, record) => {
        return (
          <Tag color={record.batch?.isActive ? 'green' : 'red'}>
            {record.batch?.isActive ? 'Active' : 'Inactive'}
          </Tag>
        )
      },
    },
    {
      title: 'Expired Date',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      render: (_, record) => {
        const expiryDate = dayjs(record.expiredDate)
        const today = dayjs()
        const daysUntilExpiry = expiryDate.diff(today, 'day')

        let className = 'px-3 py-1 rounded-full font-medium'
        let tooltipColor = ''

        if (daysUntilExpiry < 0) {
          className += ' bg-red-100 text-red-700'
          tooltipColor = 'red'
        } else if (daysUntilExpiry <= 7) {
          className += ' bg-orange-100 text-orange-700'
          tooltipColor = 'orange'
        } else if (daysUntilExpiry <= 30) {
          className += ' bg-yellow-100 text-yellow-700'
          tooltipColor = 'yellow'
        } else {
          className += ' bg-green-100 text-green-700'
          tooltipColor = 'green'
        }

        const tooltipText =
          daysUntilExpiry < 0
            ? `Đã hết hạn ${Math.abs(daysUntilExpiry)} ngày trước`
            : `Còn ${daysUntilExpiry} ngày nữa hết hạn`

        return (
          <Tooltip title={tooltipText} color={tooltipColor} placement='top'>
            <span className={className}>
              {stringToDate(record.expiredDate)}
            </span>
          </Tooltip>
        )
      },
      sorter: (a, b) => Number(a.expiredDate) - Number(b.expiredDate),
    },
  ]

  const [
    getProductLowStock,
    {
      data: lowStockProducts,
      isLoading: isProductLowStockLoading,
      isFetching: isProductLowStockFetching,
    },
  ] = useLazyGetProductLowStockQuery()

  const lowStockColumns: ColumnsType<Product & { stock: number }> = [
    {
      title: '',
      dataIndex: 'mainImage',
      key: 'mainImage',
      render: (_, record) => {
        return (
          <img
            src={record.mainImage}
            alt={record.name}
            className='h-16 w-16 object-contain'
          />
        )
      },
      width: 100,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
    {
      title: 'Brand',
      dataIndex: 'brand.name',
      key: 'brand.name',
      render: (_, record) => {
        return record.brand?.name
      },
    },
    {
      title: 'Type',
      dataIndex: 'subCategory.name',
      key: 'subCategory.name',
      render: (_, record) => {
        return record.subCategory?.name
      },
    },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
  ]

  useEffect(() => {
    const fetchProductLowStock = async () => {
      if (activeTab === 'lowStock') {
        getProductLowStock()
      }
    }
    fetchProductLowStock()
  }, [activeTab])

  return (
    <div className='p-4'>
      <Tabs
        defaultActiveKey={activeTab}
        onChange={(key) =>
          setActiveTab(
            key as 'lowStock' | 'nearlyExpired' | 'expired' | 'batchProduct'
          )
        }
        className='mt-4'
      >
        <Tabs.TabPane tab='Batch Product' key='batchProduct'>
          <Select
            onChange={(value) => {
              handleProductSelect(value)
            }}
            placeholder='Select a product'
            className='w-full'
            filterOption={(input, option) => {
              return (option?.label ?? '')
                .toString()
                .toLowerCase()
                .includes(input.toString().toLowerCase())
            }}
            value={null}
            showSearch
          >
            {products?.data?.map((product) => (
              <Select.Option
                key={product.id}
                value={product.id}
                label={product.name}
              >
                <div className='flex flex-row items-center justify-between gap-2 px-3'>
                  <div className='flex items-center gap-2'>
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className=' h-8 w-8 object-contain'
                    />
                    <p>{product.name}</p>
                  </div>
                  <p className='hidden md:block'>{product.barcode}</p>
                </div>
              </Select.Option>
            ))}
          </Select>
          <div className='grid grid-cols-3 gap-2 mt-4 '>
            <div className='flex flex-col items-center justify-center border border-gray-200 rounded-lg p-4 gap-2'>
              <img
                src={batchProduct?.product.mainImage}
                alt=''
                className='h-32 w-32 object-contain'
              />
              <p className='text-lg font-bold text-center'>
                {batchProduct?.product.name}
              </p>
            </div>
            <div className='flex flex-col col-span-2 items-start gap-2 border border-gray-200 rounded-lg p-4'>
              <div className='flex flex-row items-center justify-start gap-2'>
                <p className='font-semibold'>Barcode:</p>
                <p className=' text-gray-500'>
                  {batchProduct?.product.barcode}
                </p>
              </div>
              <div className='flex flex-row items-center justify-start gap-2'>
                <p className='font-semibold'>Brand:</p>
                <p className=' text-gray-500'>
                  {batchProduct?.product.brand?.name}
                </p>
              </div>
              <div className='flex flex-row items-center justify-start gap-2'>
                <p className='font-semibold'>Type:</p>
                <p className=' text-gray-500'>
                  {batchProduct?.product.subCategory?.name}
                </p>
              </div>
              <div className='flex flex-row items-center justify-start gap-2'>
                <p className='font-semibold'>Standard Price:</p>
                <p className=' text-gray-500'>
                  {formatCurrency(batchProduct?.product.standardPrice || 0)}
                </p>
              </div>
              <div className='flex flex-row items-center justify-start gap-2'>
                <p className='font-semibold'>Stock:</p>
                <p className=' text-gray-500'>{batchProduct?.product.stock}</p>
              </div>
              <div className='flex flex-row items-center justify-start gap-2'>
                <p className='font-semibold'>Expected Stock:</p>
                <p className=' text-gray-500'>
                  {batchProduct?.product.expectedStock}
                </p>
              </div>
            </div>
          </div>
          <Table
            dataSource={batchProduct?.batchProduct}
            columns={columns}
            loading={isBatchProductLoading || isBatchProductFetching}
            className='mt-4'
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Nearly expired' key='nearlyExpired'>
          <TableNearlyExpiredProduct />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Low stock' key='lowStock'>
          <button
            className='btn btn-primary btn-sm mb-4 text-white ml-auto block'
            onClick={() =>
              exportExcel(lowStockProducts?.data || [], 'lowStockProducts')
            }
            disabled={isProductLowStockLoading || isProductLowStockFetching}
          >
            Export excel
          </button>
          <Table
            dataSource={lowStockProducts?.data}
            columns={lowStockColumns as ColumnsType<{ stock: number }>}
            loading={isProductLowStockLoading || isProductLowStockFetching}
            className='mt-4'
            scroll={{ y: 400 }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Expired' key='4'>
          <TabExpiredProduct />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

const TableNearlyExpiredProduct: React.FC = () => {
  const [
    getNearlyExpiredProduct,
    {
      data: nearlyExpiredProducts,
      isLoading: isNearlyExpiredProductLoading,
      isFetching: isNearlyExpiredProductFetching,
    },
  ] = useLazyGetNearlyExpiredProductQuery()

  const [expandedRowKey, setExpandedRowKey] = useState<number | null>(null)

  const handleNearlyExpiredProductSelect = (value: string | null) => {
    getNearlyExpiredProduct({ days: Number(value) })
    setExpandedRowKey(null)
  }

  const columns: ColumnsType<Product & { batchProduct: BatchProduct[] }> = [
    {
      title: '',
      dataIndex: 'mainImage',
      key: 'mainImage',
      render: (_, record) => {
        return (
          <img
            src={record.mainImage}
            alt={record.name}
            className='h-16 w-16 object-contain'
          />
        )
      },
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return <span className='font-semibold'>{record.name}</span>
      },
    },
    { title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
    {
      title: 'Brand',
      dataIndex: 'brand.name',
      key: 'brand.name',
      render: (_, record) => {
        return record.brand?.name
      },
    },
    {
      title: 'Type',
      dataIndex: 'subCategory.name',
      key: 'subCategory.name',
      render: (_, record) => {
        return record.subCategory?.name
      },
    },
  ]

  const expandable = {
    expandedRowRender: (record: Product & { batchProduct: BatchProduct[] }) => {
      return (
        <div className=' ml-16 p-4 bg-gray-100 rounded-lg shadow-md'>
          <Table
            dataSource={record.batchProduct}
            columns={[
              {
                title: 'Batch Code',
                dataIndex: 'batch.code',
                key: 'batch.code',
                render: (_, record) => {
                  return (
                    <span className='font-semibold'>{record.batch?.code}</span>
                  )
                },
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                render: (_, record) => {
                  return <span>{formatQuantity(record.quantity)}</span>
                },
              },
              {
                title: 'Initial Quantity',
                dataIndex: 'initialQuantity',
                key: 'initialQuantity',
                render: (_, record) => {
                  return <span>{formatQuantity(record.initialQuantity)}</span>
                },
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (_, record) => {
                  return <span>{formatCurrency(record.price)}</span>
                },
              },
              {
                title: 'Expired Date',
                dataIndex: 'expiredDate',
                key: 'expiredDate',
                render: (_, record) => {
                  return <span>{stringToDate(record.expiredDate)}</span>
                },
                width: 150,
              },
            ]}
            pagination={false}
            rowKey='id'
            className='mt-2'
            scroll={{ y: 500, x: 500 }}
          />
        </div>
      )
    },
    rowExpandable: (record: Product & { batchProduct: BatchProduct[] }) => {
      return record.batchProduct && record.batchProduct.length > 0
    },
  }

  return (
    <div>
      <Select
        onChange={(value) => {
          handleNearlyExpiredProductSelect(value)
        }}
        placeholder='Select days'
        className=' w-full'
      >
        <Select.Option value={14}> Nearly expired 14 days</Select.Option>
        <Select.Option value={30}> Nearly expired 30 days</Select.Option>
        <Select.Option value={60}> Nearly expired 60 days</Select.Option>
      </Select>
      <Table
        rowKey='id'
        dataSource={
          nearlyExpiredProducts?.data as
            | readonly (Product & { batchProduct: BatchProduct[] })[]
            | undefined
        }
        columns={columns}
        loading={
          isNearlyExpiredProductLoading || isNearlyExpiredProductFetching
        }
        className='mt-4'
        expandable={{
          ...expandable,
          expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
          onExpand: (expanded, record) => {
            setExpandedRowKey(expanded ? record.id : null)
          },
        }}
        expandRowByClick
        scroll={{ y: 400, x: 500 }}
      />
    </div>
  )
}

const TabExpiredProduct: React.FC = () => {
  const [
    getExpiredProduct,
    {
      data: expiredProducts,
      isLoading: isExpiredProductLoading,
      isFetching: isExpiredProductFetching,
    },
  ] = useLazyGetExpiredProductQuery()

  const [expandedRowKey, setExpandedRowKey] = useState<number | null>(null)

  const handleExpiredProductSelect = (value: string | null) => {
    getExpiredProduct({ days: Number(value) })
    setExpandedRowKey(null)
  }

  const columns: ColumnsType<Product & { batchProduct: BatchProduct[] }> = [
    {
      title: '',
      dataIndex: 'mainImage',
      key: 'mainImage',
      render: (_, record) => {
        return (
          <img
            src={record.mainImage}
            alt={record.name}
            className='h-16 w-16 object-cover'
          />
        )
      },
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return <span className='font-semibold'>{record.name}</span>
      },
    },
    { title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
    {
      title: 'Brand',
      dataIndex: 'brand.name',
      key: 'brand.name',
      render: (_, record) => {
        return record.brand?.name
      },
    },
    {
      title: 'Type',
      dataIndex: 'subCategory.name',
      key: 'subCategory.name',
      render: (_, record) => {
        return record.subCategory?.name
      },
    },
  ]

  const expandable = {
    expandedRowRender: (record: Product & { batchProduct: BatchProduct[] }) => {
      return (
        <div className=' ml-16 p-4 bg-gray-100 rounded-lg shadow-md'>
          <Table
            dataSource={record.batchProduct}
            columns={[
              {
                title: 'Batch Code',
                dataIndex: 'batch.code',
                key: 'batch.code',
                render: (_, record) => {
                  return (
                    <span className='font-semibold'>{record.batch?.code}</span>
                  )
                },
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                render: (_, record) => {
                  return <span>{formatQuantity(record.quantity)}</span>
                },
              },
              {
                title: 'Initial Quantity',
                dataIndex: 'initialQuantity',
                key: 'initialQuantity',
                render: (_, record) => {
                  return <span>{formatQuantity(record.initialQuantity)}</span>
                },
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (_, record) => {
                  return <span>{formatCurrency(record.price)}</span>
                },
              },
              {
                title: 'Expired Date',
                dataIndex: 'expiredDate',
                key: 'expiredDate',
                render: (_, record) => {
                  return <span>{stringToDate(record.expiredDate)}</span>
                },
                width: 150,
              },
            ]}
            pagination={false}
            rowKey='id'
            className='mt-2'
            scroll={{ y: 500, x: 500 }}
          />
        </div>
      )
    },
    rowExpandable: (record: Product & { batchProduct: BatchProduct[] }) => {
      return record.batchProduct && record.batchProduct.length > 0
    },
  }

  return (
    <div>
      <Select
        onChange={(value) => {
          handleExpiredProductSelect(value)
        }}
        placeholder='Select days'
        className=' w-full'
      >
        <Select.Option value={7}> Expired 7 days</Select.Option>
        <Select.Option value={14}> Expired 14 days</Select.Option>
        <Select.Option value={30}> Expired 30 days</Select.Option>
      </Select>
      <Table
        rowKey='id'
        dataSource={
          expiredProducts?.data as
            | readonly (Product & { batchProduct: BatchProduct[] })[]
            | undefined
        }
        columns={columns}
        loading={isExpiredProductLoading || isExpiredProductFetching}
        className='mt-4'
        expandable={{
          ...expandable,
          expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
          onExpand: (expanded, record) => {
            setExpandedRowKey(expanded ? record.id : null)
          },
        }}
        expandRowByClick
        scroll={{ y: 400, x: 500 }}
      />
    </div>
  )
}
export { AdminBatchProduct }
