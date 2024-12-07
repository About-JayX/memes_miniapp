import { mainRequest } from '@/util/request'

import { Iinvites } from './interface'

export const inviteListAPI = async (data: Iinvites) =>
  mainRequest.post('v2/telegram/invite-list', data)

