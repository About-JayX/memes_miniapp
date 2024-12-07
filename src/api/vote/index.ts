import { mainRequest } from '@/util/request'

export const userPointRank = (data: { address: string }) =>
  mainRequest.post('/v2/vote/voted', data)
