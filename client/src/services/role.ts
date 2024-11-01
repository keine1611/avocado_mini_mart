import { Role, ApiResponse } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/roles',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getAllRole: builder.query<ApiResponse<Role[]>, void>({
      query: () => '/',
    }),
  }),
})

export const { useGetAllRoleQuery } = roleApi
