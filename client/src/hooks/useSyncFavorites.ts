import { useSyncFavoritesMutation } from '@/services'
import { useAppSelector, useAppDispatch, favoriteActions } from '@/store'
import { useEffect } from 'react'
import { Favorite } from '@/types'
import {
  getLastFavoriteFromLocalStorage,
  setFavoriteToLocalStorage,
  setLastFavoriteFromLocalStorage,
} from '@/utils'
import { useLocation } from 'react-router-dom'

const areFavoritesEqual = (
  favorites: Favorite[],
  lastFavorites: Favorite[]
): boolean => {
  const favoriteProductIds = favorites
    .map((favorite) => favorite.productId)
    .sort()
  const lastFavoriteProductIds = lastFavorites
    .map((favorite) => favorite.productId)
    .sort()

  return (
    favoriteProductIds.length === lastFavoriteProductIds.length &&
    favoriteProductIds.every(
      (value, index) => value === lastFavoriteProductIds[index]
    )
  )
}

const useAutoSyncFavorites = () => {
  const location = useLocation()
  const [syncFavorites] = useSyncFavoritesMutation()
  const favorites = useAppSelector((state) => state.favorite.favorites)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!areFavoritesEqual(favorites, getLastFavoriteFromLocalStorage())) {
        const response = await syncFavorites(favorites)
        if (response.data) {
          setFavoriteToLocalStorage(response.data.data)
          dispatch(favoriteActions.setFavorites(response.data.data))
        }
      }
    }
    handleBeforeUnload()
  }, [dispatch, location.pathname])
}

const useSyncFavorites = () => {
  const [syncFavoritesMutation] = useSyncFavoritesMutation()
  const favorites = useAppSelector((state) => state.favorite.favorites)
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const syncFavorites = async () => {
    if (!user) return
    if (!areFavoritesEqual(favorites, getLastFavoriteFromLocalStorage())) {
      const response = await syncFavoritesMutation(favorites)
      if (response.data) {
        setFavoriteToLocalStorage(response.data.data)
        setLastFavoriteFromLocalStorage(response.data.data)
        dispatch(favoriteActions.setFavorites(response.data.data))
      }
    }
  }
  return { syncFavorites }
}

export { useAutoSyncFavorites, useSyncFavorites }
