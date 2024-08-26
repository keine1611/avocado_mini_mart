import { Account, LoginResponse } from '@/types'
import { ApiResponse } from '@/types/ApiResponse'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/auth',
    credentials: 'include',
  }),
  tagTypes: ['authApi'],
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, Account>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
    refresh: builder.mutation<ApiResponse<LoginResponse>, void>({
      query: () => ({
        method: 'POST',
        url: '/refresh',
      }),
    }),
  }),
})

export const { useLoginMutation, useRefreshMutation } = authApi
