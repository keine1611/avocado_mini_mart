import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const paymentService = createApi({
  reducerPath: 'paymentService',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/payment',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    paypalCreateOrder: builder.mutation<any, any>({
      query: (data) => ({
        url: '/paypal/create-order',
        method: 'POST',
        body: data,
      }),
    }),
    paypalVerifyOrder: builder.mutation<any, any>({
      query: (data) => ({
        url: '/paypal/verify-order',
        method: 'POST',
        body: data,
      }),
    }),
    retryPayment: builder.mutation<any, string>({
      query: (orderCode) => ({
        url: `/paypal/retry-order/${orderCode}`,
        method: 'POST',
      }),
    }),
  }),
})

export const {
  usePaypalCreateOrderMutation,
  usePaypalVerifyOrderMutation,
  useRetryPaymentMutation,
} = paymentService
