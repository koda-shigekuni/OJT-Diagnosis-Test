/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../axios'
import { GET_COMMENTS, POST_COMMENT } from '../requesUrl'
import type { commentRequest, postCommentRequest } from '../type/request/comment'
import type { commentResponse } from '../type/response/comment'

/**
 * コメント一覧を取得するAPIリクエスト
 * @param {commentRequest} params - コメント取得のためのリクエストパラメータ（contentsId など）
 * @returns {Promise<commentResponse[]>} - コメントレスポンス配列（コメント一覧）
 */
export const getComment = async (params: commentRequest): Promise<commentResponse[]> => {
  const response = await api.get<commentResponse[]>(GET_COMMENTS, { params })
  return response.data
}

/**
 * コメントを新規投稿するAPIリクエスト
 * @param {postCommentRequest} body - 投稿内容（contentsId、コメント本文など）
 * @returns {Promise<any>} - 成功時はAPIレスポンス、失敗時はエラーをスロー
 * @throws {Error} - HTTPエラーやネットワークエラー時にエラーメッセージを含むErrorをスロー
 */
export const postComment = async (body: postCommentRequest) => {
  try {
    const response = await api.post(POST_COMMENT, body)
    return response.data
  } catch (err: any) {
    const status = err?.response?.status
    const data = err?.response?.data

    // エラー内容をconsoleに出力
    console.error('postContents 失敗:', status, data)

    // エラーメッセージ組み立て
    const msg =
      (typeof data === 'string' && data) ||
      (data?.error && JSON.stringify(data.error)) ||
      'unknown error'
    throw new Error(`${status} ${msg}`)
  }
}
