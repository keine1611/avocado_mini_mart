import { Product } from '@/types'
import { ApiResponse } from '@/types/ApiResponse'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { encodeBase64 } from '@/utils'

const BASE_URL = import.meta.env.VITE_API_URL


export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/products',
    credentials: 'include',
  }),
  tagTypes: ['productApi'],
  endpoints: (builder) => ({
    getAllProduct: builder.query<ApiResponse<Product[]>, {page: number, limit: number, name: string} | void>({
      query: (params) => {
        if (params) {
          const encodedParams = encodeBase64(JSON.stringify(params))
          return {
            url: '',
            method: 'GET',
            params: { param: encodedParams },
          }
        }
        return {
          url: '',
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'productApi' as const, id })),
              { type: 'productApi' as const, id: 'LIST' },
            ]
          : [{ type: 'productApi' as const, id: 'LIST' }],
    }),
    createProduct: builder.mutation<ApiResponse<Product>, FormData>({
      query: (product) => ({
        url: '',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'productApi', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<ApiResponse<Product>, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'productApi', id: 'LIST' }],
    }),
    deleteProduct: builder.mutation<ApiResponse<Product>, number>({
      query: (id: number) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['productApi'],
    }),
  }),
})

export const {
  useGetAllProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi