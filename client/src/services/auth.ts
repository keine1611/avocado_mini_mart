import { Account, Cart, Favorite, Order, OrderInfo, Product } from '@/types'
import { ApiResponse } from '@/types/ApiResponse'
import { encodeBase64 } from '@/utils'
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
    addOrderInfo: builder.mutation<ApiResponse<OrderInfo>, OrderInfo>({
      query: (body) => ({
        url: '/add-order-info',
        method: 'POST',
        body,
      }),
    }),
    updateOrderInfo: builder.mutation<ApiResponse<OrderInfo>, OrderInfo>({
      query: (body) => ({
        url: `/update-order-info/${body.id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteOrderInfo: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/delete-order-info/${id}`,
        method: 'DELETE',
      }),
    }),
    updateProfile: builder.mutation<ApiResponse<Account>, FormData>({
      query: (body) => ({
        url: '/update-profile',
        method: 'PUT',
        body,
      }),
    }),
    changePassword: builder.mutation<
      ApiResponse<void>,
      { verificationCode: string }
    >({
      query: (body) => ({
        url: '/change-password',
        method: 'POST',
        body,
      }),
    }),
    changePasswordRequest: builder.mutation<
      ApiResponse<void>,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/change-password-request',
        method: 'POST',
        body,
      }),
    }),
    resendChangePasswordCode: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/resend-change-password-code',
        method: 'POST',
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: '/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    verifyResetCode: builder.mutation({
      query: (body) => ({
        url: '/verify-reset-code',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/reset-password',
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
  useSyncFavoritesMutation,
  useGetUserFavoriteProductsQuery,
  useSyncCartMutation,
  useGetUserCartProductsQuery,
  useGetListCartProductsByIdsQuery,
  useGetUserOrdersQuery,
  useAddOrderInfoMutation,
  useUpdateOrderInfoMutation,
  useDeleteOrderInfoMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useChangePasswordRequestMutation,
  useResendChangePasswordCodeMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} = authApi
