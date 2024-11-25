import { configureStore } from '@reduxjs/toolkit'
import { reduxReducers } from './reduxReducers'
import { serviceReducer, serviceMiddleware } from '@/services'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { dashboardApi } from '@/services/dashboard'

const rootReducer = {
  ...serviceReducer,
  ...reduxReducers,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serviceMiddleware),
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

setupListeners(store.dispatch)

export * from './auth'
export * from './loading'
export * from './cart'
export * from './favorite'
