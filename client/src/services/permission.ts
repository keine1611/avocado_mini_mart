import { Permission } from '@/types'
import { ApiResponse } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const permissionApi = createApi({
  reducerPath: 'permissionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/permissions',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getAllPermission: builder.query<ApiResponse<Permission[]>, void>({
      query: () => '/',
    }),
  }),
})

export const { useGetAllPermissionQuery } = permissionApi
