import { Loading } from '@/components/ui/Loading'
import {
  useGetChartProductAnalyticsDataByPeriodQuery,
  useGetProductDataQuery,
  useGetProductPriceHistoryQuery,
  useGetProductSalesDataByPeriodQuery,
} from '@/services/dashboard'
import { useUpdateProductPriceMutation } from '@/services/product'
import { formatCurrency } from '@/utils/currency'
import { stringToDateTime } from '@/utils/date'
import { Modal, Table, Rate, Form, Input } from 'antd'
import { ColumnType } from 'antd/es/table/interface'
import { useState, useEffect } from 'react'
import { Line } from 'recharts'
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { LineChart } from 'recharts'
import { EditOutlined } from '@ant-design/icons'
import { showToast } from '@/components'

const AdminSaleAnalytics = () => {
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('day')
  const [selectedProductAnalytics, setSelectedProductAnalytics] = useState<
    any | null
  >(null)
  const [openModalProductAnalytics, setOpenModalProductAnalytics] =
    useState(false)
  const {
    data,
    isLoading: isLoadingProductAnalytics,
    isFetching: isFetchingProductAnalytics,
  } = useGetProductSalesDataByPeriodQuery({
    period,
  })

  const columns: ColumnType<any>[] = [
    {
      title: 'Product',
      dataIndex: 'product',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <img
            className='w-24 h-24 object-contain rounded-md'
            src={record.mainImage}
            alt='product'
          />
          <span className='text-sm truncate line-clamp-1'>{record.name}</span>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'averageRating',
      render: (value) => <Rate value={value} disabled />,
      sorter: (a, b) => a.averageRating - b.averageRating,
      width: 150,
    },
    {
      title: 'Total Sold',
      dataIndex: 'totalQuantitySold',
      sorter: (a, b) => a.totalQuantitySold - b.totalQuantitySold,
      width: 150,
    },

    {
      title: 'Revenue',
      dataIndex: 'totalRevenue',
      render: (value) => formatCurrency(value),
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      width: 150,
    },
    {
      title: 'Profit',
      dataIndex: 'totalProfit',
      render: (value) => formatCurrency(value),
      sorter: (a, b) => a.totalProfit - b.totalProfit,
      width: 150,
    },
  ]

  const handleChangePeriod = (value: string) => {
    setPeriod(value as 'day' | 'month' | 'year')
  }
  return (
    <div className='flex flex-col gap-2 px-4 pt-4'>
      <select
        className='w-48 input-sm border ml-auto border-gray-300 rounded-md input-bordered input-primary'
        defaultValue='day'
        onChange={(e) => handleChangePeriod(e.target.value)}
      >
        <option value='day'>The past 24 hours</option>
        <option value='week'>The past 7 days</option>
        <option value='month'>The past 30 days</option>
        <option value='year'>The past 365 days</option>
      </select>
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoadingProductAnalytics || isFetchingProductAnalytics}
        pagination={false}
        scroll={{ y: 500, x: 1000 }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedProductAnalytics(record)
            setOpenModalProductAnalytics(true)
          },
        })}
        rowKey='id'
        className='w-full mt-4'
      />
      <ModalProductAnalytics
        open={openModalProductAnalytics}
        onClose={() => setOpenModalProductAnalytics(false)}
        productId={selectedProductAnalytics?.id || null}
      />
    </div>
  )
}

