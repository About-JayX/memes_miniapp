import { Button, Divider, Grid } from 'antd-mobile'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/api'
import { Container } from '@/components/box'
import Card from '@/components/card'
import Icon from '@/components/icon'
import PublishTasks from '@/components/lib/publishTasks'
import RemovedFromShelvesTasks from '@/components/lib/removedFromShelvesTasks'
import UpdateTasks from '@/components/lib/updateTasks'
import { useAppDispatch, useAppSelector } from '@/store'
import { ItaskData } from '@/store/interface'
import { asyncLoading, asynUpdateTaskOptions } from '@/store/telegram'
import { copy } from '@/util'

export default function TaskList() {
  const { t } = useTranslation()
  const [publishTaskStatus, setPublishTaskStatus] = useState<boolean>(false)
  const [removedFromShelvesStatus, setRemovedFromShelvesStatus] =
    useState<boolean>(false)
  const [updateTasksStatus, setUpdateTasksStatus] = useState<boolean>(false)
  const [updateData, setUpdateData] = useState<ItaskData>({
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
    is_top: 0,
    is_hot: 0,
  })
  const [removeData, setRemoveData] = useState<ItaskData>({
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
    is_top: 0,
    is_hot: 0,
  })
  const { taskOptions } = useAppSelector(state => state.telegram)
  const { userTask } = useAppSelector(state => state.list)
  const { tgs } = useAppSelector(state => state.tgs)
  const dispatch = useAppDispatch()

  const sumbitTask = async () => {
    if (!taskOptions.data.length) {
      await dispatch(
        asyncLoading({
          globalText: t('public.loading'),
          callBack: async () => {
            const reslut = await api.task.taskOptionsAPI('Twitter')
            await dispatch(asynUpdateTaskOptions(reslut))
          },
        })
      )
    }
    setPublishTaskStatus(true)
  }
  return (
    <>
      <PublishTasks
        open={publishTaskStatus}
        onClose={() => setPublishTaskStatus(false)}
      />
      <RemovedFromShelvesTasks
        data={removeData}
        open={removedFromShelvesStatus}
        onClose={() => setRemovedFromShelvesStatus(false)}
      />
      <UpdateTasks
        data={updateData}
        open={updateTasksStatus}
        onClose={() => setUpdateTasksStatus(false)}
      />
      <Container className="overflow-y-auto h-screen">
        <Grid columns={1} gap={29}>
          <Grid.Item>
            <Grid
              columns={1}
              gap={9}
              className="justify-items-center text-center"
            >
              <Grid.Item className="text-2xl font-bold">
                {t('task.taskManagement.title')}
              </Grid.Item>
              <Grid.Item className="text-sm font-normal">
                {t('task.taskManagement.text')}
              </Grid.Item>
              <Grid.Item>
                <Button
                  color="primary"
                  className="min-w-[130px]"
                  onClick={sumbitTask}
                >
                  {t('public.release')}
                </Button>
              </Grid.Item>
            </Grid>
          </Grid.Item>
          {/* 推特 */}

          {userTask.data?.map((item, index) => (
            <Grid.Item key={index}>
              <Card animation={false}>
                <Grid columns={1} gap={12}>
                  <Grid.Item className="flex gap-[6px] items-center justify-between">
                    <Icon
                      name="task/twitter"
                      className="!w-7 !h-7 rounded-lg"
                    />
                    <span className="flex-1 text-base font-bold ">
                      {item?.name}
                    </span>
                    {item?.created_at && (
                      <span className="text-xs font-normal text-white/50">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </Grid.Item>
                  <Grid.Item>
                    <Divider />
                  </Grid.Item>
                  <Grid.Item>
                    <Grid columns={1} gap={20}>
                      <Grid.Item>
                        <Card animation={false}>
                          <div className="flex justify-between gap-4 items-center">
                            <span className="text-base font-medium text-[--primary] flex-1 truncate">
                              {item?.urls?.TweetId}
                            </span>
                            <a onClick={() => copy(tgs, item?.urls?.TweetId)}>
                              <Icon name="copy" />
                            </a>
                          </div>
                        </Card>
                      </Grid.Item>
                      <Grid.Item>
                        <Card animation={false}>
                          <div className="flex gap-4 items-center px-1">
                            {item?.models?.map((cItem, i) => (
                              <Fragment key={i}>
                                <Grid
                                  columns={1}
                                  gap={6}
                                  className="justify-items-center flex-1"
                                >
                                  <Grid.Item>
                                    <Icon name={`task/${cItem?.model}`} />
                                  </Grid.Item>
                                  <Grid.Item className="text-lg font-bold">
                                    {cItem?.current}
                                  </Grid.Item>
                                  <Grid.Item className="text-xs font-normal">
                                    {t(`public.${cItem?.model}`)}
                                  </Grid.Item>
                                </Grid>
                                {index < item?.models?.length - 1 ? (
                                  <Divider
                                    direction="vertical"
                                    className="!h-[74px]"
                                  />
                                ) : (
                                  ''
                                )}
                              </Fragment>
                            ))}
                          </div>
                        </Card>
                      </Grid.Item>
                      <Grid.Item className="text-center text-base font-bold">
                        <span className="text-[#F0F0F2]">
                          {t('public.schedule')} :{' '}
                        </span>
                        {item?.models?.reduce((value, item) => {
                          return value + item?.current
                        }, 0) +
                          '/' +
                          item?.models?.reduce((value, item) => {
                            return value + item?.max
                          }, 0)}
                      </Grid.Item>
                    </Grid>
                  </Grid.Item>
                  <Grid.Item>
                    <Grid columns={item?.is_enabled ? 1 : 2} gap={12}>
                      <Grid.Item>
                        <Button
                          className="w-full"
                          color="primary"
                          disabled={item?.is_enabled ? true : false}
                          onClick={() => {
                            setRemoveData(item)
                            setRemovedFromShelvesStatus(true)
                          }}
                        >
                          {item?.is_enabled
                            ? t('public.removed')
                            : t('public.remove')}
                        </Button>
                      </Grid.Item>
                      {item?.is_enabled ? (
                        ''
                      ) : (
                        <Grid.Item>
                          <Button
                            onClick={async () => {
                              if (!taskOptions.data.length) {
                                await dispatch(
                                  asyncLoading({
                                    globalText: t('public.loading'),
                                    callBack: async () => {
                                      const reslut =
                                        await api.task.taskOptionsAPI('Twitter')
                                      await dispatch(
                                        asynUpdateTaskOptions(reslut)
                                      )
                                    },
                                  })
                                )
                                setPublishTaskStatus(true)
                              }
                              setUpdateData(item)
                              setUpdateTasksStatus(true)
                            }}
                            color="default"
                            className="w-full !bg-white !border-white !text-black"
                          >
                            {t('public.revise')}
                          </Button>
                        </Grid.Item>
                      )}
                    </Grid>
                  </Grid.Item>
                </Grid>
              </Card>
            </Grid.Item>
          ))}

          {/* 电报 */}
        </Grid>
      </Container>
    </>
  )
}
