// 第三方库导入
import { ConfigProvider } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// 本地组件导入
import LoadingScreen from '@/components/loadingScreen'
import MainContent from '@/components/mainContent'

// 本地配置和工具导入
import { antdLocale, type LocaleCode } from '@/config/locale'
import { initDataHook } from '@/hooks/initData'
import { usePageRefresh } from '@/hooks/usePageRefresh'
import { useTelegram } from '@/providers/telegram'

export default function App() {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const locale = antdLocale?.[language as LocaleCode] || antdLocale['en-US']

  const navigate = useNavigate()
  const { webApp } = useTelegram()
  const [iconKey, setIconKey] = useState<string>('')
  const [publishTaskStatus, setPublishTaskStatus] = useState(false)
  const [status, setStatus] = useState(true)

  // 初始化 hooks
  usePageRefresh()
  initDataHook()

  // 处理 Telegram 启动参数
  useEffect(() => {
    const startParam = webApp?.initDataUnsafe?.start_param
    if (startParam?.includes('task')) {
      navigate('/task')
    }
  }, [webApp, navigate])

  return (
    <ConfigProvider locale={locale}>
      <LoadingScreen status={status} onStatusChange={() => setStatus(false)} />
      {!status && (
        <MainContent
          iconKey={iconKey}
          setIconKey={setIconKey}
          publishTaskStatus={publishTaskStatus}
          setPublishTaskStatus={setPublishTaskStatus}
        />
      )}
    </ConfigProvider>
  )
}
