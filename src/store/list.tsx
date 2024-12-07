import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api from '@/api'
import { updatePairsAPI } from '@/api/data'
import { getPairByTokens, Pair, PairsResponse } from '@/api/dex'
import { isTimeExceededByOneMinute } from '@/util'
import { basePair } from '@/util/baseData'

import { RootState } from '.'
import {
  IFavorite,
  IinviteData,
  INotify,
  IPagList,
  IPontsDetails,
  IRank,
  IRankPageList,
  ItaskData,
  ItokenData,
  ITokenPageList,
} from './interface'
import { asyncPollingToken } from './polling'
export const asyncGetTaskList = createAsyncThunk(
  'list/taskList',
  async (data: { page?: number; pageSize?: number }, { getState }) => {
    const { task } = (getState() as RootState).list

    try {
      const taskResult: IPagList<ItaskData> = await api.task.taskListAPI({
        page: data.page ? data.page : task.page,
        pageSize: data.pageSize ? data.pageSize : task.pageSize,
      })
      const o: IPagList<ItaskData> = {
        page: data.page ? data.page + 1 : task.page + 1,
        pageSize: 10,
        data: data.page ? taskResult.data : [...task.data, ...taskResult.data],
        total: taskResult.total,
      }
      return o
    } catch (error) {
      console.log(error, 'error_')
      return task
    }
  }
)

