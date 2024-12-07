import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import theme from '@/store/theme'

import list from './list'
import polling from './polling'
import telegram from './telegram'
import tgs from './tgs'
const rootReducer = combineReducers({
  theme,
  telegram,
  list,
  tgs,
  polling,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
