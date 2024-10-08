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
    login: builder.mutation<
      ApiResponse<Account>,
      { email: string; password: string; rememberMe: boolean }
    >({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
    refresh: builder.mutation<ApiResponse<Account>, { rememberMe: boolean }>({
      query: (body) => ({
        method: 'POST',
        url: '/refresh',
        body,
      }),
    }),
    register: builder.mutation<
      { message: string; data: { email: string } },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),
    verifyAndCreateAccount: builder.mutation<
      { message: string; data: any },
      { email: string; verificationCode: string }
    >({
      query: (body) => ({
        url: '/verify',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRefreshMutation,
  useRegisterMutation,
  useVerifyAndCreateAccountMutation,
} = authApi
