import { Brand } from '@/types'
import { ApiResponse } from '@/types/ApiResponse'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { encodeBase64 } from '@/utils'

const BASE_URL = import.meta.env.VITE_API_URL

export const brandApi = createApi({
  reducerPath: 'brandApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/brands',
    credentials: 'include',
  }),
  tagTypes: ['brandApi'],
  endpoints: (builder) => ({
    getAllBrand: builder.query<
      ApiResponse<Brand[]>,
      { page: number; limit: number; name: string } | void
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
      providesTags(result) {
        if (result?.data) {
          return [
            ...result.data.map(({ id }) => ({ type: 'brandApi' as const, id })),
            { type: 'brandApi' as const, id: 'LIST' },
          ]
        }
        return [{ type: 'brandApi' as const, id: 'LIST' }]
      },
    }),
    createBrand: builder.mutation<ApiResponse<Brand>, FormData>({
      query: (brand) => ({
        url: '',
        method: 'POST',
        body: brand,
      }),
      invalidatesTags: ['brandApi'],
    }),
    updateBrand: builder.mutation<
      ApiResponse<Brand>,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['brandApi'],
    }),
    deleteBrand: builder.mutation<ApiResponse<Brand>, number>({
      query: (id: number) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['brandApi'],
    }),
  }),
})

export const {
  useGetAllBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi
