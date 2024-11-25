import { ORDER_STATUS } from '@/enum'
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
  tagTypes: ['orderApi'],
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => '/',
      providesTags(result) {
        if (result?.data) {
          return [
            ...result.data.map(({ id }) => ({ type: 'orderApi' as const, id })),
            { type: 'orderApi' as const, id: 'LIST' },
          ]
        }
        return [{ type: 'orderApi' as const, id: 'LIST' }]
      },
    }),
    getOrderByCode: builder.query<ApiResponse<Order>, string>({
      query: (orderCode) => `/${orderCode}`,
      providesTags(result, error, orderCode) {
        return [{ type: 'orderApi', id: 'ORDERDETAIL' }]
      },
    }),
    createOrder: builder.mutation<ApiResponse<Order>, Order>({
      query: (order) => ({
        url: '/',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: [{ type: 'orderApi' as const, id: 'LIST' }],
    }),
    updateOrder: builder.mutation<ApiResponse<Order>, Order>({
      query: (order) => ({
        url: `/${order.id}`,
        method: 'PUT',
        body: order,
      }),
      invalidatesTags: [{ type: 'orderApi' as const, id: 'LIST' }],
    }),
    updateOrderStatus: builder.mutation<
      ApiResponse<Order>,
      { orderCode: string; orderStatus: ORDER_STATUS }
    >({
      query: ({ orderCode, orderStatus }) => ({
        url: `/update-status/${orderCode}`,
        method: 'PUT',
        body: { orderStatus },
      }),
      invalidatesTags: [{ type: 'orderApi' as const, id: 'LIST' }],
    }),
    userCreateOrder: builder.mutation<ApiResponse<any>, any>({
      query: (order) => ({
        url: '/user-create-order',
        method: 'POST',
        body: order,
      }),
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderByCodeQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useUserCreateOrderMutation,
} = orderApi
