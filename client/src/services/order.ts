import { Order, ApiResponse } from '@/types'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/orders',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => '/',
    }),
    getOrderById: builder.query<ApiResponse<Order>, number>({
      query: (id) => `/${id}`,
    }),
    createOrder: builder.mutation<ApiResponse<Order>, Order>({
      query: (order) => ({
        url: '/',
        method: 'POST',
        body: order,
      }),
    }),
    updateOrder: builder.mutation<ApiResponse<Order>, Order>({
      query: (order) => ({
        url: `/${order.id}`,
        method: 'PUT',
        body: order,
      }),
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} = orderApi
