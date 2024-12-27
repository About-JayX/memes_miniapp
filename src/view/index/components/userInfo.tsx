import { Ellipsis, Grid } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/card'
import MButton from '@/components/button'
import TgsAnimation from '@/components/tgsAnimation'
import { useAppSelector } from '@/store'
import { semicolon } from '@/util'
import { symbol } from '@/config'

interface UserInfoProps {
  searchLoadStatus: boolean
}

export default function UserInfo({ searchLoadStatus }: UserInfoProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAppSelector(state => state.telegram)

  return (
    <Card type="primary">
      <Grid columns={1} gap={18}>
        <Grid.Item>
          <Grid columns={1} gap={4} className="justify-items-center">
            <Grid.Item className="flex gap-2 items-center break-all">
              <Ellipsis
                direction="end"
                className="text-base font-medium"
                content={`@${user.username}`}
              />
              <a
                className="text-[10px] font-bold bg-white/5 py-[3px] px-2 rounded-full text-[#4FFFC4]"
                onClick={() =>
                  !searchLoadStatus &&
                  navigate('integral', {
                    state: { path: '/' },
                  })
                }
              >
                {t('public.details')}
                {'>>'}
              </a>
            </Grid.Item>
            <Grid.Item className="text-3xl font-bold">
              {semicolon(user.token || '0') + ` $${symbol}`}
            </Grid.Item>
          </Grid>
        </Grid.Item>
        <Grid.Item>
          <Grid columns={2} gap={8}>
            <Grid.Item>
              <MButton
                onClick={() =>
                  !searchLoadStatus &&
                  navigate('signin', {
                    state: { path: '/' },
                  })
                }
              >
                <div className="absolute left-0 top-0 w-full h-full flex justify-end">
                  <TgsAnimation
                    icon="animate"
                    className="w-8 h-8 text-[--primary] mt-[-3px] mr-[0] inline-block"
                  />
                </div>

                <Grid columns={1} gap={2} className="justify-items-center py-2">
                  <Grid.Item>
                    <TgsAnimation
                      icon="signIn"
                      className="w-10 h-10 text-[--primary] mt-[-6px] inline-block"
                    />
                  </Grid.Item>
                  <Grid.Item>{t('public.dailyCheckIn')}</Grid.Item>
                </Grid>
              </MButton>
            </Grid.Item>
            <Grid.Item>
              <MButton
                onClick={() =>
                  !searchLoadStatus &&
                  navigate('invite', {
                    state: { path: '/' },
                  })
                }
              >
                <div className="absolute left-0 top-0 w-full h-full flex justify-end">
                  <TgsAnimation
                    icon="animate"
                    className="w-8 h-8 text-[--primary] mt-[-3px] mr-[0px] inline-block"
                  />
                </div>
                <Grid columns={1} gap={2} className="justify-items-center py-2">
                  <Grid.Item>
                    <TgsAnimation
                      icon="friends"
                      className="w-10 h-10 text-[--primary] mt-[-6px] inline-block"
                    />
                  </Grid.Item>
                  <Grid.Item>{t('public.inviteFriends')}</Grid.Item>
                </Grid>
              </MButton>
            </Grid.Item>
          </Grid>
        </Grid.Item>
      </Grid>
    </Card>
  )
}
