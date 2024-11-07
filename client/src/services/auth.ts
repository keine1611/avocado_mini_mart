import { Account, Cart, Favorite, LoginResponse, Order, Product } from '@/types'
import { ApiResponse } from '@/types/ApiResponse'
import { decodeBase64, encodeBase64 } from '@/utils'
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
    logout: builder.mutation<ApiResponse<Account>, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    syncFavorites: builder.mutation<ApiResponse<Favorite[]>, Favorite[]>({
      query: (body) => ({
        url: '/sync-favorites',
        method: 'POST',
        body,
      }),
    }),
    getUserFavoriteProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => ({
        url: '/user-favorites',
        method: 'GET',
      }),
    }),
    syncCart: builder.mutation<ApiResponse<Cart[]>, Cart[]>({
      query: (body) => ({
        url: '/sync-cart',
        method: 'POST',
        body,
      }),
    }),
    getUserCartProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => ({
        url: '/user-cart',
        method: 'GET',
      }),
    }),
    getListCartProductsByIds: builder.query<
      ApiResponse<Cart[]>,
      number[] | void
    >({
      query: (ids) => ({
        url: '/user-cart/products/product-ids',
        method: 'GET',
        params: { param: encodeBase64(JSON.stringify(ids)) },
      }),
    }),
    getUserOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => ({
        url: '/user-orders',
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRefreshMutation,
  useRegisterMutation,
  useVerifyAndCreateAccountMutation,
  useSyncFavoritesMutation,
  useGetUserFavoriteProductsQuery,
  useSyncCartMutation,
  useGetUserCartProductsQuery,
  useGetListCartProductsByIdsQuery,
  useGetUserOrdersQuery,
} = authApi
