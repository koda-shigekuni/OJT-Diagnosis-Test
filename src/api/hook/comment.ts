import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getComment, postComment } from '../axios/comment'
import type { postCommentRequest } from '../type/request/comment'
import type { commentResponse } from '../type/response/comment'

/**
 * コメント一覧を取得するカスタムフック（React Query）
 *
 * @param {number} contentsId - コメントを取得したいコンテンツのID
 * @param {Pick<UseQueryOptions<commentResponse[], Error>, 'enabled'>} [options] - クエリの有効化オプションなど
 * @returns {ReturnType<typeof useQuery>} React QueryのuseQueryによる結果（データ・ローディング・エラー等）
 *
 * @example
 * const { data, isLoading, isError } = useGetCommentQuery(123)
 */
export const useGetCommentQuery = (
  contentsId: number,
  options?: Pick<UseQueryOptions<commentResponse[], Error>, 'enabled'>
) => {
  return useQuery<commentResponse[], Error>({
    queryKey: ['comments', contentsId],
    queryFn: () => getComment({ contentsId }),
    enabled: options?.enabled ?? true, // デフォルトは有効
    staleTime: 30_000, // 30秒間はキャッシュを使う
  })
}

/**
 * コメントを新規投稿するためのカスタムフック（React Query）
 *
 * @returns {ReturnType<typeof useMutation>} React QueryのuseMutationによる結果（mutate関数、状態等）
 *
 * @example
 * const mutation = usePostCommentMutate()
 * mutation.mutate({ contentsId, commentBody })
 */
export const usePostCommentMutate = () => {
  return useMutation({
    mutationFn: (payload: postCommentRequest) => postComment(payload),
  })
}
