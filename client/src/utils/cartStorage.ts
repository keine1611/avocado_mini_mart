import { Cart } from '@/types'

const CART_KEY = 'cart'
const LAST_CART_KEY = 'lastCart'
const CHECKED_CART_KEY = 'checkedCart'

export const setCartToLocalStorage = (cart: Cart[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem(CART_KEY)
  return cart ? JSON.parse(cart) : []
}

export const clearCartFromLocalStorage = () => {
  localStorage.removeItem(CART_KEY)
}

export const getLastCartFromLocalStorage = () => {
  const lastCart = localStorage.getItem(LAST_CART_KEY)
  return lastCart ? JSON.parse(lastCart) : []
}

export const setLastCartFromLocalStorage = (cart: Cart[]) => {
  localStorage.setItem(LAST_CART_KEY, JSON.stringify(cart))
}

export const clearLastCartFromLocalStorage = () => {
  localStorage.removeItem(LAST_CART_KEY)
}

export const setCheckedCartFromLocalStorage = (cart: Cart[]) => {
  localStorage.setItem(CHECKED_CART_KEY, JSON.stringify(cart))
}

export const getCheckedCartFromLocalStorage = () => {
  const checkedCart = localStorage.getItem(CHECKED_CART_KEY)
  return checkedCart ? JSON.parse(checkedCart) : []
}

export const clearCheckedCartFromLocalStorage = () => {
  localStorage.removeItem(CHECKED_CART_KEY)
}
