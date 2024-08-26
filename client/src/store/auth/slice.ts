import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
