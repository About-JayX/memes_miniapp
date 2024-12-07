interface Model {
  model: string
  reviewMethodId: number
  value: string
  current: number
  max: string // 根据示例中的 "max": "5" 推测 max 应该是字符串类型
}

export interface IPublishTaskDetails {
  status: boolean
  iv: string
  models: Model[]
  pay_amount: number
  task: {
    name: string
    userId: number
    notify: string | null // 因为 notify 可能为 null
    onwer: string // 可能是拼写错误，建议改为 "owner"
    description: string
    is_enabled: number // 如果是布尔值，建议改为 boolean
    rewards: number // 如果 rewards 是数字，可以改为 number
    pay_amount: number
    urls: {
      TweetId: string
    }
  }
  message: string
}
