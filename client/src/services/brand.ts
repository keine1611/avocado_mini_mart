import { Brand } from '@/types'
import { ApiResponse } from '@/types/ApiResponse'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const brandApi = createApi({
  reducerPath: 'brandApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/brands',
    credentials: 'include',
  }),
  tagTypes: ['brandApi'],
  endpoints: (builder) => ({
    getAllBrand: builder.query<ApiResponse<Brand[]>, void>({
      query: () => '',
    }),
  }),
})

export const { useGetAllBrandQuery } = brandApi
