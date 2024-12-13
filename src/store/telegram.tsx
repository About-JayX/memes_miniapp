import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { type InitData } from '@telegram-apps/sdk-react'

import api from '@/api'

import { RootState } from '.'
import { Iload, ISignInInfo, ITaskOptions,Iuser } from './interface'
export const asyncUpdateUser = createAsyncThunk(
  'telegram/updateUser',
  async (user: Iuser) => user
)
export const asyncLoading = createAsyncThunk(
  'telegram/loading',
  async (data?: { globalText?: string; callBack?: () => Promise<any> }) => {
    try {
      const result = data?.callBack && (await data?.callBack())
      return result
    } catch (error) {
      console.log(error, 'error_')
      return error
    }
  }
)
export const asynUpdateTaskOptions = createAsyncThunk(
  'telegram/taskOptions',
  async (data?: any) => data
)

export const asyncGetSginin = createAsyncThunk(
  'telegram/getSginin',
  async (_, thunkAPI) => {
    const { telegram } = thunkAPI.getState() as RootState
    try {
      const result: ISignInInfo = await api.sginin.sgininDetailAPI()

      return result
    } catch (error) {
      console.log(error, 'error_')
      return telegram.signInInfo
    }
  }
)
const initialState: {
  initData: InitData | any
  user: Iuser
  signInInfo: ISignInInfo
  load: Iload
  taskOptions: ITaskOptions
  initTask: boolean
  loading: boolean
} = {
  initData: {
    initData: undefined,
    authDate: undefined,
    canSendAfter: undefined,
    canSendAfterDate: undefined,
    chat: undefined,
    chatType: undefined,
    chatInstance: undefined,
    hash: '',
    queryId: undefined,
    receiver: undefined,
    startParam: undefined,
    user: undefined,
  },
  user: {
    avatar_url: '',
    newUser: false,
    predicted_date: 0,
    Voted: true,
    authToken: '',
    code: '',
    first_name: '',
    last_name: '',
    token: '',
    username: '',
    twitterId: '',
    twitterUserName: '',
  },
  signInInfo: {
    Dailyrewards: '10',
    currentStreak: 0,
    rewards: [],
    task: [],
    todaySignedIn: false,
    message: '',
    status: false,
  },
  load: {
    initLoading: true,
    globalLoading: false,
    globalText: '',
  },
  taskOptions: {
    uniqueKeys: [],
    data: [],
  },
  loading: true,
  initTask: false,
}
export const theme = createSlice({
  name: 'telegram',
  initialState,
  reducers: {
    updateInitData(stores, actions) {
      stores.initData = actions.payload
    },
    updateInitTask(stores, actions) {
      stores.initTask = actions.payload
    },
    updateUser(stores, actions) {
      stores.user = actions.payload
    },
    updateLoad(stores, actions: { payload: Iload; type: string }) {
      stores.load = actions.payload
    },
    updateLoading(stores, actions) {
      stores.loading = actions.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(asyncUpdateUser.fulfilled, (state, action) => {
      state.user = action.payload
    })
    builder.addCase(asyncGetSginin.fulfilled, (state, action) => {
      state.signInInfo = action.payload
    })
    builder.addCase(asynUpdateTaskOptions.fulfilled, (state, action) => {
      state.taskOptions = action.payload
    })
    builder
      .addCase(asyncLoading.pending, (state, action) => {
        state.load.globalLoading = true
        state.load.globalText = action.meta.arg?.globalText || ''
      })
      .addCase(asyncLoading.fulfilled, (state, _) => {
        state.load.globalLoading = false
      })
      .addCase(asyncLoading.rejected, (state, _) => {
        state.load.globalLoading = false
      })
  },
})

export const {
  updateInitData,
  updateUser,
  updateLoad,
  updateLoading,
  updateInitTask,
} = theme.actions

export default theme.reducer
