import { cartActions, useAppDispatch, useAppSelector } from '@/store'
import { useSyncCartMutation } from '@/services'
import { useEffect } from 'react'
import {
  getLastCartFromLocalStorage,
  setLastCartFromLocalStorage,
  setCartToLocalStorage,
} from '@/utils'
import { Cart } from '@/types'
import { useLocation } from 'react-router-dom'

const areCartsEqual = (cart1: Cart[], cart2: Cart[]): boolean => {
  if (cart1.length !== cart2.length) return false

  const cart1Map = new Map(cart1.map((item) => [item.productId, item.quantity]))
  const cart2Map = new Map(cart2.map((item) => [item.productId, item.quantity]))

  for (const [key, value] of cart1Map) {
    if (cart2Map.get(key) !== value) {
      return false
    }
  }

  for (const [key, value] of cart2Map) {
    if (cart1Map.get(key) !== value) {
      return false
    }
  }

  return true
}

const useAutoSyncCart = () => {
  const location = useLocation()
  const cart = useAppSelector((state) => state.cart.cart)
  const [syncCartMutation] = useSyncCartMutation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const lastCart: Cart[] = getLastCartFromLocalStorage()
      if (!areCartsEqual(cart, lastCart)) {
        const response = await syncCartMutation(cart).unwrap()
        setLastCartFromLocalStorage(response.data)
        setCartToLocalStorage(response.data)
        dispatch(cartActions.setCarts(response.data))
      }
    }
    handleBeforeUnload()
  }, [dispatch, location.pathname])
}

const useSyncCart = () => {
  const [syncCartMutation] = useSyncCartMutation()
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.cart.cart)
  const syncCart = async () => {
    if (!areCartsEqual(cart, getLastCartFromLocalStorage())) {
      const response = await syncCartMutation(cart).unwrap()
      setLastCartFromLocalStorage(response.data)
      setCartToLocalStorage(response.data)
      dispatch(cartActions.setCarts(response.data))
    }
  }
  return { syncCart }
}

export { useAutoSyncCart, useSyncCart }
