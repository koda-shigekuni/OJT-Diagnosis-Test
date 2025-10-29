import api from '../axios'
import { GET_CATEGORY } from '../requesUrl'
import type { CategoryResponse, GetCategoryItem } from '../type/response/category'

/**
 * カテゴリ一覧を取得するAPI
 * @returns カテゴリ配列
 */
export const getCategoriesApi = async (): Promise<GetCategoryItem[]> => {
  const { data } = await api.get<CategoryResponse>(GET_CATEGORY)
  return data
}
