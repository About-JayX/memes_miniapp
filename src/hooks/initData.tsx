/* eslint-disable react-hooks/rules-of-hooks */
import eruda from 'eruda'
import { useEffect, useRef } from 'react'

import api from '@/api'
import { useTelegram } from '@/providers/telegram'
import { useAppDispatch, useAppSelector } from '@/store'
import { Iuser } from '@/store/interface'
import {
  asyncDetailsList,
  asyncFavoritesList,
  asyncGetInviteList,
  asyncGetTaskList,
  asyncGetTokenList,
  asyncNotifyList,
  asyncRankList,
  asyncUserTaskList,
} from '@/store/list'
import { asyncGetSginin, asyncUpdateUser, updateLoad } from '@/store/telegram'
import { asyncUploadTgs } from '@/store/tgs'

export const initDataHook = (loadData = false) => {
  const dispatch = useAppDispatch()
  const { postData } = useTelegram()
  const { load } = useAppSelector(state => state.telegram)
  const initLock = useRef(false)
  const init = async () => {
    if (initLock.current && !loadData) return

    initLock.current = true
    if (!(typeof postData === 'object' && Object.keys(postData).length)) return
    const env = import.meta.env.MODE.split('-')[0]
    env === 'dev' && eruda.init()
    dispatch(asyncUploadTgs())
    const loginResult = await api.user.loginAPI(postData)
    const user: Iuser = {
      authToken: loginResult.authToken,
      newUser: loginResult.newUser,
      ...loginResult.data,
    }

    sessionStorage.setItem('token', user.authToken)

    const dispatchs = [
      dispatch(asyncGetSginin()),
      dispatch(asyncGetTokenList({})),
      dispatch(asyncUpdateUser(user)),
      dispatch(asyncGetTaskList({ page: 1 })),
      dispatch(asyncGetInviteList({ page: 1 })),
      dispatch(asyncRankList({ page: 1 })),
      dispatch(asyncDetailsList({ page: 1 })),
      dispatch(asyncFavoritesList({})),
      dispatch(asyncUserTaskList({})),
      dispatch(asyncNotifyList()),
    ]
    await Promise.all(dispatchs)

    dispatch(updateLoad({ ...load, initLoading: false }))

    if (!Number(user.token)) {
      setTimeout(async () => {
        const result = await api.user.getUser()
        await dispatch(asyncUpdateUser({ ...user, ...result }))
      }, 5000)
    }
  }

  useEffect(() => {
    init()
  }, [postData])
}
