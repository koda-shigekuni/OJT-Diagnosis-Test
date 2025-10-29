/**
 * 人気コンテンツのレスポンス型
 * @interface GetHomeContentsResponse
 */
export type GetHomeContentsResponse = {
  /**
   * コンテンツID
   * @type {number}
   * @memberof GetHomeContentsResponse
   */
  id: number
  /**
   * 画像URL
   * @type {string}
   * @memberof GetHomeContentsResponse
   * @description 画像URLはオプション項目であり、Nullの場合もあります。
   */
  image?: string

  /**
   * ユーザの画像URL
   * @type {string}
   * @memberof User
   */
  user_icon: string

  /**
   * タイトル
   * @type {string}
   * @memberof GetHomeContentsResponse
   * @description タイトルは必須項目
   * @example "ビンダルゥカレーの基礎"
   */
  title: string

  /**
   * 概要
   * @type {string}
   * @memberof GetHomeContentsResponse
   * @description 概要は必須項目
   * @example "ビンダルゥカレーの作り方を解説します。"
   */
  summary: string

  /**
   * コメント数
   * @type {number}
   * @memberof GetHomeContentsResponse
   * @description コメント数は必須項目
   * @example 8
   */
  comment_count: number

  /**
   * いいね数
   * @type {number}
   * @memberof GetHomeContentsResponse
   * @description いいね数は必須項目
   * @example 5
   */
  favorite_count: number

  /**
   * 注目度スコア
   * @type {number}
   * @memberof GetHomeContentsResponse
   * @description 注目度スコアはオプション項目であり、実際の値はAPIレスポンスに含まれない。
   * @example 85((comment_count * 10) + favorite_count)
   */
  attention_score?: number

  /**
   * 投稿者名
   * @type {string}
   * @memberof GetHomeContentsResponse
   * @description 投稿者名は必須項目
   * @example "浅野琢郎"
   */
  post_name: string

  /**
   * カテゴリ名
   * @type {number}
   * @memberof GetHomeContentsResponse
   * @description カテゴリ名は必須項目
   * @example "カレー"
   */
  category_id: number
}
