import { ApiResponse, OrderItem, OrderItemBatch } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const orderItemBatchApi = createApi({
  reducerPath: 'orderItemBatchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/order-item-batches',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    updateOrderItemBatch: builder.mutation<
      ApiResponse<OrderItemBatch>,
      {
        orderItemId: number
        batchId: number
        quantity: number
      }
    >({
      query: ({ orderItemId, batchId, quantity }) => ({
        url: `/${orderItemId}`,
        method: 'PUT',
        body: { batchId, quantity },
      }),
    }),
  }),
})

export const { useUpdateOrderItemBatchMutation } = orderItemBatchApi
