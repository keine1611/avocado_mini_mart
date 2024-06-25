import { createSlice } from '@reduxjs/toolkit'

export const { actions: authActions, reducer: authReducer } = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
  },
})
