import classRequest from './classRequest'

export const mainRequest = new classRequest({
  timeout: 50000,
  baseURL: import.meta.env.VITE_API_URL,
})

export const dataRequest = new classRequest({
  timeout: 50000,
  baseURL: import.meta.env.VITE_DATA_API_URL,
})
