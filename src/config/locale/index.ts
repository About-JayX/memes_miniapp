// 第三方库导入
import enUS from 'antd-mobile/es/locales/en-US'
import koKR from 'antd-mobile/es/locales/ko-KR'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import zhHk from 'antd-mobile/es/locales/zh-HK'

// 本地模块导入
import mego from './mego'
import memes from './memes'
// 类型定义
export enum LocaleCode {
  EN_US = 'en-US',
  KO_KR = 'ko-KR',
  ZH_CN = 'zh-CN',
  ZH_HK = 'zh-HK',
}
type EnvType = 'mego' | 'memes'
// 常量定义
const locale = { memes, mego }
const env = import.meta.env.MODE.split('-')[1] as EnvType
// 导出配置
export const antdLocale: Record<LocaleCode, typeof enUS> = {
  [LocaleCode.EN_US]: enUS,
  [LocaleCode.KO_KR]: koKR,
  [LocaleCode.ZH_CN]: zhCN,
  [LocaleCode.ZH_HK]: zhHk,
}

export default {
  [LocaleCode.EN_US]: locale[env][LocaleCode.EN_US],
  [LocaleCode.KO_KR]: locale[env][LocaleCode.KO_KR],
  [LocaleCode.ZH_CN]: locale[env][LocaleCode.ZH_CN],
  [LocaleCode.ZH_HK]: locale[env][LocaleCode.ZH_HK],
} as const
