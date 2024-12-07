import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api from '@/api'
import { updatePairsAPI } from '@/api/data'
import { getPairByTokens, Pair, PairsResponse } from '@/api/dex'
import { isTimeExceededByOneMinute } from '@/util'
import { basePair } from '@/util/baseData'

import { RootState } from '.'
import { ItokenData, ITokenPageList } from './interface'

const initialState: {
  itemRefs: Array<any>
  timer: NodeJS.Timeout | null
} = {
  itemRefs: [],
  timer: null,
}
export const asyncPollingToken = createAsyncThunk(
  'polling/pollingToken',
  async (index: number, { getState }) => {
    const { tokens } = (getState() as RootState).list

    const start: number =
      index - tokens.pageSize / 2 < 0 ? 0 : index - tokens.pageSize / 2
    const end: number = index + tokens.pageSize / 2

    try {
      const result: {
        votes: number
        data: Array<ItokenData>
      } = await api.data.tokensAPI({
        page: 1,
        pageSize:
          tokens.page - 1
            ? (tokens.page - 1) * tokens.pageSize
            : tokens.pageSize,
      })
      let parsePairs = result.data.map(item => {
        item.pair = item.pair
          ? JSON.parse(item.pair as unknown as string)
          : item.pair
        return item
      })

      // 构建需要请求pair的列表
      const requestPairs: Array<Promise<PairsResponse>> = parsePairs
        .slice(start, end)
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
        page: tokens.page,
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
export const list = createSlice({
  name: 'polling',
  initialState,
  reducers: {
    updateItemRefs: (state, action) => {
      const index = action.payload.index
      const el = action.payload.el
      state.itemRefs[index] = el
    },
    updateTimer: (state, action) => {
      state.timer = action.payload
    },
  },
  extraReducers: () => {},
})

export const { updateItemRefs, updateTimer } = list.actions

export default list.reducer
