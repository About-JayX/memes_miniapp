import { Button, Grid, Skeleton } from 'antd-mobile'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from '@/store'

import Popup from '../popup'
import TgsAnimation from '../tgsAnimation'

export default function NewUserRewards({
  open = false,
  onClose,
}: {
  open?: boolean
  onClose?: () => void
}) {
  const { user } = useAppSelector(state => state.telegram)
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState(true) // true隐藏 false完成
  const [count, setCount] = useState(Number(user.token) || 0)
  useEffect(() => {
    setVisible(user.newUser)
  }, [user])
  function fullClose(n: any, m: any) {
    let result = Math.random() * (m + 1 - n) + n
    while (result > m) {
      result = Math.random() * (m + 1 - n) + n
    }
    return result
  }
  useEffect(() => {
    const timer = setInterval(() => {
      if (user.token) {
        setCount(Number(user.token))
        clearInterval(timer)
      } else {
        setCount(fullClose(0, 999))
      }
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [user.token])

  useEffect(() => {
    setTimeout(() => setStatus(count <= 0), 1000)
  }, [count])
  return (
    <Popup
      closeOnMaskClick={!status}
      visible={visible}
      onClose={() => setVisible(false)}
      showCloseButton={!status}
      footer={
        <Button
          size="large"
          color="primary"
          className={`w-full transition-all delay-500  ease-out ${
            status ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={() => setVisible(false)}
        >
          {t('public.ok')}
        </Button>
      }
    >
      <Grid
        columns={1}
        gap={24}
        className="justify-items-center text-center mt-2"
      >
        <Grid.Item>
          <div className="w-32 h-32 relative">
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-[0]">
              <div className="flex gap-1 items-end">
                <span className="text-6xl font-bold">
                  {Math.ceil(user.predicted_date / 365)}
                </span>
                <span className="text-base font-normal mb-1">
                  {t('public.year')}
                </span>
              </div>
            </div>
            <TgsAnimation
              icon="newUserRewards"
              className="w-full h-full z-[9]"
            />
          </div>
        </Grid.Item>
        <Grid.Item>
          <Grid columns={1} gap={10}>
            <Grid.Item className="text-3xl font-bold flex items-center">
              {status ? (
                <Skeleton.Title className="!m-0 !w-16 !rounded-xl" animated />
              ) : (
                <>
                  +<CountUp end={count} />
                </>
              )}
              &nbsp;$MEMES
            </Grid.Item>
            <Grid.Item className="text-base font-normal">
              {t('public.newUserRewards')}&nbsp;
              <span className="text-[rgba(198,220,255,0.5)] text-sm">
                @{user.username}
              </span>
            </Grid.Item>
          </Grid>
        </Grid.Item>
      </Grid>
    </Popup>
  )
}
