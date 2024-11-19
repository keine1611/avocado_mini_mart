import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiResponse, Discount } from '@/types'
const BASE_URL = import.meta.env.VITE_API_URL

export const discountApi = createApi({
  reducerPath: 'discountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/discounts',
    credentials: 'include',
  }),
  tagTypes: ['discountApi'],
  endpoints: (builder) => ({
    getDiscounts: builder.query<ApiResponse<Discount[]>, void>({
      query: () => '/',
      providesTags: (result) => {
        if (result?.data) {
          return [
            ...result.data.map(({ id }) => ({
              type: 'discountApi' as const,
              id,
            })),
            { type: 'discountApi' as const, id: 'LIST' },
          ]
        }
        return [{ type: 'discountApi' as const, id: 'LIST' }]
      },
    }),
    createDiscount: builder.mutation<
      ApiResponse<Discount>,
      Omit<Discount, 'id'>
    >({
      query: (discount) => ({
        url: '/',
        method: 'POST',
        body: discount,
      }),
      invalidatesTags: ['discountApi'],
    }),
    updateDiscount: builder.mutation<
      ApiResponse<Discount>,
      { id: number; discount: Discount }
    >({
      query: ({ id, discount }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: discount,
      }),
      invalidatesTags: ['discountApi'],
    }),
    deleteDiscount: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['discountApi'],
    }),
  }),
})

export const {
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountApi
