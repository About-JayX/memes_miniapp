import { mainRequest } from '@/util/request'

export const sgininAPI = async () => mainRequest.post('v2/sginin/sginin')

export const sgininDetailAPI = async () =>
  mainRequest.post('v2/sginin/signInfo')

export const claimReward = async (data: { day: number; type: string }) =>
  mainRequest.post('v2/sginin/claimExtraReward', data)
