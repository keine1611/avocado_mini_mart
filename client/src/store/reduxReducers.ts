import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './auth'

export const reduxReducer = combineReducers({
  auth: authReducer,
})
