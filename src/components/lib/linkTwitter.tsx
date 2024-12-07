import { postEvent } from '@telegram-apps/sdk-react'
import { Button, Grid } from 'antd-mobile'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/api'
import { useAppDispatch, useAppSelector } from '@/store'
import { asyncUpdateUser } from '@/store/telegram'

import Icon from '../icon'
import Popup from '../popup'
import Toast from '../toast'

export default function LinkTwitter({
  open = false,
  onClose,
}: {
  open?: boolean
  onClose?: () => void
}) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.telegram)
  const { tgs } = useAppSelector(state => state.tgs)
  const pollData = async () => {
    const pollingInterval = 10000 // 每10秒轮询一次
    const stopAfter = 60000 // 1分钟后停止轮询
    const fetchData = async () => {
      try {
        const timeOut = setTimeout(() => {
          clearInterval(intervalId)
          setLoad(false)
          Toast({
            tgs,
            type: 'error',
            content: t('message.auth.error', { name: 'Twitter' }),
          })
        }, stopAfter)
        // 替换为你的接口请求
        const result = await api.user.getUser()

        // 如果接口返回 true，停止轮询
        if (result.twitterUserName !== null) {
          dispatch(asyncUpdateUser({ ...user, ...result }))
          clearInterval(intervalId) // 停止轮询
          clearTimeout(timeOut)
          setLoad(false)
          onClose && onClose()
          Toast({
            tgs,
            type: 'success',
            content: t('message.auth.success', { name: 'Twitter' }),
          })
        }
      } catch (error) {
        Toast({
          tgs,
          type: 'error',
          content: t('message.auth.error', { name: 'Twitter' }),
        })
      }
    }

    const intervalId = setInterval(fetchData, pollingInterval)
  }

  const [load, setLoad] = useState<boolean>(false)
  const { t } = useTranslation()
  return (
    <Popup
      visible={open}
      onClose={onClose}
      footer={
        <Button
          color="primary"
          className="w-full"
          loading={load}
          onClick={async () => {
            setLoad(true)
            const result: any = await api.user.authTwitter()
            postEvent('web_app_open_link', {
              url: result.data,
            })
            pollData()
          }}
        >
          {t('public.link')}
        </Button>
      }
    >
      <Grid columns={1} gap={18} className="justify-items-center text-center">
        <Grid.Item>
          <Icon name="twitter" className="!w-10 !h-10" />
        </Grid.Item>
        <Grid.Item>
          <Grid columns={1} gap={9}>
            <Grid.Item className="text-2xl font-bold">
              {t('public.pleaseLinkFirstX')}
            </Grid.Item>
            <Grid.Item className="text-base font-normal">
              {t('public.pleaseLinkFirstXText')}
            </Grid.Item>
          </Grid>
        </Grid.Item>
      </Grid>
    </Popup>
  )
}
