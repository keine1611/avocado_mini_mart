import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/dashboard',
    credentials: 'include',
  }),

  endpoints: (builder) => ({
    getDashboardData: builder.query<any, void>({
      query: () => '/',
    }),
  }),
})

export const { useGetDashboardDataQuery } = dashboardApi
