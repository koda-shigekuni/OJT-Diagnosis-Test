import {
  useMutation,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import { getContentDetail, getContents, postContents, postLike } from '../axios/contents'
import type { AddContentsRequest, GetContentsRequest } from '../type/request/contents'
import type { GetContentDetailResponse, GetContentsListResponse } from '../type/response/contents'
import type { SortKey } from '../type/sortKey'

/**
 * コンテンツ一覧取得用フック
 *
 * @param {string} likeKw - タイトル／投稿者／カテゴリ名の部分一致キーワード（未指定時は空文字）
 * @param {number} page_no - ページ番号（1始まり、未指定時は1）
 * @param {number} [categoryId=0] - 絞り込みカテゴリID（0以下は未指定扱い）
 * @param {'new'|'old'|'mostLiked'|'mostCommented'} [sort='new'] - 並び順キー
 * @returns {UseQueryResult<GetContentsListResponse, Error>} API 結果
 */
export const useGetContentsQuery = (
  likeKw: string,
  page_no: number,
  categoryId: number = 0,
  sort: SortKey
): UseQueryResult<GetContentsListResponse, Error> => {
  // リクエストパラメータをまとめる
  const params: GetContentsRequest = {
    likeKw,
    page_no,
    sort,
    ...(categoryId > 0 ? { categoryId } : {}),
  }

  // React Queryで呼び出し
  return useQuery<GetContentsListResponse, Error>({
    // queryKey に渡した値の組み合わせごとにキャッシュ管理
    queryKey: ['contents', likeKw, page_no, categoryId, sort],
    // queryFn で API 呼び出し
    queryFn: () => getContents(params),
  })
}

/**
 * コンテンツ詳細情報取得API
 * @returns
 *
 */
type Opts = Pick<UseQueryOptions<GetContentDetailResponse>, 'enabled'>
export const useGetContentDetailQuery = (id?: number, opts?: Opts) => {
  return useQuery<GetContentDetailResponse>({
    queryKey: ['contentDetail', id],
    queryFn: () => getContentDetail({ id: id as number }),
    enabled: !!id && (opts?.enabled ?? true),
  })
}

/**
 * コンテンツ投稿API
 * @returns
 */
export const usePostContentsMutate = () => {
  return useMutation({
    mutationFn: (payload: AddContentsRequest) => {
      // --- ✅ 安全対策: 空画像データは送信しない ---
      const refinedPayload = { ...payload }

      if (!refinedPayload.image || refinedPayload.image.trim() === '') {
        delete refinedPayload.image
        console.log('サムネイル画像なしのため送信スキップ')
      }

      return postContents(refinedPayload)
    },
  })
}

export const usePostLikeQuery = () => {
  return useMutation({
    mutationFn: postLike,
  })
}
