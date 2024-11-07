import { cartActions, useAppDispatch, useAppSelector } from '@/store'
import { useEffect, useLayoutEffect } from 'react'
import { Cart } from '@/types'
import { socket } from '@/socket'

const useAutoSyncCart = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const cart = useAppSelector((state) => state.cart.cart)

  useEffect(() => {
    socket.on('cartUpdated', (data) => {
      dispatch(cartActions.setCarts(data))
    })
    return () => {
      socket.off('cartUpdated')
    }
  }, [dispatch, user])
}

const useSyncCart = () => {
  const user = useAppSelector((state) => state.auth.user)
  const cart = useAppSelector((state) => state.cart.cart)
  const isCartUpdated = useAppSelector((state) => state.cart.isCartUpdated)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (isCartUpdated) {
      socket.emit('syncCart', cart)
      dispatch(cartActions.setIsCartUpdated(false))
    }
  }, [dispatch, isCartUpdated])
}

export { useSyncCart, useAutoSyncCart }
