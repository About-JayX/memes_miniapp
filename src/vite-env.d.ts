/// <reference types="vite/client" />
declare module 'wind' {
  const value: any // 或者更具体的类型
  export default value
}

interface Window {
  Telegram?: {
    WebApp: IWebApp
  }
}
