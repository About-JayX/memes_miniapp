import { Pair } from '@/api/dex'
import { Ilist } from '@/interface'

export interface Iuser {
  authToken: string
  code: string
  first_name: string
  last_name: string
  token: string
  username: string
  twitterId: string
  twitterUserName: string
  avatar_url: string

  Voted: boolean
  predicted_date: number
  newUser: boolean
}
export interface ITaskOptions {
  uniqueKeys: Array<string>
  data: Array<{
    key: string
    model: string
    amount: string
    is_enabled: number
  }>
}
export interface Iload {
  initLoading: boolean
  globalLoading: boolean
  globalText: string
}
export interface TaskModel {
  Id: number // 模型 ID
  model: string // 模型名称（例如 "reTweet", "likeTweet", "bookmarksTweet"）
  current: number // 当前已完成的数量
  max: number // 最大允许的数量
  reviewMethodId: number // 审核方法 ID
  ifIoear: boolean // 是否为 IOEAR
  type: string // 类型，通常是 "Twitter"
  reward: string // 奖励金额
}

interface TaskUrls {
  TweetId: string // 推文的链接
}

export interface ItaskData {
  Id: number // 帖子 ID
  name: string // 用户名称
  userId: number // 用户 ID
  onwer: string // 帖子的所有者，注意是 "onwer"（可能是拼写错误，应该为 "owner"）
  description: string // 帖子描述（可能包含换行符）
  is_enabled: number // 帖子是否启用，0 或 1，如果是布尔值，可以改为 boolean
  created_at: number // 创建时间的时间戳
  updated_at: number // 更新时间的时间戳
  rewards: string // 奖励金额（如果有精确度需求，可以改为 number）
  pay_amount: string // 支付的金额（同上）
  remaining_amount: string // 剩余金额（同上）
  models: TaskModel[] // 模型数组
  urls: TaskUrls // 包含 URL 信息
  notifyId: number // 通知 ID
  profile_image_url: string // 用户头像 URL
  is_top:number
}

export interface IinviteData {
  userName: string
  avaterUrl: string
  rewardAmount: string
  avatar_url: string
  time: number
}

export interface ISignReward {
  day: number
  signedIn: boolean
}

export interface IsignTask {
  type: string
  day: number
  reward: string
  canClaim: boolean
}

export interface INotify {
  Id: number // 聊天记录的 ID
  userId: number // 用户 ID
  chatId: string // 聊天 ID
  chat_type: string // 聊天类型（例如：supergroup）
  chat_username: string // 聊天用户名
  chat_title: string // 聊天标题
  create_time: number // 创建时间戳
  status: number // 聊天状态
}

export interface IRank {
  rank: number
  score: number
  userId: string
  username: string
  avatar_url: string
}

export interface IPontsDetails {
  amount: string
  time: string
  title: string
  type: number
}

export interface ISignInInfo {
  currentStreak: number
  Dailyrewards: string
  rewards: ISignReward[]
  task: IsignTask[]
  todaySignedIn: boolean
  message: string
  status: boolean
}

export interface IRankPageList<T> extends Ilist {
  total: number
  userRank: IRank
  data: { data: Array<T>; total: number }
}

export interface ItokenData {
  id: number
  address: string
  name: string
  symbol: string
  decimals: number
  chainId: number
  logo: string
  votes: number
  updatedAt: string
  pair: Pair | null
}
export interface ITokenPageList extends Ilist {
  total: number
  data: {
    bases: Array<ItokenData>
    votes: number
  }
}

export interface IFavorite {
  base: ItokenData
}
export interface IPagList<T> extends Ilist {
  total: number
  data: Array<T>
  pollingTimer?: NodeJS.Timeout | null
}
