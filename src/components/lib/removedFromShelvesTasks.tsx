import { Button, Card, Divider, Grid } from 'antd-mobile'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/api'
import { symbol } from '@/config'
import { useAppDispatch, useAppSelector } from '@/store'
import { ItaskData } from '@/store/interface'
import {
  asyncDetailsList,
  asyncGetTaskList,
  asyncUserTaskList,
} from '@/store/list'
import { asyncUpdateUser } from '@/store/telegram'
import { semicolon } from '@/util'

import Icon from '../icon'
import Popup from '../popup'
import Toast from '../toast'

export default function RemovedFromShelvesTasks({
  data = {
    Id: 0,
    name: '',
    userId: 0,
    onwer: '',
    description: '',
    is_enabled: 0,
    created_at: 0,
    updated_at: 0,
    rewards: '',
    pay_amount: '',
    remaining_amount: '',
    models: [],
    urls: {
      TweetId: '',
    },
    notifyId: 0,
    profile_image_url: '',
    is_hot: 0,
    is_top: 0,
  },
  open,
  onClose,
}: {
  data: ItaskData
  open?: boolean
  onClose?: () => void
}) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const { userTask } = useAppSelector(state => state.list)
  const { tgs } = useAppSelector(state => state.tgs)
  const { user } = useAppSelector(state => state.telegram)
  const delist = async () => {
    setLoading(true)

    try {
      await api.task.delistAPI(data.Id)
      const asyncs = [
        dispatch(
          asyncUserTaskList({
            page: 1,
            pageSize:
              (userTask.page - 1 ? userTask.page - 1 : 1) * userTask.pageSize,
          })
        ),
        dispatch(asyncDetailsList({ page: 1 })),
        dispatch(asyncGetTaskList({ page: 1 })),
      ]
      await Promise.all(asyncs)

      const result = await api.user.getUser()
      await dispatch(asyncUpdateUser({ ...user, ...result }))
      Toast({
        tgs,
        type: 'success',
        content: t('message.remove.success'),
      })
      onClose && onClose()
    } catch (error) {
      console.log(error, 'error_')
      Toast({
        tgs,
        type: 'error',
        content: t('message.remove.error'),
      })
    }
    setLoading(false)
  }
  return (
    <Popup
      visible={open}
      onClose={onClose}
      footer={
        <Grid columns={1} gap={27}>
          <Grid.Item className="text-base text-center">
            <span className="font-medium text-[#F0F0F2]">
              {t('public.remaining')} :{' '}
            </span>
            <span className="font-bold">
              {semicolon(
                Number(data.pay_amount) - Number(data.remaining_amount)
              )}{' '}
              ${symbol}
            </span>
          </Grid.Item>

          <Grid.Item className="flex gap-[10px] items-center">
            <Button
              size="large"
              color="default"
              className="w-full"
              onClick={() => onClose && onClose()}
            >
              {t('public.cancel')}
            </Button>
            <Button
              size="large"
              color="primary"
              className="w-full"
              loading={loading}
              onClick={delist}
            >
              {t('public.remove')}
            </Button>
          </Grid.Item>
        </Grid>
      }
    >
      <Grid columns={1} gap={26}>
        <Grid.Item className="w-full">
          <Grid
            columns={1}
            gap={27}
            className="grid justify-items-center text-center"
          >
            <Grid.Item>
              <Icon name="task/twitter" className="!w-14 !h-14 rounded-lg" />
            </Grid.Item>
            <Grid.Item>
              <Grid columns={1} gap={8}>
                <Grid.Item className="text-2xl font-bold">
                  {t('task.taskManagement.title')}
                </Grid.Item>
                <Grid.Item className="text-base font-normal">
                  {t('task.taskManagement.text')}
                </Grid.Item>
              </Grid>
            </Grid.Item>
          </Grid>
        </Grid.Item>

        <Grid.Item>
          <Card className="!bg-[--primary-card-body-color]">
            <Grid columns={1} gap={12}>
              <Grid.Item className="text-base font-bold">
                <Icon name="tweet" className="!w-5 !h-5 mr-3" />
                {t('public.tweetLink')}
              </Grid.Item>
              <Grid.Item>
                <Divider />
              </Grid.Item>
              <Grid.Item className="text-sm font-normal break-words text-[#F0F0F2]">
                {data.urls.TweetId}
              </Grid.Item>
            </Grid>
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Card className="!bg-[--primary-card-body-color]">
            <Grid columns={1} gap={12}>
              <Grid.Item className="text-base font-bold">
                <Icon name="introduction" className="!w-5 !h-5 mr-3" />
                {t('public.missionIntroduction')}
              </Grid.Item>
              <Grid.Item>
                <Divider />
              </Grid.Item>
              <Grid.Item className="text-sm font-normal break-words text-[#F0F0F2]">
                {data.description}
              </Grid.Item>
            </Grid>
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Card className="!bg-[--primary-card-body-color] !py-5">
            <Grid columns={1} gap={26}>
              <Grid.Item className="text-base font-bold">
                <Icon name="list" className="!w-5 !h-5 mr-3" />
                {t('public.checklist')}
              </Grid.Item>
              <Grid.Item>
                <Divider />
              </Grid.Item>
              <Grid.Item>
                <Grid columns={1} gap={26}>
                  {data.models.map(item => (
                    <Grid.Item className="flex items-center gap-2 justify-between text-xs font-normal">
                      <span className="text-[#8C91A2]">
                        {t(`public.${item.model}`)}
                      </span>
                      <span>
                        {item.max - item.current}/{item.max}
                      </span>
                    </Grid.Item>
                  ))}
                </Grid>
              </Grid.Item>
            </Grid>
          </Card>
        </Grid.Item>
      </Grid>
    </Popup>
  )
}
