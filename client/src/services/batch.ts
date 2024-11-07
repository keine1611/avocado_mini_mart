import { ApiResponse } from '@/types'
import { Batch } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const batchApi = createApi({
  reducerPath: 'batchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/batches',
    credentials: 'include',
  }),
  tagTypes: ['batchApi'],
  endpoints: (builder) => ({
    getAllBatch: builder.query<ApiResponse<Batch[]>, void>({
      query: () => '/',
      providesTags: (result) => {
        if (result?.data) {
          return [
            ...result.data.map(({ id }) => ({ type: 'batchApi' as const, id })),
            { type: 'batchApi' as const, id: 'LIST' },
          ]
        }
        return ['batchApi']
      },
    }),
    createBatch: builder.mutation<
      ApiResponse<Batch>,
      Pick<Batch, 'arrivalDate'>
    >({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['batchApi'],
    }),
    updateBatch: builder.mutation<
      ApiResponse<Batch>,
      Pick<Batch, 'status' | 'id' | 'expirationDate' | 'arrivalDate'>
    >({
      query: (body) => ({
        url: `/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['batchApi'],
    }),
    deleteBatch: builder.mutation<ApiResponse<Batch>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['batchApi'],
    }),
  }),
})

export const {
  useGetAllBatchQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
} = batchApi
