import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { SubCategory, ApiResponse } from '@/types'


const BASE_URL = import.meta.env.VITE_API_URL

export const subCategoryApi = createApi({
  reducerPath: 'subCategoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/sub-categories',
    credentials: 'include',
  }),
  tagTypes: ['subCategoryApi'],
  endpoints: (builder) => ({
    getAllSubCategory: builder.query<ApiResponse<SubCategory[]>, void>({
      query: () => '',
      providesTags: ['subCategoryApi'],
    }),
    createSubCategory: builder.mutation<ApiResponse<SubCategory>, Omit<SubCategory, 'id'>>({
      query: (subCategory) => ({
        url: '',
        method: 'POST',
        body: subCategory,
      }),
      invalidatesTags: ['subCategoryApi'],
    }),
    updateSubCategory: builder.mutation<ApiResponse<SubCategory>, SubCategory>({
      query: (subCategory) => ({
        url: `/${subCategory.id}`,
        method: 'PUT',
        body: subCategory,
      }),
      invalidatesTags: ['subCategoryApi'],
    }),
    deleteSubCategory: builder.mutation<ApiResponse<SubCategory>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['subCategoryApi'],
    }),
  }),
})

export const {
  useGetAllSubCategoryQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi
