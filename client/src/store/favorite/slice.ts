import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Favorite } from '@/types'
import {
  getFavoriteFromLocalStorage,
  setFavoriteToLocalStorage,
  clearFavoriteFromLocalStorage,
} from '@/utils'

export interface FavoriteState {
  favorites: Favorite[]
}

const initialState: FavoriteState = {
  favorites: getFavoriteFromLocalStorage(),
}

export const { actions: favoriteActions, reducer: favoriteReducer } =
  createSlice({
    name: 'favorite',
    initialState,
    reducers: {
      addFavorite: (
        state,
        { payload }: PayloadAction<{ productId: number }>
      ) => {
        const existingFavorite = state.favorites.find(
          (favorite) => favorite.productId === payload.productId
        )
        if (existingFavorite) {
          return
        } else {
          state.favorites.push({ productId: payload.productId })
          setFavoriteToLocalStorage(state.favorites)
        }
      },
      removeFavorite: (state, { payload }: PayloadAction<number>) => {
        state.favorites = state.favorites.filter(
          (favorite) => favorite.productId !== payload
        )
        setFavoriteToLocalStorage(state.favorites)
      },
      clearFavorite: (state) => {
        state.favorites = []
        clearFavoriteFromLocalStorage()
      },
      setFavorites: (state, { payload }: PayloadAction<Favorite[]>) => {
        state.favorites = payload
      },
    },
  })
