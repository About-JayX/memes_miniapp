/* eslint-disable import/named */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

class classRequest {
  service: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)

    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers.Authorization = sessionStorage.getItem('token') || ''
        return config
      }
    )
    this.service.interceptors.response.use((response: AxiosResponse) => {
      console.log(
        '[search][Request] Response:',
        response.config.url,
        response.data
      )

      // 特殊处理 ranking/pair 和 ranking/search
      if (
        response.config.url?.includes('/ranking/pair') ||
        response.config.url?.includes('/ranking/search')
      ) {
        return response.data
      }

      if (response.data.success) {
        return response.data.data
      }
      return Promise.reject(response.data)
    })
  }

  get(url: string, params?: object): Promise<any> {
    return this.service.get(url, { params })
  }
  post(
    url: string,
    params?: object | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return this.service.post(url, params, config)
  }
  put(url: string, params?: object): Promise<any> {
    return this.service.put(url, params)
  }
  delete(url: string, params?: object): Promise<any> {
    return this.service.delete(url, { params })
  }
}

export default classRequest
