import { configureStore } from '@reduxjs/toolkit'
import adminJudgeReducer from '../redux/slice/adminJudgeSlice'
import categoryReducer from './slice/categorySlice'
/**
 * Reduxのstoreを設定します。
 * 各種Sliceをここで結合します。
 * 追加のSliceを追加する場合は、ここにインポートしてreducerに追加してください。
 * @const store
 * @type {Store}
 * @memberof Redux
 */
export const store = configureStore({
  reducer: {
    adminJudge: adminJudgeReducer,
    category: categoryReducer,
  },
})

// RootStateとAppDispatchの型をエクスポート
export type RootState = ReturnType<typeof store.getState>
// これにより、Reduxのdispatch関数の型が取得できます
export type AppDispatch = typeof store.dispatch
