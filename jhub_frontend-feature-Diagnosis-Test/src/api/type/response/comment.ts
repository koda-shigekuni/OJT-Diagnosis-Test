/**
 * コメント一覧APIレスポンス型
 * @interface commentResponse
 */
export type commentResponse = {
  /**
   * コメント固有ID
   * @type {number}
   * @example 1
   */
  id: number

  /**
   * 紐づくコンテンツID
   * @type {number}
   * @example 10
   */
  contentsId: number

  /**
   * コメント本文
   * nullの場合は本文なし
   * @type {string | null}
   * @example "とても参考になりました！"
   */
  body: string | null

  /**
   * 投稿者の表示名
   * @type {string}
   * @example "情創 太郎"
   */
  postUser: string

  /**
   * 投稿者ID
   * @type {string}
   * @example 1
   */
  postUserId: string

  /**
   * 投稿者アイコン
   * @type {string | null}
   * @example "data:image/png;base64,...."
   */
  userIcon: string | null

  /**
   * コメント投稿日時（yyyy/MM/dd形式）
   * @type {string}
   * @example "2025/09/11"
   */
  addDate: string

  /**
   * コメント更新日時（yyyy/MM/dd形式）
   * 更新されていなければnull
   * @type {string | null}
   * @example "2025/09/11"
   */
  updDate: string | null

  /**
   * このコメントへのいいね数
   * @type {number}
   * @example 3
   */
  favoriteCount: number
  comment_like_flag: number
}
