import { useQuery } from '@tanstack/react-query'
import { getCategoriesApi } from '../axios/category'
import type { CategoryResponse } from '../type/response/category'

/**
 * カテゴリ一覧取得用のカスタムHook
 * - React Query を使用してカテゴリデータをフェッチし、キャッシュ管理を行う
 */
export const useGetCategoriesQuery = () => {
  return useQuery<CategoryResponse, Error>({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
  })
}
