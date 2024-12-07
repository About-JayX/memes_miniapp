import lottie, { AnimationItem } from 'lottie-web'
import { useCallback,useEffect, useRef, useState } from 'react'

import { useAppSelector } from '@/store'

export default function TgsAnimation({
  icon,
  propsTgs,
  ...props
}: {
  propsTgs?: Array<{ name: string; data: any }>
  icon: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const animationContainer = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<AnimationItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // 使用 useAppSelector 获取数据
  const tgs = propsTgs || useAppSelector(state => state.tgs).tgs

  // 初始化动画
  const init = useCallback(() => {
    const tgsData = tgs.find(item => item.name === icon)

    // 如果动画未加载过，才进行初始化
    if (tgsData && tgsData.data && !animationRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: animationContainer.current!,
        renderer: 'canvas',
        loop: true,
        autoplay: true,
        animationData: JSON.parse(tgsData.data), // 使用转换后的 JSON 数据
      })
    }
  }, [tgs, icon])

  // 依赖于 tgs 和 icon，确保在变化时重新加载动画
  useEffect(() => {
    if (isVisible) {
      init()
    }

    // 清理动画实例，避免内存泄漏
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
        animationRef.current = null
      }
    }
  }, [isVisible, init]) // 只在 isVisible 变化时加载和销毁动画

  // 使用 IntersectionObserver 检测动画是否在视口内
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.5 }
    )

    if (animationContainer.current) {
      observer.observe(animationContainer.current)
    }

    return () => {
      if (animationContainer.current) {
        observer.unobserve(animationContainer.current)
      }
    }
  }, [])

  return <div ref={animationContainer} {...props} />
}
