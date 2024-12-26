import { useEffect } from 'react'

export const usePageRefresh = () => {
  useEffect(() => {
    const handleFocusOut = () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }, 101)
    }

    window.addEventListener('focusout', handleFocusOut)
    
    const hasRefreshed = sessionStorage.getItem('refreshed')
    if (!hasRefreshed) {
      sessionStorage.setItem('refreshed', 'true')
      window.location.reload()
    }

    return () => window.removeEventListener('focusout', handleFocusOut)
  }, [])
} 