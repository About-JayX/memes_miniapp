import 'virtual:svg-icons-register'
import '@/i18n'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from '@/App'
import { store } from '@/store'
import TelegramProvider from './providers/telegram'

// 静态导入样式
const env = import.meta.env.MODE.split('-')[1]
if (env === 'memes') {
  import('@/style/memes/global.scss')
} else if (env === 'minidoge') {
  import('@/style/minidoge/global.scss')
} else {
  import('@/style/mego/global.scss')
}

ReactDOM.createRoot(document.getElementById('root')! as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <TelegramProvider>
          <App />
        </TelegramProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
