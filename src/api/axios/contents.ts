/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../axios'
import { GET_CONTENT_DETAIL, GET_CONTENTS, POST_CONTENTS, POST_LIKE } from '../requesUrl'
import type {
  AddContentsRequest,
  GetContentDetailRequest,
  GetContentsRequest,
  LikeContentRequest,
} from '../type/request/contents'
import type { GetContentDetailResponse, GetContentsListResponse } from '../type/response/contents'

/**
 * コンテンツ一覧取得API
 * @param {GetContentsRequest} params - 検索・絞り込み・ソート・ページングのパラメータ
 * @returns {Promise<GetContentsListResponse>} コンテンツ一覧と総件数
 */
export const getContents = async (params: GetContentsRequest): Promise<GetContentsListResponse> => {
  // --- デフォルト値を適用しつつ、空・未指定のパラメータを省く ---
  const {
    likeKw = '', // キーワード未指定なら空文字
    page_no = 1, // ページ未指定なら 1
    categoryId, // 省略可
    sort = 'new', // ソート未指定なら 'new'
  } = params

  // 実際に送信するクエリオブジェクトを組み立て
  const query: Record<string, string | number> = {
    likeKw,
    page_no,
    sort,
    ...(categoryId && categoryId > 0 ? { categoryId } : {}),
  }

  // GET リクエスト実行
  const response = await api.get<GetContentsListResponse>(GET_CONTENTS, {
    params: query,
  })
  return response.data
}

/**
 * コンテンツ詳細情報取得API
 * @returns
 */
export const getContentDetail = async (params: GetContentDetailRequest) => {
  const response = await api.get<GetContentDetailResponse>(GET_CONTENT_DETAIL, { params })
  return response.data
}

export const postContents = async (body: AddContentsRequest) => {
  try {
    const response = await api.post(POST_CONTENTS, body)
    return response.data
  } catch (err: any) {
    const status = err?.response?.status
    const data = err?.response?.data

    console.error('postContents 失敗:', status, data)
    const msg =
      (typeof data === 'string' && data) ||
      (data?.error && JSON.stringify(data.error)) ||
      'unknown error'
    throw new Error(`${status} ${msg}`)
  }
}

export const postLike = async (params: LikeContentRequest) => {
  const response = await api.post(POST_LIKE, params)
  return response.data
}