export const asyncRankList = createAsyncThunk(
  'list/rankList',
  async (data: { page?: number; pageSize?: number }, { getState }) => {
    const { ranks } = (getState() as RootState).list

    try {
      const result: IRankPageList<IRank> = await api.user.userPointRank({
        page: data.page ? data.page : ranks.page,
        pageSize: data.pageSize ? data.pageSize : ranks.pageSize,
      })
      if (!data.page) {
        result.data.data = [...ranks.data.data, ...result.data.data]
      }

      const o: IRankPageList<IRank> = {
        page: data.page ? data.page + 1 : ranks.page + 1,
        pageSize: 10,
        data: result.data,
        total: result.total,
        userRank: result.userRank,
      }
      return o
    } catch (error) {
      console.log(error, 'error_')
      return ranks
    }
  }
)
export const asyncSearchList = createAsyncThunk(
  'list/searchList',
  async (data: { page?: number; pageSize?: number }, { getState }) => {
    const { search } = (getState() as RootState).list

    // try {
    //   let result: IRankPageList<IRank> = await api.user.userPointRank({
    //     page: data.page ? data.page : search.page,
    //     pageSize: data.pageSize ? data.pageSize : search.pageSize,
    //   })
    //   if (!data.page) {
    //     result.data.data = [...search.data.data, ...result.data.data]
    //   }

    //   const o: IRankPageList<IRank> = {
    //     page: data.page ? data.page + 1 : search.page + 1,
    //     pageSize: 10,
    //     data: result.data,
    //     total: result.total,
    //     userRank: result.userRank,
    //   }
    //   return o
    // } catch (error) {
    //   console.log(error, 'error_')
    //   return search
    // }
  }
)
export const asyncDetailsList = createAsyncThunk(
  'list/DetailsList',
  async (data: { page?: number; pageSize?: number }, { getState }) => {
    const { points } = (getState() as RootState).list
    try {
      const result: IPagList<IPontsDetails> = await api.user.userPointDetail({
        page: data.page ? data.page : points.page,
        pageSize: data.pageSize ? data.pageSize : points.pageSize,
      })
      const o: IPagList<IPontsDetails> = {
        page: data.page ? data.page + 1 : points.page + 1,
        pageSize: 10,
        data: data.page ? result.data : [...points.data, ...result.data],
        total: result.total,
      }

      return o
    } catch (error) {
      console.log(error, 'error_')
      return points
    }
  }
)
export const asyncFavoritesList = createAsyncThunk(
  'list/FavoritesList',
  async (data: { page?: number; pageSize?: number }, { getState }) => {
    const { favorites } = (getState() as RootState).list
    try {
      const result: IPagList<IFavorite> = await api.favorites.getFavorites({
        page: data.page ? data.page : favorites.page,
        pageSize: data.pageSize ? data.pageSize : favorites.pageSize,
      })
      const o: IPagList<IFavorite> = {
        page: data.page ? favorites.page : favorites.page + 1,
        pageSize: favorites.pageSize,
        data: data.page ? result.data : [...favorites.data, ...result.data],
        total: result.total,
      }

      return o
    } catch (error) {
      console.log(error, 'error_')
      return favorites
    }
  }
)
export const asyncUserTaskList = createAsyncThunk(
  'list/userTaskList',
  async (data: { page?: number; pageSize?: number }, { getState }) => {
    const { userTask } = (getState() as RootState).list
    try {
      const result: IPagList<ItaskData> = await api.task.userTaskAPI({
        page: data.page ? data.page : userTask.page,
        pageSize: data.pageSize ? data.pageSize : userTask.pageSize,
      })
      result.data = result.data.sort((a, b) => a.is_enabled - b.is_enabled)

      const o: IPagList<ItaskData> = {
        page: data.page ? userTask.page : userTask.page + 1,
        pageSize: userTask.pageSize,
        data: data.page ? result.data : [...userTask.data, ...result.data],
        total: result.total,
      }

      return o
    } catch (error) {
      console.log(error, 'error_')
      return userTask
    }
  }
)
export const asyncGetInviteList = createAsyncThunk(
  'list/inviteList',
  async (data: { page?: number; pageSize?: number }, { getState }) => {
    const { invite } = (getState() as RootState).list

    try {
      const inviteResult: IPagList<IinviteData> =
        await api.invite.inviteListAPI({
          page: data.page ? data.page : invite.page,
          pageSize: invite.pageSize,
        })

      const o: IPagList<IinviteData> = {
        page: invite.page + 1,
        pageSize: 10,
        data: data.page
          ? inviteResult.data
          : [...invite.data, ...inviteResult.data],
        total: inviteResult.total,
      }
      return o
    } catch (error) {
      console.log(error, 'error_')
      return invite
    }
  }
)
export const asyncGetTokenList = createAsyncThunk(
  'list/tokenList',
  async (pageData: { page?: number; pageSize?: number }, { getState }) => {
    const { tokens } = (getState() as RootState).list

    try {
      const result: {
        votes: number
        data: Array<ItokenData>
      } = await api.data.tokensAPI({
        page: 1,
        pageSize:
          tokens.page - 1 ? tokens.page * tokens.pageSize : tokens.pageSize,
      })
      let parsePairs = result.data.map(item => {
        item.pair = item.pair
          ? JSON.parse(item.pair as unknown as string)
          : item.pair
        return item
      })

      // 构建需要请求pair的列表
      const requestPairs: Array<Promise<PairsResponse>> = parsePairs
        .slice(
          (tokens.page - 1) * tokens.pageSize,
          tokens.page * tokens.pageSize + 1
        )
        .filter(item => {
          return (
            !item.pair || isTimeExceededByOneMinute(item.pair.timestamp || 0)
          )
        })
        .map(item => getPairByTokens(item.address))

      const pairs = (await Promise.all(requestPairs)).reduce(
        (acc: { [key: string]: Pair | undefined }, pairs: PairsResponse) => {
          const tokenAddress = pairs.address
          const maxPair =
            pairs &&
            pairs.pairs?.reduce((result: Pair, pair: Pair) => {
              if (pair && pair.baseToken.address === tokenAddress) {
                return (result.fdv || 0) > (pair.fdv || 0) ? result : pair
              }
              return result
            }, basePair.pair)
          maxPair && (acc[tokenAddress] = maxPair)
          return acc
        },
        {}
      )
      const updatePairs = Object.values(pairs)
      if (updatePairs.length) {
        const timestamp = new Date().getTime()
        // 更新列表数据
        parsePairs = parsePairs.map(item => {
          const o = updatePairs.find(
            pair => pair?.baseToken.address === item.address
          )
          if (!o) return item

          item.pair = o
          return item
        })
        updatePairsAPI(updatePairs.map(item => ({ ...item, timestamp })))
      }

      const o: ITokenPageList = {
        page: tokens.page + 1,
        pageSize: tokens.pageSize,
        data: {
          bases: parsePairs,
          votes: result.votes,
        },
        total: 99999,
      }
      return o
    } catch (error) {
      console.log(error, 'error_')
      return tokens
    }
  }
)
export const asyncNotifyList = createAsyncThunk(
  'list/notifyList',
  async (_, { getState }) => {
    const { notifys } = (getState() as RootState).list
    try {
      const result: { code: string; data: { data: Array<INotify> } } =
        await api.user.notifysAPI()

      return result.data
    } catch (error) {
      return notifys
    }
  }
)
export const asyncUploadTimeOut = createAsyncThunk(
  'list/timeout',
  async (timer: NodeJS.Timeout | null) => {
    return timer
  }
)
export const list = createSlice({
  name: 'list',
  initialState: {
    task: {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
    },
    search: [],
    userTask: {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
    },
    invite: {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
    },
    points: {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
    },
    tokens: {
      page: 1,
      pageSize: 30,
      total: 99999,

      data: {
        bases: [],
        votes: 0,
      },
    },
    ranks: {
      page: 1,
      pageSize: 10,
      total: 0,
      data: { data: [], total: 0 },
      userRank: {
        avatar_url: '',
        rank: 1,
        score: 1,
        userId: '',
        username: '',
      },
    },
    favorites: {
      page: 1,
      pageSize: 10,
      total: 0,
      data: [],
    },
    notifys: {
      data: [],
    },
  } as {
    search: Array<ItokenData>
    task: IPagList<ItaskData>
    invite: IPagList<IinviteData>
    tokens: ITokenPageList
    points: IPagList<IPontsDetails>
    ranks: IRankPageList<IRank>
    favorites: IPagList<IFavorite>
    userTask: IPagList<ItaskData>
    notifys: { data: Array<INotify> }
  },

  reducers: {
    updateToken: (state, action) => {
      state.tokens = action.payload
    },
    updateSearchs: (state, action) => {
      state.search = action.payload
    },
    updateTasks: (state, action) => {
      state.task.data = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(asyncGetTaskList.fulfilled, (state, action) => {
      state.task = action.payload
    })
    builder.addCase(asyncGetInviteList.fulfilled, (state, action) => {
      state.invite = action.payload
    })
    builder.addCase(asyncGetTokenList.fulfilled, (state, action) => {
      state.tokens = action.payload
    })
    builder.addCase(asyncRankList.fulfilled, (state, action) => {
      state.ranks = action.payload
    })
    builder.addCase(asyncDetailsList.fulfilled, (state, action) => {
      state.points = action.payload
    })
    builder.addCase(asyncFavoritesList.fulfilled, (state, action) => {
      state.favorites = action.payload
    })
    builder.addCase(asyncUserTaskList.fulfilled, (state, action) => {
      state.userTask = action.payload
    })
    builder.addCase(asyncNotifyList.fulfilled, (state, action) => {
      state.notifys = action.payload
    })
    builder.addCase(asyncPollingToken.fulfilled, (state, action) => {
      state.tokens = action.payload
    })
  },
})

export const { updateToken, updateSearchs, updateTasks } = list.actions

export default list.reducer
