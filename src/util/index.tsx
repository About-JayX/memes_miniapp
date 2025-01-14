import { type MiniAppHeaderColor } from '@telegram-apps/sdk-react'
import { t } from 'i18next'

import Toast from '@/components/toast'

export const toFullHex = (hex: string): MiniAppHeaderColor | any => {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
  }
  return hex
}

// 随机获取颜色
export const stringToColor = (str: string): string => {
  if (str) {
    // 计算字符串的哈希值
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    // 将哈希值转化为颜色值
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += ('00' + value.toString(16)).slice(-2)
    }
    return color
  } else {
    return str
  }
}

// 获取随机颜色对应当前文本黑白
export const getTextColorForBackground = (
  str: string
): { backgroundColor: string; textColor: string } => {
  if (str) {
    const backgroundColor = stringToColor(str)
    const r = parseInt(backgroundColor.substring(1, 3), 16)
    const g = parseInt(backgroundColor.substring(3, 5), 16)
    const b = parseInt(backgroundColor.substring(5, 7), 16)

    // 计算亮度 (YIQ公式)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    const textColor = yiq >= 128 ? '#000000' : '#FFFFFF'
    return { backgroundColor, textColor }
  } else {
    return { backgroundColor: '', textColor: '#FFFFFF' }
  }
}

// 分号
export const semicolon = (number: number | string) => {
  return new Intl.NumberFormat().format(Number(number))
}

// 复制
export const copy = async (
  tgs: Array<{ name: string; data: any }>,
  url: string
) => {
  const inviteLink = url

  try {
    await navigator.clipboard.writeText(inviteLink)
    Toast({
      tgs,
      type: 'success',
      content: t('message.copy.success'),
    })
  } catch (_) {
    const textArea = document.createElement('textarea')
    textArea.value = inviteLink
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      Toast({
        tgs,
        type: 'success',
        content: t('message.copy.success'),
      })
    } catch (_) {
      return
    }
    document.body.removeChild(textArea)
  }
}

export const isIOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}
export const getstratParams = (startParams: string) => {
  // 拆分字符串，得到键值对数组
  const pairs = startParams.split('_')

  // 创建一个空对象用于存储解析结果
  const result: { [key: string]: string } = {}

  // 遍历每一对键值
  for (let i = 0; i < pairs.length; i += 2) {
    const key = pairs[i] // 键
    const value = pairs[i + 1] // 值

    // 将键值对添加到结果对象中
    result[key] = value
  }

  return result
}
// 序列化函数
export const serializeData = (data: any) => {
  return Object.keys(data)
    .map(key => {
      const value =
        typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]
      return `${key}=${encodeURIComponent(value)}`
    })
    .join('&')
}
export const isTimeExceededByOneMinute = (targetTimestamp: number) => {
  // 获取当前时间的毫秒级时间戳
  const currentTimestamp = Date.now()

  // 计算时间差，以毫秒为单位
  const timeDifference = currentTimestamp - targetTimestamp

  // 检查是否超过一分钟（60000 毫秒）
  return timeDifference > 60000
}

export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 10)}...${address.slice(-10)}`;
};
