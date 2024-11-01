import { Account, ApiResponse } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/accounts',
    credentials: 'include',
  }),
  tagTypes: ['accountApi'],
  endpoints: (builder) => ({
    getAllAccount: builder.query<ApiResponse<Account[]>, void>({
      query: () => '/',
      providesTags: (result) => {
        if (result?.data) {
          return [
            ...result.data.map(({ id }) => ({
              type: 'accountApi' as const,
              id,
            })),
            { type: 'accountApi' as const, id: 'LIST' },
          ]
        }
        return [{ type: 'accountApi' as const, id: 'LIST' }]
      },
    }),
    createAccount: builder.mutation<ApiResponse<Account>, FormData>({
      query: (account) => ({
        url: '',
        method: 'POST',
        body: account,
      }),
      invalidatesTags: [{ type: 'accountApi' as const, id: 'LIST' }],
    }),
    updateAccount: builder.mutation<
      ApiResponse<Account>,
      { id: number; account: FormData }
    >({
      query: ({ id, account }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: account,
      }),
      invalidatesTags: [{ type: 'accountApi' as const, id: 'LIST' }],
    }),
    deleteAccount: builder.mutation<ApiResponse<Account>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'accountApi' as const, id: 'LIST' }],
    }),
  }),
})

export const {
  useGetAllAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountApi
