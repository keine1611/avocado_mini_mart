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
    getProductSalesDataByPeriod: builder.query<any, { period: string }>({
      query: ({ period }) => `/product-sales-data-by-period?period=${period}`,
    }),
    getChartProductAnalyticsDataByPeriod: builder.query<
      any,
      { period: string; productId: string }
    >({
      query: ({ period, productId }) =>
        `/chart-product-analytics-data-by-period/${productId}?period=${period}`,
    }),
    getProductPriceHistory: builder.query<any, { productId: number }>({
      query: ({ productId }) => `/product-price-history/${productId}`,
    }),
    getProductData: builder.query<any, { productId: number }>({
      query: ({ productId }) => `/product-data/${productId}`,
    }),
  }),
})

export const {
  useGetDashboardDataQuery,
  useGetEarningsComparisonByPeriodQuery,
  useGetTopProductSoldComparisonByPeriodQuery,
  useGetProfitComparisonByPeriodQuery,
  useGetProductSalesDataByPeriodQuery,
  useGetChartProductAnalyticsDataByPeriodQuery,
  useGetProductPriceHistoryQuery,
  useGetProductDataQuery,
} = dashboardApi
