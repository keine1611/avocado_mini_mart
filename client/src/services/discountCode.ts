import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiResponse, DiscountCode } from '@/types'
const BASE_URL = import.meta.env.VITE_API_URL

export const discountCodeApi = createApi({
  reducerPath: 'discountCodeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/discount-codes',
    credentials: 'include',
  }),
  tagTypes: ['discountCodeApi'],
  endpoints: (builder) => ({
    getDiscountCodes: builder.query<ApiResponse<DiscountCode[]>, void>({
      query: () => '/',
      providesTags: ['discountCodeApi'],
    }),
    createDiscountCode: builder.mutation<
      ApiResponse<DiscountCode>,
      DiscountCode
    >({
      query: (discountCode) => ({
        url: '/',
        method: 'POST',
        body: discountCode,
      }),
      invalidatesTags: ['discountCodeApi'],
    }),
    updateDiscountCode: builder.mutation<
      ApiResponse<DiscountCode>,
      DiscountCode
    >({
      query: (discountCode) => ({
        url: `/${discountCode.id}`,
        method: 'PUT',
        body: discountCode,
      }),
      invalidatesTags: ['discountCodeApi'],
    }),
    deleteDiscountCode: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['discountCodeApi'],
    }),
    getDiscountCodeByCode: builder.query<ApiResponse<DiscountCode>, string>({
      query: (code) => `/${code}`,
    }),
  }),
})

export const {
  useGetDiscountCodesQuery,
  useCreateDiscountCodeMutation,
  useUpdateDiscountCodeMutation,
  useDeleteDiscountCodeMutation,
  useGetDiscountCodeByCodeQuery,
  useLazyGetDiscountCodeByCodeQuery,
} = discountCodeApi
