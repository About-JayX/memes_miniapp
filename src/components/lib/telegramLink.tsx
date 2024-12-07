import { postEvent } from '@telegram-apps/sdk-react'
import { Button, Grid, Image } from 'antd-mobile'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useTelegram } from '@/providers/telegram'
import { useAppSelector } from '@/store'
import { copy, getstratParams } from '@/util'

import Icon from '../icon'
import Popup from '../popup'
import Selector from '../selector'

export default function TelegramLink({
  open = false,
  onClose,
}: {
  open?: boolean
  onClose?: () => void
}) {
  const { t } = useTranslation()
  const [step, setStep] = useState<'user' | 'group'>('group')
  const { user } = useAppSelector(state => state.telegram)
  const { tgs } = useAppSelector(state => state.tgs)
  const { webApp } = useTelegram()
  const bindTelegramBot: any = t('bindTelegramBot', { returnObjects: true })
  const botName = import.meta.env.VITE_BOOTNAME
    ? import.meta.env.VITE_BOOTNAME.split('/')[0]
    : ''
  return (
    <Popup
      visible={open}
      onClose={onClose}
      footer={
        <Button
          className="w-full"
          size="large"
          color="primary"
          onClick={() => {
            // copy(tgs, `/Bind ${user.code}`)
            const startParams =
              (webApp &&
                webApp.initDataUnsafe &&
                webApp.initDataUnsafe.start_param) ||
              ''
            if (!startParams) return
            const result = getstratParams(startParams)
            postEvent('web_app_open_tg_link', {
              path_full: `/${botName}?start=addtogroup`,
            })
            if (result && result.open) {
              postEvent('web_app_close')
            }
          }}
        >
          {t('public.goToBinding')}
        </Button>
      }
    >
      <Grid columns={1} gap={27}>
        <Grid.Item>
          <Grid
            columns={1}
            gap={9}
            className="justify-items-center text-center"
          >
            <Grid.Item>
              <Icon
                name="telegram"
                className="!w-[50px] !h-[50px] rounded-lg"
              />
            </Grid.Item>
            <Grid.Item className="text-2xl font-bold">
              {t('bindTelegramBot.title')}
            </Grid.Item>
            <Grid.Item className="text-base font-normal">
              {t('bindTelegramBot.text')}
            </Grid.Item>
          </Grid>
        </Grid.Item>
        <Grid.Item>
          <Selector
            value={step}
            onChange={value => setStep(value[0])}
            options={[
              {
                label: t('public.bindToGroup'),
                value: 'group',
              },
            ]}
          />
        </Grid.Item>
        {step === 'user'
          ? bindTelegramBot['user'] &&
            bindTelegramBot['user'].map((item: any, index: number) => (
              <Grid.Item key={index}>
                <Grid columns={1} gap={19}>
                  <Grid.Item className="flex gap-2 text-xs font-medium items-center">
                    <span className="bg-[--primary-card-body-color] w-5 flex items-center justify-center px-[7px] py-[2px] rounded-lg">
                      {index + 1}
                    </span>
                    <span>
                      {item['text'] &&
                        item['text'].map((e: any, i: number) => (
                          <span
                            key={i}
                            className={`${
                              e.status ? '' : 'text-[rgba(198,220,255,0.5)'
                            }]`}
                          >
                            {i < 0 && `\n`}
                            {e.content}
                            &nbsp;
                          </span>
                        ))}
                      {item.copy && (
                        <a onClick={() => copy([], item.copyText)}>
                          <Icon name="copy" />
                        </a>
                      )}
                    </span>
                  </Grid.Item>
                  <Grid.Item className="flex gap-2">
                    <div className="w-5" />
                    {item.imgUrl && (
                      <Image src={item.imgUrl} className="!w-52 !h-60" />
                    )}
                  </Grid.Item>
                </Grid>
              </Grid.Item>
            ))
          : bindTelegramBot['group'] &&
            bindTelegramBot['group'].map((item: any, index: number) => (
              <Grid.Item key={index}>
                <Grid columns={1} gap={19}>
                  <Grid.Item className="flex gap-2 text-xs font-medium items-center">
                    <span className="bg-[--primary-card-body-color] w-5 flex items-center justify-center px-[7px] py-[2px] rounded-lg">
                      {index + 1}
                    </span>
                    <span>
                      {item['text'] &&
                        item['text'].map((e: any, i: number) => (
                          <span
                            key={i}
                            className={`${
                              e.status ? '' : 'text-[rgba(198,220,255,0.5)'
                            }]`}
                          >
                            {i < 0 && `\n`}
                            {t(e.content, {
                              code: user.code,
                              botName: botName,
                            })}
                            &nbsp;
                          </span>
                        ))}
                      {(item.copy && index && (
                        <a
                          onClick={() =>
                            copy(
                              tgs,
                              t(item.copyText, {
                                code: user.code,
                              })
                            )
                          }
                        >
                          <Icon name="copy" />
                          <span style={{ color: 'rgba(198, 220, 255, .5)' }}>
                            &nbsp;{t('bindTelegramBot.text2')}
                          </span>
                        </a>
                      )) ||
                        ''}
                    </span>
                  </Grid.Item>
                  <Grid.Item className="flex gap-2">
                    <div className="w-5" />
                    {item.imgUrl && (
                      <Image src={item.imgUrl} className="!w-52 !h-60" />
                    )}
                  </Grid.Item>
                </Grid>
              </Grid.Item>
            ))}
      </Grid>
    </Popup>
  )
}
