import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { MainCategory, ApiResponse } from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL

export const mainCategoryApi = createApi({
  reducerPath: 'mainCategoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/main-categories',
    credentials: 'include',
  }),
  tagTypes: ['mainCategoryApi'],
  endpoints: (builder) => ({
    getAllMainCategory: builder.query<ApiResponse<MainCategory[]>, void>({
      query: () => '',
      providesTags: ['mainCategoryApi'],
    }),
    createMainCategory: builder.mutation<ApiResponse<MainCategory>, MainCategory>({
      query: (mainCategory) => ({
        url: '',
        method: 'POST',
        body: mainCategory,
      }),
      invalidatesTags: ['mainCategoryApi'],
    }),
    updateMainCategory: builder.mutation<ApiResponse<MainCategory>, MainCategory>({
      query: (mainCategory) => ({
        url: `/${mainCategory.id}`,
        method: 'PUT',
        body: mainCategory,
      }),
      invalidatesTags: ['mainCategoryApi'],
    }),
    deleteMainCategory: builder.mutation<ApiResponse<MainCategory>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['mainCategoryApi'],
    }),
  }),
})

export const {
  useGetAllMainCategoryQuery,
  useCreateMainCategoryMutation,
  useUpdateMainCategoryMutation,
  useDeleteMainCategoryMutation,
} = mainCategoryApi