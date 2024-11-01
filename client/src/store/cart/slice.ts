import { Cart, Product } from '@/types'
import {
  clearCartFromLocalStorage,
  getCartFromLocalStorage,
  setCartToLocalStorage,
} from '@/utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartState {
  cart: Cart[]
}

const initialState: CartState = {
  cart: getCartFromLocalStorage(),
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
      setCartToLocalStorage(state.cart)
    },
    removeCart: (state, { payload }: PayloadAction<{ productId: number }>) => {
      state.cart = state.cart.filter(
        (cart) => cart.productId !== payload.productId
      )
      setCartToLocalStorage(state.cart)
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
      setCartToLocalStorage(state.cart)
    },
    plusCart: (state, { payload }: PayloadAction<{ productId: number }>) => {
      const existingCartItem = state.cart.find(
        (cart) => cart.productId === payload.productId
      )
      if (existingCartItem) {
        existingCartItem.quantity += 1
      }
      setCartToLocalStorage(state.cart)
    },
    clearCart: (state) => {
      state.cart = []
      clearCartFromLocalStorage()
    },
    setCarts: (state, { payload }: PayloadAction<Cart[]>) => {
      state.cart = payload
    },
  },
})
