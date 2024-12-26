import { useBackButtonRaw } from '@telegram-apps/sdk-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { HIDE_TAB_BAR_PATHS } from '@/config/tabBar'

export const useBackButton = () => {
  const backButton = useBackButtonRaw(true)?.result
  const navigate = useNavigate()
  const { pathname, state } = useLocation()

  const showTabBar = !HIDE_TAB_BAR_PATHS.includes(pathname)

  useEffect(() => {
    if (!showTabBar && backButton) {
      backButton.show()
      backButton.on('click', () => {
        navigate(state?.path || '/')
        backButton.hide()
      })
    }

    return () => {
      backButton?.hide()
    }
  }, [backButton, showTabBar, navigate, state])

  return { showTabBar }
}
