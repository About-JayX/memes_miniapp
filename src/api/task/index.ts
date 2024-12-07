import { Ilist } from '@/interface'
import { mainRequest } from '@/util/request'

import { Itasks } from './interface'

export const taskListAPI = async (data: Itasks) =>
  mainRequest.post('v2/tasks/list', data)

export const opearateTaskAPI = async (data: { detailId: number }) =>
  mainRequest.post('v2/tasks/opearate', data)

export const taskOptionsAPI = async (type: 'Twitter' | 'Telegram') =>
  mainRequest.post('v2/tasks/getOptions', { type })

export const taskAssessAPI = async (data: FormData) =>
  mainRequest.post('v2/tasks/assess', data)

export const releaseTaskAPI = async (iv: string) =>
  mainRequest.post('v2/tasks/release', { iv })

export const userTaskAPI = async (data: Ilist) =>
  mainRequest.post('v2/tasks/user-list', data)

export const delistAPI = async (taskId: number) =>
  mainRequest.post('v2/tasks/delisting', { taskId })

export const editTaskAPI = async (data: any) =>
  mainRequest.post('v2/tasks/edit', data)
