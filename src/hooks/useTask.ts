import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store'
import { asyncLoading, asynUpdateTaskOptions } from '@/store/telegram'
import api from '@/api'

export const useTask = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { taskOptions } = useAppSelector(state => state.telegram)

  const submitTask = async () => {
    if (!taskOptions.data.length) {
      await dispatch(
        asyncLoading({
          globalText: t('public.loading'),
          callBack: async () => {
            const result = await api.task.taskOptionsAPI('Twitter')
            await dispatch(asynUpdateTaskOptions(result))
          },
        })
      )
    }
  }

  return { submitTask, taskOptions }
} 