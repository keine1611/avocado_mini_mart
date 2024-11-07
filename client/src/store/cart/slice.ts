import { useSyncCart } from '@/hooks'
import { Cart, Product } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartState {
  cart: Cart[]
  isCartUpdated: boolean
}

const initialState: CartState = {
  cart: [],
  isCartUpdated: false,
}

export const { actions: cartActions, reducer: cartReducer } = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (
      state,
      {
        payload,
      }: PayloadAction<{
        productId: number
        quantity: number
        product: Product
      }>
    ) => {
      const existingCartItem = state.cart.find(
        (cart) => cart.productId === payload.productId
      )
      if (existingCartItem) {
        existingCartItem.quantity += payload.quantity
      } else {
        state.cart.push(payload)
      }
      state.isCartUpdated = true
    },
    removeCart: (state, { payload }: PayloadAction<{ productId: number }>) => {
      state.cart = state.cart.filter(
        (cart) => cart.productId !== payload.productId
      )
      state.isCartUpdated = true
    },
    minusCart: (state, { payload }: PayloadAction<{ productId: number }>) => {
      const existingCartItem = state.cart.find(
        (cart) => cart.productId === payload.productId
      )
      if (existingCartItem) {
        if (existingCartItem.quantity === 1) {
          state.cart = state.cart.filter(
            (cart) => cart.productId !== payload.productId
          )
        } else {
          existingCartItem.quantity -= 1
        }
      }
      state.isCartUpdated = true
    },
    plusCart: (state, { payload }: PayloadAction<{ productId: number }>) => {
      const existingCartItem = state.cart.find(
        (cart) => cart.productId === payload.productId
      )
      if (existingCartItem) {
        existingCartItem.quantity += 1
      } else {
        state.cart.push({
          productId: payload.productId,
          quantity: 1,
        })
      }
      state.isCartUpdated = true
    },
    clearCart: (state) => {
      state.cart = []
    },
    setCarts: (state, { payload }: PayloadAction<Cart[]>) => {
      state.cart = payload
    },
    setIsCartUpdated: (state, { payload }: PayloadAction<boolean>) => {
      state.isCartUpdated = payload
    },
  },
  extraReducers: (builder) => {},
})
