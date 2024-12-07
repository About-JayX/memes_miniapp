import { Ilist } from '@/interface'
import { mainRequest } from '@/util/request'

export const favoritesList = async (data: Ilist) =>
  mainRequest.post('/v2/favorites/favorites-list', data)

export const addFavorites = (data: { address: string }) =>
  mainRequest.post('/v2/favorites/add-favorites', data)

export const delFavorites = (data: { address: string }) =>
  mainRequest.post('/v2/favorites/del-favorites', data)

export const getFavorites = (data: Ilist) =>
  mainRequest.post('/v2/favorites/favorites-list', data)

export const isFavorites = (data: { address: string }) =>
  mainRequest.post('/v2/favorites/if-favorites', data)
