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
    getEarningsComparisonByPeriod: builder.query<any, { period: string }>({
      query: ({ period }) => `/earnings-comparison-by-period?period=${period}`,
    }),
    getTopProductSoldComparisonByPeriod: builder.query<any, { period: string }>(
      {
        query: ({ period }) =>
          `/top-product-sold-comparison-by-period?period=${period}`,
      }
    ),
    getProfitComparisonByPeriod: builder.query<any, { period: string }>({
      query: ({ period }) => `/profit-comparison-by-period?period=${period}`,
    }),
  }),
})

export const {
  useGetDashboardDataQuery,
  useGetEarningsComparisonByPeriodQuery,
  useGetTopProductSoldComparisonByPeriodQuery,
  useGetProfitComparisonByPeriodQuery,
} = dashboardApi
