import { Favorite } from '@/types'

const FAVORITE_KEY = 'favorite'
const LAST_FAVORITE_KEY = 'lastFavorite'

export const setFavoriteToLocalStorage = (favorites: Favorite[]) => {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites))
}

export const getFavoriteFromLocalStorage = () => {
  const favorite = localStorage.getItem(FAVORITE_KEY)
  return favorite ? JSON.parse(favorite) : []
}

export const clearFavoriteFromLocalStorage = () => {
  localStorage.removeItem(FAVORITE_KEY)
}

export const getLastFavoriteFromLocalStorage = () => {
  const favorite = localStorage.getItem(LAST_FAVORITE_KEY)
  return favorite ? JSON.parse(favorite) : []
}

export const setLastFavoriteFromLocalStorage = (favorites: Favorite[]) => {
  localStorage.setItem(LAST_FAVORITE_KEY, JSON.stringify(favorites))
}
