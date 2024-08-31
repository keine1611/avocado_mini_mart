import { createSlice } from '@reduxjs/toolkit'
import { LoginResponse } from '@/types'

export interface AuthState {
  user: LoginResponse | null
}

const initialState: AuthState = {
  user: null,
}

export const { actions: authActions, reducer: authReducer } = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload
    },
    clear: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
  },
})
