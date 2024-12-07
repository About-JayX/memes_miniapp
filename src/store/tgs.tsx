/* eslint-disable no-empty-pattern */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import getTgs from '@/util/getTgs'

const initialState: {
  tgs: Array<{ name: string; data: any }>
} = {
  tgs: [],
}
export const asyncUploadTgs = createAsyncThunk('tgs/uploadTgs', async () => {
  let result: Array<{ name: string; data: any }> = []
  try {
    result = (await getTgs()) as Array<{ name: string; data: any }>
  } catch (error) {
    console.log(error, 'error_')
  }
  return result
})
export const tgs = createSlice({
  name: 'tgs',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(asyncUploadTgs.fulfilled, (state, action) => {
      state.tgs = action.payload
    })
  },
})

export const {} = tgs.actions

export default tgs.reducer
