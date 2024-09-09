import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { SubCategory, ApiResponse } from '@/types'

const baseUrl = import.meta.env.VITE_API_URL

export const subCategoryApi = createApi({
  reducerPath: 'subCategoryApi',
  
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/sub-categories`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getAllSubCategory: builder.query<ApiResponse<SubCategory[]>, void>({
      query: () => '/',
    }),
  }),
})

export const { useGetAllSubCategoryQuery } = subCategoryApi
