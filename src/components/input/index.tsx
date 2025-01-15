import { on } from '@telegram-apps/sdk-react'
import { Timeout } from 'ahooks/lib/useRequest/src/types'
import { Input as Inputs,type InputRef } from 'antd-mobile'
import { useRef } from 'react'

import { useTelegram } from '@/providers/telegram'

export default function Input({
  placeholder = '',
  onChange,
  prefix,
  suffix,
  value = '',
  className = '',
  onClick,
}: {
  placeholder?: string
  onChange?: (value: string) => void
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  value?: string
  className?: string
  onClick?: () => void
}) {
  const findParentByClassName = (element: any, className: string) => {
    if (!element) return null
    let currentElement = element.parentElement
    while (currentElement) {
      if (
        currentElement.classList &&
        currentElement.classList.contains(className)
      ) {
        return currentElement
      }
      currentElement = currentElement.parentElement
    }
    return null
  }

  const { webApp } = useTelegram()
  const timer = useRef<Timeout | null>(null)
  const inputRef = useRef<InputRef>(null)

  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto] items-center gap-[6px]
         bg-[--primary-card-body-color] p-2.5 rounded-xl text-nowrap text-xs font-bold ${className}`}
    >
      {prefix}
      <Inputs
        inputMode="text"
        type="text"
        ref={inputRef}
        value={value}
        defaultValue={value}
        placeholder={placeholder}
        onFocus={e => {
          if (timer.current) {
            clearTimeout(timer.current)
            timer.current = null
          }
          let popupView = webApp?.viewportStableHeight || 0
          const targetTop = e.target.getBoundingClientRect().top
          on('viewport_changed', data => {
            const scrollEle: HTMLElement = findParentByClassName(
              e.target,
              'customize—popup'
            )
            if (data.height < popupView) {
              popupView = data.height
              if (targetTop - popupView > 0) {
                timer.current = setTimeout(() => {
                  scrollEle.scrollTo({
                    top: 9999,
                    left: 0,
                    behavior: 'smooth',
                  })
                  window.scrollTo({
                    top: targetTop - popupView,
                    behavior: 'smooth',
                  })
                }, 300)
              }
            }
          })
        }}
        onBlur={() => {
          if (timer.current) {
            clearTimeout(timer.current)
            timer.current = null
          }
        }}
        onChange={(val: string) => {
          console.log('[search][Input] onChange:', val)
          onChange && onChange(val)
        }}
        onClick={() => {
          onClick && onClick()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            inputRef.current?.blur() // Blur the input when Enter is pressed
          }
        }}
      />
      {suffix}
    </div>
  )
}
