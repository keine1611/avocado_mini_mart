import { createSlice } from '@reduxjs/toolkit'
import { Account } from '@/types'

export interface AuthState {
  user: Account | null
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
    setOrderInfos: (state, { payload }) => {
      if (state.user) {
        state.user.orderInfos = payload
      }
    },
    addOrderInfo: (state, { payload }) => {
      if (state.user) {
        const isExist = state.user.orderInfos.find(
          (info) => info.id === payload.id
        )
        if (!isExist) {
          state.user.orderInfos.push(payload)
        } else {
          state.user.orderInfos = state.user.orderInfos.map((info) =>
            info.id === payload.id ? payload : info
          )
        }
      }
    },
    deleteOrderInfo: (state, { payload }) => {
      if (state.user) {
        state.user.orderInfos = state.user.orderInfos.filter(
          (info) => info.id !== payload
        )
      }
    },
    updateOrderInfo: (state, { payload }) => {
      if (state.user) {
        state.user.orderInfos = state.user.orderInfos.map((info) =>
          info.id === payload.id ? payload : info
        )
      }
    },
    updateProfile: (state, { payload }) => {
      if (state.user) {
        state.user.profile = payload
      }
    },
    updateAvatar: (state, { payload }) => {
      if (state.user) {
        state.user.avatarUrl = payload
      }
    },
  },
})
