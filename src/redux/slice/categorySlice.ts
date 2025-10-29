import { createSlice } from '@reduxjs/toolkit'
import { fetchCategories } from '../../api/hook/fetchCategories'
import type { GetCategoryItem } from '../../api/type/response/category'

/**
 * カテゴリの状態を管理するスライス
 * @interface CategoryState
 */
type CategoryState = {
  items: GetCategoryItem[]
  loading: boolean
  error: string | null
}

/**
 * カテゴリの初期状態
 * @const initialState
 * @type {CategoryState}
 * @memberof CategoryState
 */
const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
}

/**
 * カテゴリスライス
 * @const categorySlice
 * @type {Slice<CategoryState>}
 * @memberof CategoryState
 */
export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// カテゴリーのリデューサーをエクスポート
export default categorySlice.reducer
