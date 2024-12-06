import { BatchProduct, Product } from '@/types'
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
    getAllProduct: builder.query<
      {
        message: string
        data: {
          data: Product[]
          totalItems: number
          totalPages: number
          currentPage: number
        }
      },
      {
        page?: number
        size?: number
        search?: string
        maxprice?: number
        minprice?: number
        maincategory?: string
        subcategory?: string
        order?: string
        sort?: string
      } | void
    >({
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
    }),
    createProduct: builder.mutation<ApiResponse<Product>, FormData>({
      query: (product) => ({
        url: '',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'productApi', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: number; data: FormData }
    >({
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
    getProductDetail: builder.query<ApiResponse<Product>, string>({
      query: (slug: string) => ({
        url: `/${slug}`,
        method: 'GET',
      }),
    }),
    getListProductByIds: builder.query<ApiResponse<Product[]>, number[] | void>(
      {
        query: (ids) => ({
          url: `/ids`,
          method: 'GET',
          params: { ids: JSON.stringify(ids) },
        }),
      }
    ),
    getAllProductWithoutPagination: builder.query<ApiResponse<Product[]>, void>(
      {
        query: () => ({
          url: '/all',
          method: 'GET',
        }),
        providesTags: [{ type: 'productApi', id: 'LIST' }],
      }
    ),
    getBatchProduct: builder.query<
      ApiResponse<{
        product: Product & { stock: number; expectedStock: number }
        batchProduct: BatchProduct[]
      }>,
      number
    >({
      query: (id: number) => ({
        url: `/${id}/batch-product`,
        method: 'GET',
      }),
    }),
    getLowStockProduct: builder.query<ApiResponse<Product[]>, void>({
      query: () => ({
        url: '/low-stock',
        method: 'GET',
      }),
    }),
    getProductLowStock: builder.query<
      ApiResponse<Product & { stock: number }[]>,
      void
    >({
      query: () => ({
        url: '/low-stock',
        method: 'GET',
      }),
    }),
    getNearlyExpiredProduct: builder.query<
      ApiResponse<Product & { batchProduct: BatchProduct[] }[]>,
      { days: number }
    >({
      query: ({ days }) => {
        if (days) {
          const param = encodeBase64(JSON.stringify({ days }))
          return {
            url: '/nearly-expired',
            method: 'GET',
            params: { param },
          }
        }
        return {
          url: '/nearly-expired',
          method: 'GET',
        }
      },
    }),
    getExpiredProduct: builder.query<
      ApiResponse<Product & { batchProduct: BatchProduct[] }[]>,
      { days: number }
    >({
      query: ({ days }) => {
        if (days) {
          const param = encodeBase64(JSON.stringify({ days }))
          return {
            url: '/expired',
            method: 'GET',
            params: { param },
          }
        }
        return {
          url: '/expired',
          method: 'GET',
        }
      },
    }),
    getHomeData: builder.query<any, void>({
      query: () => ({
        url: '/home-data',
        method: 'GET',
      }),
    }),
    updateProductPrice: builder.mutation<
      ApiResponse<Product>,
      { id: number; standardPrice: number }
    >({
      query: ({ id, standardPrice }) => ({
        url: `/${id}/price`,
        method: 'PUT',
        body: { standardPrice },
      }),
    }),
  }),
})

export const {
  useGetAllProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductDetailQuery,
  useGetAllProductWithoutPaginationQuery,
  useLazyGetBatchProductQuery,
  useLazyGetProductLowStockQuery,
  useLazyGetNearlyExpiredProductQuery,
  useLazyGetExpiredProductQuery,
  useGetListProductByIdsQuery,
  useGetHomeDataQuery,
  useUpdateProductPriceMutation,
} = productApi
