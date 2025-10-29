/**
 * コメント一覧にリクエスト
 * @interface commentRequest
 */
export type commentRequest = {
  /**
   * 紐づくコンテンツID
   * @type {number}
   * @example 1
   */
  contentsId: number
}

/**
 * コメント投稿リクエスト
 * @interface postCommentRequest
 */
export type postCommentRequest = {
  /**
   * アクション
   * @type {string}
   * @example "create"
   */
  action: string
  /**
   * 紐づくコンテンツID
   * @type {number}
   * @example 10
   */
  contentsId: number
  /**
   * コメントID
   * @type {number}
   * @example 1
   */
  commentId: number
  /**
   * コメント内容
   * @type {string}
   * @example "インディゴ"
   */
  commentBody: string
}