const ModalProductAnalytics = ({
  open,
  onClose,
  productId,
}: {
  open: boolean
  onClose: () => void
  productId: number | null
}) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day')

  const {
    data: chartProductAnalyticsDataByPeriod,
    isLoading: isLoadingChartProductAnalyticsDataByPeriod,
    isFetching: isFetchingChartProductAnalyticsDataByPeriod,
  } = useGetChartProductAnalyticsDataByPeriodQuery(
    {
      period,
      productId: productId?.toString() || '',
    },
    { skip: productId === null }
  )
  const {
    data: product,
    refetch: refetchProduct,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
  } = useGetProductDataQuery(
    { productId: productId || 0 },
    { skip: productId === null || productId === undefined || productId === 0 }
  )
  const {
    data: productPriceHistory,
    isLoading: isLoadingProductPriceHistory,
    isFetching: isFetchingProductPriceHistory,
    refetch: refetchProductPriceHistory,
  } = useGetProductPriceHistoryQuery(
    {
      productId: productId || 0,
    },
    { skip: productId === null }
  )

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1200}
      centered
      footer={null}
      title='Product Analytics'
    >
      <div className='w-full px-4 py-10 max-h-[80vh] overflow-y-auto'>
        {isLoadingProduct ||
        isLoadingProductPriceHistory ||
        isFetchingProduct ||
        isFetchingProductPriceHistory ? (
          <div className='text-center flex items-center justify-center h-full min-h-48'>
            <Loading size='loading-md' />
          </div>
        ) : (
          <>
            <ProductInfo
              product={product?.data}
              refetchProduct={refetchProduct}
              refetchPriceHistory={refetchProductPriceHistory}
              isLoading={isLoadingProduct}
              isFetching={isFetchingProduct}
            />
            <div className='flex items-center justify-end mb-4'>
              <select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value as 'day' | 'month' | 'year')
                }
                className='select select-sm select-bordered'
              >
                <option value='day'>The past 24 hours</option>
                <option value='week'>The past 7 days</option>
                <option value='month'>The past 30 days</option>
                <option value='year'>The past 365 days</option>
              </select>
            </div>
            <div className='flex items-center justify-between mt-2'>
              <ResponsiveContainer width='100%' height={400}>
                {isLoadingChartProductAnalyticsDataByPeriod ||
                isFetchingChartProductAnalyticsDataByPeriod ? (
                  <div className='text-center flex items-center justify-center h-full'>
                    <Loading />
                  </div>
                ) : (
                  <LineChart
                    data={chartProductAnalyticsDataByPeriod}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='#f0f0f0'
                      vertical={false}
                    />
                    <XAxis
                      dataKey='name'
                      stroke='#666'
                      fontSize={12}
                      tickLine={false}
                      tick={false}
                    />
                    <YAxis
                      stroke='#666'
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '12px',
                      }}
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          return (
                            <div className='custom-tooltip bg-white shadow-lg rounded-lg p-3 text-sm'>
                              <p className='text-sm font-medium mb-2 text-gray-600'>
                                {payload[0].payload.name}
                              </p>
                              <div className='space-y-2'>
                                <p className='text-sm text-gray-700'>
                                  Total Quantity Sold:{' '}
                                  {payload[0].payload.totalQuantitySold}
                                </p>
                                <p className='text-sm text-gray-700'>
                                  Revenue:{' '}
                                  {formatCurrency(payload[0].value ?? 0)}
                                </p>

                                <p className='text-sm text-gray-700'>
                                  Profit:{' '}
                                  {formatCurrency(
                                    payload[0].payload.totalProfit ?? 0
                                  )}
                                </p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend
                      verticalAlign='top'
                      height={36}
                      formatter={(value) => {
                        switch (value) {
                          case 'totalRevenue':
                            return 'Revenue'
                          case 'totalProfit':
                            return 'Profit'
                          case 'totalQuantitySold':
                            return 'Quantity Sold'
                          default:
                            return value
                        }
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='totalRevenue'
                      stroke='#4f46e5'
                      strokeWidth={2}
                      dot={false}
                      activeDot={false}
                    />
                    <Line
                      type='monotone'
                      dataKey='totalProfit'
                      stroke='#22c55e'
                      strokeWidth={2}
                      dot={false}
                      activeDot={false}
                    />
                    <Line
                      type='monotone'
                      dataKey='totalQuantitySold'
                      stroke='#f59e0b'
                      strokeWidth={2}
                      dot={false}
                      activeDot={false}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
            <TableProductPriceHistory
              productPriceHistory={productPriceHistory}
              isLoadingProductPriceHistory={isLoadingProductPriceHistory}
              isFetchingProductPriceHistory={isFetchingProductPriceHistory}
            />
          </>
        )}
      </div>
    </Modal>
  )
}

