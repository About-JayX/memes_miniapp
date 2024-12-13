import 'virtual:svg-icons-register'
import '@/i18n'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from '@/App'
import { store } from '@/store'

import TelegramProvider from './providers/telegram'

// const env = import.meta.env.MODE.split('-')[1]
// import(`@/style/${env}/global.scss`)

console.log(document.getElementById('root')!, 'ente!!!')

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
