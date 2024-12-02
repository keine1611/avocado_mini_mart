import { Batch, BatchProduct } from '@/types'
import { ApiResponse } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const batchProductApi = createApi({
  reducerPath: 'batchProductApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/batch-products',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getBatchProducts: builder.query<ApiResponse<BatchProduct[]>, void>({
      query: () => '/',
    }),
    getBatchProductById: builder.query<ApiResponse<BatchProduct>, number>({
      query: (id) => `/${id}`,
    }),
    getAvailableBatches: builder.query<ApiResponse<BatchProduct[]>, number>({
      query: (productId) => `/available-batches?productId=${productId}`,
    }),
  }),
})

export const {
  useGetBatchProductsQuery,
  useGetBatchProductByIdQuery,
  useGetAvailableBatchesQuery,
} = batchProductApi