const TableProductPriceHistory = ({
  productPriceHistory,
  isLoadingProductPriceHistory,
  isFetchingProductPriceHistory,
}: {
  productPriceHistory: any[]
  isLoadingProductPriceHistory: boolean
  isFetchingProductPriceHistory: boolean
}) => {
  const calculateGrowthPercentage = (
    currentValue: number,
    prevValue: number
  ): number => {
    if (prevValue === 0 && currentValue === 0) {
      return 0
    }

    if (prevValue === 0) {
      return currentValue > 0 ? 100 : -100
    }

    return ((currentValue - prevValue) / prevValue) * 100
  }
  const columns: ColumnType<any>[] = [
    {
      title: 'Price',
      dataIndex: 'newPrice',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Period Start',
      dataIndex: 'periodStart',
      render: (value) => stringToDateTime(value),
    },
    {
      title: 'Period End',
      dataIndex: 'periodEnd',
      render: (value) => stringToDateTime(value),
    },
    {
      title: 'Total Quantity Sold',
      dataIndex: 'totalQuantitySold',
      render: (value, _, index) => {
        const prevValue =
          index < productPriceHistory?.length - 1
            ? productPriceHistory[index + 1].totalQuantitySold
            : value

        const growthPercentage = calculateGrowthPercentage(value, prevValue)

        return (
          <div className='flex items-center gap-2'>
            <span>{value}</span>
            {index < productPriceHistory?.length - 1 && (
              <span
                className={`text-xs font-medium ${
                  growthPercentage > 0
                    ? 'text-green-500'
                    : growthPercentage < 0
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {growthPercentage > 0 ? '↑' : growthPercentage < 0 ? '↓' : ''}
                {Math.abs(growthPercentage).toFixed(1)}%
              </span>
            )}
          </div>
        )
      },
      width: 200,
    },
    {
      title: 'Total Revenue',
      dataIndex: 'totalRevenue',
      render: (value, _, index) => {
        const prevValue =
          index < productPriceHistory?.length - 1
            ? productPriceHistory[index + 1].totalRevenue
            : value

        const growthPercentage = calculateGrowthPercentage(value, prevValue)

        return (
          <div className='flex items-center gap-2'>
            <span>{formatCurrency(value)}</span>
            {index < productPriceHistory?.length - 1 && (
              <span
                className={`text-xs font-medium ${
                  growthPercentage > 0
                    ? 'text-green-500'
                    : growthPercentage < 0
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {growthPercentage > 0 ? '↑' : growthPercentage < 0 ? '↓' : ''}
                {Math.abs(growthPercentage).toFixed(1)}%
              </span>
            )}
          </div>
        )
      },
    },
    {
      title: 'Total Profit',
      dataIndex: 'totalProfit',
      render: (value, _, index) => {
        const prevValue =
          index < productPriceHistory?.length - 1
            ? productPriceHistory[index + 1].totalProfit
            : value

        const growthPercentage = calculateGrowthPercentage(value, prevValue)

        return (
          <div className='flex items-center gap-2'>
            <span>{formatCurrency(value)}</span>
            {index < productPriceHistory?.length - 1 && (
              <span
                className={`text-xs font-medium ${
                  growthPercentage > 0
                    ? 'text-green-500'
                    : growthPercentage < 0
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {growthPercentage > 0 ? '↑' : growthPercentage < 0 ? '↓' : ''}
                {Math.abs(growthPercentage).toFixed(1)}%
              </span>
            )}
          </div>
        )
      },
    },
    {
      title: 'Changed By',
      dataIndex: 'changedBy',
      render: (value) => <span className='text-green-500'>{value}</span>,
      width: 150,
    },
  ]

  return (
    <Table
      key='product-price-history'
      rowKey='id'
      dataSource={productPriceHistory}
      columns={columns}
      pagination={false}
      scroll={{ y: 500, x: 1000 }}
      loading={isLoadingProductPriceHistory || isFetchingProductPriceHistory}
    />
  )
}

const ProductInfo = ({
  product,
  refetchProduct,
  refetchPriceHistory,
  isLoading,
  isFetching,
}: {
  product: any | null
  refetchProduct: () => void
  refetchPriceHistory: () => void
  isLoading: boolean
  isFetching: boolean
}) => {
  const [openModalChangePrice, setOpenModalChangePrice] = useState(false)
  return (
    <div className='grid grid-cols-3 gap-2 mt-4 mb-4'>
      {isLoading || isFetching ? (
        <div className='flex items-center justify-center h-full min-h-48'>
          <Loading size='loading-md' />
        </div>
      ) : (
        <>
          <div className='flex flex-col items-center justify-center border border-gray-200 rounded-lg p-4 gap-2'>
            <img
              src={product.mainImage}
              alt=''
              className='h-24 w-24 object-contain'
            />
            <p className='text-lg font-bold text-center'>{product.name}</p>
          </div>
          <div className='flex flex-col col-span-2 items-start gap-2 border border-gray-200 rounded-lg p-4'>
            <div className='flex flex-row items-center justify-start gap-2'>
              <p className='font-semibold'>Barcode:</p>
              <p className=' text-gray-500'>{product.barcode}</p>
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <p className='font-semibold'>Brand:</p>
              <p className=' text-gray-500'>{product.brand?.name}</p>
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <p className='font-semibold'>Type:</p>
              <p className=' text-gray-500'>{product.subCategory?.name}</p>
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <p className='font-semibold'>Standard Price:</p>
              <p className=' text-gray-500'>
                {formatCurrency(product.standardPrice || 0)}
                <button
                  className=' text-primary hover:underline ml-2'
                  onClick={() => setOpenModalChangePrice(true)}
                >
                  <EditOutlined />
                </button>
              </p>
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <p className='font-semibold'>Stock:</p>
              <p className=' text-gray-500'>{product.totalQuantity}</p>
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <p className='font-semibold'>Max discount:</p>
              <p className=' text-gray-500'>{product.maxDiscount}%</p>
            </div>
            <div className='flex flex-row items-center justify-start gap-2'>
              <p className='font-semibold'>Rating:</p>
              <Rate value={product.rating || 0} disabled />
            </div>
          </div>
          <ModalChangePrice
            productId={product.id}
            averagePurchasePrice={product.averagePurchasePrice || 0}
            standardPrice={product.standardPrice || 0}
            open={openModalChangePrice}
            onClose={() => setOpenModalChangePrice(false)}
            refetch={() => {
              refetchProduct()
              refetchPriceHistory()
            }}
          />
        </>
      )}
    </div>
  )
}

const ModalChangePrice = ({
  productId,
  averagePurchasePrice,
  standardPrice,
  open,
  onClose,
  refetch,
}: {
  productId: number
  averagePurchasePrice: number
  standardPrice: number
  open: boolean
  onClose: () => void
  refetch: () => void
}) => {
  const [form] = Form.useForm()
  const [newPrice, setNewPrice] = useState(standardPrice)
  const [updateProductPrice, { isLoading }] = useUpdateProductPriceMutation()

  // Calculate profit percentage
  const profitPercentage =
    ((newPrice - averagePurchasePrice) / averagePurchasePrice) * 100

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      await updateProductPrice({
        id: productId,
        standardPrice: newPrice,
      }).unwrap()
      onClose()
      refetch()
      showToast.success('Product price updated successfully')
    } catch (error: any) {
      showToast.error(error?.data?.message || 'Failed to update price')
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      newPrice: standardPrice,
    })
    setNewPrice(standardPrice)
  }, [standardPrice])

  return (
    <Modal open={open} onCancel={onClose} title='Change Price' footer={null}>
      <Form form={form} layout='vertical'>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Current Price</p>
              <p className='text-lg font-semibold'>
                {formatCurrency(standardPrice)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Average Purchase Price</p>
              <p className='text-lg font-semibold'>
                {formatCurrency(averagePurchasePrice)}
              </p>
            </div>
          </div>

          <Form.Item
            name='newPrice'
            label='New Price'
            rules={[
              { required: true, message: 'Please enter new price' },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject('Price must be greater than 0')
                  }
                  if (value == standardPrice) {
                    return Promise.reject(
                      'Price change cannot be the same as current price'
                    )
                  }
                  if (value < averagePurchasePrice) {
                    return Promise.reject(
                      'Price cannot be lower than average purchase price'
                    )
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input
              type='number'
              step='0.01'
              min={0}
              onChange={(e) => setNewPrice(parseFloat(e.target.value))}
              prefix='$'
              className='w-full'
            />
          </Form.Item>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <h4 className='font-medium mb-2'>Profit Analysis</h4>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Cost Price:</span>
                <span>{formatCurrency(averagePurchasePrice)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Selling Price:</span>
                <span>{formatCurrency(newPrice || 0)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Profit per Unit:</span>
                <span className='font-medium text-green-600'>
                  {formatCurrency((newPrice || 0) - averagePurchasePrice)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Profit Margin:</span>
                <span
                  className={`font-medium ${
                    profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {profitPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Form>
      <div className='flex justify-end mt-4 gap-2'>
        <button
          className='btn btn-sm btn-outline btn-error min-w-24'
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className='btn btn-primary btn-sm text-white min-w-32'
          onClick={handleSubmit}
        >
          {isLoading ? (
            <Loading size='loading-sm' color='text-white' />
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </Modal>
  )
}

export { AdminSaleAnalytics }
