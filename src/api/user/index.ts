import { Ilist } from '@/interface'
import { mainRequest } from '@/util/request'

import { Ilogin } from './interface'

export const loginAPI = async (data: Ilogin) =>
  mainRequest.post('/v2/telegram/login', data)

export const authTwitter = async () => mainRequest.get('/twitter/auth')

export const getUser = () => mainRequest.post('/v2/telegram/current-user')

export const userPointDetail = (data: Ilist) =>
  mainRequest.post('/v2/telegram/UserPoints-Details', data)

export const userPointRank = (data: Ilist) =>
  mainRequest.post('/v2/telegram/UserPoints-Rank', data)

export const notifysAPI = () =>
  mainRequest.post('v2/notify/user-list', { page: 1, pageSize: 30 })
