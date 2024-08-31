import { configureStore } from '@reduxjs/toolkit'
import { reduxReducers } from './reduxReducers'
import { serviceReducer, serviceMiddleware } from '@/services'
import { setupListeners } from '@reduxjs/toolkit/query'


const rootReducer = {
  ...serviceReducer,
  ...reduxReducers,
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serviceMiddleware),
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
