import { createAsyncThunk } from '@reduxjs/toolkit'
import { getCategoriesApi } from '../axios/category'
import type { GetCategoryItem } from '../type/response/category'

/**
 * カテゴリを非同期に取得するアクション
 * @function fetchCategories
 * @returns {Promise<GetCategoryItem[]>} 取得したカテゴリの配列
 * @memberof CategoryState
 */
export const fetchCategories = createAsyncThunk<GetCategoryItem[], void, { rejectValue: string }>(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await getCategoriesApi()
    } catch (err) {
      let msg = 'カテゴリの取得に失敗しました'
      if (err && typeof err === 'object' && 'message' in err) {
        msg = (err as Error).message
      }
      return rejectWithValue(msg)
    }
  }
)
