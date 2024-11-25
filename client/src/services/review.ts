import { ApiResponse, Review } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { orderApi } from '@/services'

const BASE_URL = import.meta.env.VITE_API_URL

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/reviews',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    createReview: builder.mutation<ApiResponse<Review>, FormData>({
      query: (formData) => ({
        url: '/',
        method: 'POST',
        body: formData,
      }),
      async onQueryStarted(data, { queryFulfilled, dispatch }) {
        await queryFulfilled
        dispatch(
          orderApi.util.invalidateTags([
            { type: 'orderApi', id: 'ORDERDETAIL' },
          ])
        )
      },
    }),
  }),
})

export const { useCreateReviewMutation } = reviewApi
