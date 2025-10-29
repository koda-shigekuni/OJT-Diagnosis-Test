import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AdminComentDelete,
  AdminContentDisplayChange,
  getAdminContents,
  getAdminContentsDetail,
} from '../../api/axios/adminContent'
import type { GetAdminContentsResponse } from '../type/response/adminContent'

/**
 * 検索パラメータ
 */
type Params = {
  status: string
  title: string
  empName: string
  categoryId?: string
}

/**
 * コンテンツ一覧情報取得API
 * @returns
 */
export const useGetAdminContentsQuery = (params: Params) =>
  useQuery<GetAdminContentsResponse, Error>({
    queryKey: ['adminContents', params],
    queryFn: () => getAdminContents(params),
  })

/**
 * コンテンツ詳細取得API
 * @param contents_id
 * @returns
 */
export const useGetAdminContentsDetailQuery = (contents_id: number) => {
  return useQuery({
    queryKey: ['adminContentsDetail', contents_id], // ← ID を含める
    queryFn: () => getAdminContentsDetail({ contents_id }),
    staleTime: 0,
    gcTime: 0,
    placeholderData: undefined, // 前のデータを使わない
  })
}

/**
 * コンテンツ掲載ステータス切り替えAPI
 * @returns
 */
export const useContentDisplayChange = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: AdminContentDisplayChange,
    onSuccess: () => {
      // 詳細を再取得
      queryClient.invalidateQueries({ queryKey: ['adminContents'] })
      queryClient.invalidateQueries({ queryKey: ['adminContentsDetail'] })
    },
  })
}

/**
 * コメント論理削除API
 * @returns
 */
export const useCommentDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: AdminComentDelete,
    onSuccess: () => {
      // 詳細を再取得
      queryClient.invalidateQueries({ queryKey: ['adminContents'] })
      queryClient.invalidateQueries({ queryKey: ['adminContentsDetail'] })
    },
  })
}
