/* eslint-disable react-hooks/rules-of-hooks */
import {
  type MiniAppHeaderColor,
  SDKProvider,
  useMiniAppRaw,
  useSwipeBehaviorRaw,
  useViewportRaw,
} from '@telegram-apps/sdk-react'
import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'

import { telegramInitData } from '@/config/telegram'
import { toFullHex } from '@/util'

import type { ITelegramUser, IWebApp } from './type'

const TELEGRAM_SCRIPT_URL = 'https://telegram.org/js/telegram-web-app.js'

interface TelegramContextType {
  webApp?: IWebApp
  user?: ITelegramUser
  postData?: {
    initData: string
    initDataUnsafe: {
      query_id: string
      user: ITelegramUser
      auth_date: string
      hash: string
    }
  }
}

export const TelegramContext = createContext<TelegramContextType>({})

export const Telegram = ({ children }: { children: React.ReactNode }) => {
  const [webApp, setWebApp] = useState<IWebApp | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadTelegramScript = () => {
      try {
        if (scriptLoaded) {
          const app = window.Telegram?.WebApp
          if (!app) {
            throw new Error('Telegram WebApp not initialized')
          }
          setWebApp({ ...app, ...telegramInitData })
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      }
    }

    loadTelegramScript()
  }, [scriptLoaded])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = TELEGRAM_SCRIPT_URL
    script.async = true

    const handleLoad = () => setScriptLoaded(true)
    const handleError = () =>
      setError(new Error('Failed to load Telegram script'))

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    document.body.appendChild(script)

    return () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
      document.body.removeChild(script)
    }
  }, [])

  const TelegramHook = ({ children }: { children: React.ReactNode }) => {
    const { pathname } = useLocation()
    const viewport = useViewportRaw(true)?.result
    const swipeBehavior = useSwipeBehaviorRaw(true)?.result
    const miniApp = useMiniAppRaw(true)?.result

    useEffect(() => {
      if (!webApp || !miniApp) return

      const root = document.documentElement
      const bgColor = getComputedStyle(root)
        .getPropertyValue('--primary-bg-color')
        .trim() as MiniAppHeaderColor

      miniApp.setHeaderColor(toFullHex(bgColor))
      miniApp.ready()

      viewport?.isExpanded || viewport?.expand()
      swipeBehavior?.disableVerticalSwipe()
    }, [miniApp, viewport, swipeBehavior, pathname])

    return <>{children}</>
  }

  const value = useMemo(() => {
    return webApp
      ? {
          webApp,
          user: webApp.initDataUnsafe.user,
          postData: {
            initData: webApp.initData,
            initDataUnsafe: webApp.initDataUnsafe,
          },
        }
      : {}
  }, [webApp])
  return (
    <TelegramContext.Provider value={value}>
      {webApp ? (
        <SDKProvider debug>
          <TelegramHook>{children}</TelegramHook>
        </SDKProvider>
      ) : (
        <Fragment />
      )}
    </TelegramContext.Provider>
  )
}

export default function TelegramProvider({
  children,
}: {
  children?: React.ReactNode
}) {
  return <Telegram>{children}</Telegram>
}

export const useTelegram = () => useContext(TelegramContext)
