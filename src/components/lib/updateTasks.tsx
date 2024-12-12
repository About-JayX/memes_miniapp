import { Select } from 'antd'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  type ImageUploadItem,
  Slider,
} from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/api'
import sliderConfig from '@/config/sliderConfig'
import { useAppDispatch, useAppSelector } from '@/store'
import { ItaskData } from '@/store/interface'
import {
  asyncDetailsList,
  asyncGetTaskList,
  asyncUserTaskList,
} from '@/store/list'

import Icon from '../icon'
import ImageUploader from '../imageUploader'
import Input from '../input'
import Popup from '../popup'
import Toast from '../toast'
import TelegramLink from './telegramLink'

export default function UpdateTasks({
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
  data?: ItaskData
  open?: boolean
  onClose?: () => void
}) {
  const { t } = useTranslation()
  const { taskOptions } = useAppSelector(state => state.telegram)
  const { userTask } = useAppSelector(state => state.list)
  const { tgs } = useAppSelector(state => state.tgs)
  const [url, setUrl] = useState('')
  const [imgs, setImgs] = useState<ImageUploadItem[]>([])
  const [file, setFile] = useState<any>()
  const photo = useRef<FormData>(new FormData())

  const [notify, setNotify] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addTelegramLinkStatus, setAddTelegramLinkStatus] = useState(false)
  const { notifys } = useAppSelector(state => state.list)
  const dispatch = useAppDispatch()
  const upDateTask = async () => {
    setLoading(true)
    photo.current = new FormData()

    photo.current.append('notifyId', String(notify))
    photo.current.append('taskId', String(data.Id))
    photo.current.append('photo', file)

    photo.current.append('urls', JSON.stringify({ TweetId: url }))
    try {
      await api.task.editTaskAPI(photo.current)
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
      onClose && onClose()
      Toast({
        tgs,
        type: 'success',
        content: t('message.edit.success'),
      })
    } catch (error) {
      Toast({
        tgs,
        type: 'error',
        content: t('message.edit.error'),
      })
    }
    setLoading(false)
  }
  useEffect(() => {
    setUrl(data.urls.TweetId)
    setNotify(data.notifyId)
  }, [data])
  return (
    <>
      <TelegramLink
        open={addTelegramLinkStatus}
        onClose={() => setAddTelegramLinkStatus(false)}
      />
      <Popup
        visible={open}
        onClose={onClose}
        footer={
          <Button
            size="large"
            color="primary"
            className="w-full"
            onClick={upDateTask}
            loading={loading}
          >
            {t('public.revise')}
          </Button>
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
            <Grid columns={1} gap={14}>
              <Grid.Item className="text-xs font-medium">
                {t('public.tweetLink')}&nbsp;
                <span className="text-[--error-color]">*</span>
              </Grid.Item>
              <Grid.Item>
                <Input
                  placeholder={t('public.enterAddress')}
                  value={url}
                  onChange={e => setUrl(e)}
                />
              </Grid.Item>
            </Grid>
          </Grid.Item>

          <Grid.Item>
            <Grid columns={1} gap={14}>
              <Grid.Item className="text-xs font-medium">
                {t('public.taskSelection')}&nbsp;
                <span className="text-white/50">
                  ({t('public.everyTask')} 100 $MEMES)
                </span>
                &nbsp;<span className="text-[--error-color]">*</span>
              </Grid.Item>
              <Grid.Item className="w-full overflow-hidden">
                <Slider
                  max={50}
                  min={0}
                  disabled
                  ticks
                  defaultValue={Number(
                    data.models.length ? data.models[0].max : 0
                  )}
                  marks={sliderConfig}
                  // onAfterChange={(value) => setAmount(value.toString())}
                />
              </Grid.Item>
            </Grid>
          </Grid.Item>
          <Grid.Item className="flex flex-wrap items-center gap-3">
            {taskOptions.data.map((item, index) => (
              <Checkbox
                key={index}
                checked={
                  data.models.find(m => m.model === item.model) ? true : false
                }
              >
                {t(`public.${item.model}`)} (
                {`${data.models[0]?.max || 0}/${data.models[0]?.max || 0}`})
              </Checkbox>
            ))}
          </Grid.Item>
          <Grid.Item>
            <Divider style={{ borderStyle: 'dashed' }} />
          </Grid.Item>

          <Grid.Item>
            <Grid columns={1} gap={14}>
              <Grid.Item className="text-xs font-medium">
                {t('public.telegramGroupLink')}&nbsp;
                <span className="text-white/50">
                  ({t('public.robotBroadcast')})
                </span>
              </Grid.Item>
              <Grid.Item className="grid grid-cols-[1fr,auto] items-center gap-3">
                <Select
                  value={notify}
                  onChange={e => {
                    setNotify(e)
                  }}
                  className="w-full"
                  size="large"
                  placeholder={t('public.enterRobotLink')}
                  options={notifys.data.map(item => ({
                    label: item.chat_title,
                    value: item.Id,
                  }))}
                />
                <Button
                  color="default"
                  className="!h-12 !bg-transparent !border-[--primary] !text-[--primary]"
                  onClick={() => setAddTelegramLinkStatus(true)}
                >
                  {t('public.add')}
                </Button>
              </Grid.Item>
            </Grid>
          </Grid.Item>
          {notify ? (
            <Grid.Item className="pt-4">
              <Grid columns={1} gap={14}>
                <Grid.Item className="text-xs font-medium">
                  {t('task.uploadTelegramBotImg.title')}
                </Grid.Item>
                <Grid.Item>
                  <ImageUploader
                    value={imgs}
                    onChange={setImgs}
                    upload={async file => {
                      setFile(file)
                      return { url: URL.createObjectURL(file) }
                    }}
                  />
                </Grid.Item>
                <Grid.Item className="text-white/50 text-xs font-normal">
                  {t('task.uploadTelegramBotImg.text')}
                </Grid.Item>
              </Grid>
            </Grid.Item>
          ) : (
            ''
          )}
        </Grid>
      </Popup>
    </>
  )
}
