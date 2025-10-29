/**
 * ユーザ情報のレスポンス
 * @interface User
 */
export type User = {
  /**
   * ユーザID
   * @type {string}
   * @memberof User
   */
  emp_id: string
  /**
   * ユーザの名前
   * @type {string}
   * @memberof User
   */
  emp_name: string
  /**
   * ユーザの画像URL
   * @type {string}
   * @memberof User
   */
  icon_base64: string | null
}

/**
 * ユーザの活動記録レスポンス
 * @interface Actibty
 */
export type Actibty = {
  /**
   * コンテンツの合計
   * @type {number}
   * @memberof Actibty
   */
  content_count: number
  /**
   * ライクの合計
   * @type {number}
   * @memberof Actibty
   */
  total_likes: number
  /**
   * 最終投稿日
   * @type {string}
   * @memberof Actibty
   */
  last_post_date: string
}

/**
 * TOP3コンテンツのレスポンスの型
 * @interface Favorite_Contents
 */
export type Favorite_Contents = {
  /**
   * コンテンツID
   * @type {number}
   * @memberof Favorite_Contents
   */
  id: number
  /**
   * コンテンツのタイトル
   * @type {string}
   * @memberof Favorite_Contents
   */
  title: string
  /**
   * ライクの合計
   * @type {number}
   * @memberof Favorite_Contents
   */
  like_points: number
  /**
   * コメントの合計
   * @type {number}
   * @memberof Favorite_Contents
   */
  comment_points: number
  /**
   * ライクとコメントの合計
   * @type {number}
   * @memberof Favorite_Contents
   */
  total_score: number
}

/**
 * 総レスポンス
 * @interface MypageResponse
 */
export type MypageResponse = {
  /**
   * ユーザ情報のレスポンス
   * @interface User
   */
  user: User
  /**
   * ユーザの活動記録レスポンス
   * @interface Actibty
   */
  actibty: Actibty
  /**
   * TOP3コンテンツのレスポンスの型
   * @interface Favorite_Contents
   */
  favorite_contents: Favorite_Contents[]
}
