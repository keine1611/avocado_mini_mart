import { Role, ApiResponse } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/roles',
    credentials: 'include',
  }),
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    getAllRole: builder.query<ApiResponse<Role[]>, void>({
      query: () => '/',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Role' as const, id })),
              'Role',
            ]
          : ['Role'],
    }),
    updateRole: builder.mutation<
      ApiResponse<Role>,
      { id: number; name: string; permissions: string[] }
    >({
      query: ({ id, name, permissions }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: { name, permissions },
      }),
      invalidatesTags: ['Role'],
    }),
  }),
})

export const { useGetAllRoleQuery, useUpdateRoleMutation } = roleApi
