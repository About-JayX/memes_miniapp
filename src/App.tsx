// 第三方库导入
import { ConfigProvider, TabBar } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '@/components/icon'
import Loading from '@/components/loading'
import NewUserRewards from '@/components/lib/newUserRewards'
import OpenScreenAnimation from '@/components/openScreenAnimation/loading'
import PublishTasks from '@/components/lib/publishTasks'
import Router from '@/router'
import TgsAnimation from '@/components/tgsAnimation'
// 本地配置和工具导入
import { antdLocale, type LocaleCode } from '@/config/locale'
import { PUBLISH_BUTTON_STYLE, TAB_ITEMS } from '@/config/tabBar'
import { initDataHook } from '@/hooks/initData'
import { useTelegram } from '@/providers/telegram'
import { useAppSelector } from '@/store'
import { useBackButton } from '@/hooks/useBackButton'
import { useTask } from '@/hooks/useTask'
import { usePageRefresh } from '@/hooks/usePageRefresh'

const isMemes = import.meta.env.MODE.split('-')[1] === 'memes'

export default function App() {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const locale = antdLocale?.[language as LocaleCode] || antdLocale['en-US']

  const navigate = useNavigate()
  const { task } = useAppSelector(state => state.list)
  const { tgs } = useAppSelector(state => state.tgs)
  const { pathname } = useLocation()
  const [iconKey, setIconKey] = useState<string>('')
  const { webApp } = useTelegram()
  const { load } = useAppSelector(state => state.telegram)
  const [publishTaskStatus, setPublishTaskStatus] = useState(false)
  const [status, setStatus] = useState(true)

  // 优化hook_
  const { showTabBar } = useBackButton()
  const { submitTask } = useTask()
  usePageRefresh()
  initDataHook()

  const handleTabChange = async (key: string) => {
    if (key !== '/publish' && key !== '/publish1') {
      navigate(key)
      setIconKey(key)
    } else {
      await submitTask()
      setTimeout(() => setPublishTaskStatus(true), 100)
    }
  }
  
  useEffect(() => {
    if (!webApp?.initDataUnsafe?.start_param?.includes('task')) return
    navigate('/task')
  }, [webApp, navigate])

  return (
    <ConfigProvider locale={locale}>
      {status ? (
        tgs.length ? (
          <OpenScreenAnimation
            status={load.initLoading}
            onChange={() => setStatus(false)}
          />
        ) : (
          ''
        )
      ) : (
        <>
          {load.globalLoading ? (
            <Loading
              loading={load.globalLoading}
              text={load.globalText}
            ></Loading>
          ) : (
            ''
          )}
          <NewUserRewards />
          <PublishTasks
            open={publishTaskStatus}
            onClose={() => setPublishTaskStatus(false)}
          />

          <div className="h-screen flex flex-col" id="main">
            <div
              className={`flex-1 h-[calc(100vh-7rem)] ${
                showTabBar ? '' : 'pb-5'
              }`}
            >
              <Router />
            </div>
            {showTabBar && (
              <div className="flex-[0]  z-[999] h-[460px] relative bg-[--primary-body-color]">
                <TabBar
                  className="z-[999] mb-7"
                  safeArea
                  onChange={handleTabChange}
                  activeKey={iconKey || pathname}
                  defaultActiveKey="/"
                >
                  {TAB_ITEMS.map(item => (
                    <TabBar.Item
                      key={item.key}
                      className={
                        item.isPublish
                          ? item.className
                          : `transition duration-300 ease-in-out ${
                              pathname === item.key ? 'scale-100' : 'scale-90'
                            }`
                      }
                      title={item.title && t(item.title)}
                      badge={item.key === '/task' ? task.total : undefined}
                      icon={
                        item.isPublish
                          ? (_: boolean) => (
                              <div
                                className={`!h-[52px] !w-[52px] ${
                                  isMemes ? 'rounded-2xl' : '!rounded-full'
                                } flex justify-center items-center pointer-events-auto`}
                                style={{
                                  background: isMemes
                                    ? PUBLISH_BUTTON_STYLE.memes
                                    : PUBLISH_BUTTON_STYLE.mego,
                                }}
                              >
                                <TgsAnimation
                                  className="h-12 w-12"
                                  style={{ position: 'absolute', top: '0' }}
                                  icon="tabsAdd"
                                />
                              </div>
                            )
                          : (active: boolean) =>
                              item.hidden ? (
                                <div className="opacity-0">
                                  <Icon
                                    name={
                                      active
                                        ? item.icon!.active
                                        : item.icon!.default
                                    }
                                  />
                                </div>
                              ) : (
                                <Icon
                                  name={
                                    active
                                      ? item.icon!.active
                                      : item.icon!.default
                                  }
                                />
                              )
                      }
                    />
                  ))}
                </TabBar>
              </div>
            )}
          </div>
        </>
      )}
    </ConfigProvider>
  )
}
