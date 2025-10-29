/**
 * コンテンツ一覧取得レスポンス（アイテム単位）
 * @interface GetContentsItem
 */
export type GetContentsItem = {
  /**
   * コンテンツ固有ID
   * @type {number}
   * @memberof GetContentsItem
   * @example 1
   */
  id: number

  /**
   * 画像URL
   * @type {string}
   * @memberof GetContentsItem
   * @description 画像はオプションであり、Nullの場合もあります。
   * @example "base64:.../image.png"
   */
  image: string

  /**
   * ユーザーアイコンURL
   * @type {string}
   * @memberof GetContentsItem
   * @description アイコン画像はオプションであり、Nullの場合もあります。
   * @example "base64:.../image.png"
   */
  userIcon: string

  /**
   * タイトル
   * @type {string}
   * @memberof GetContentsItem
   * @example "TESTTITLE"
   */
  title: string

  /**
   * 概要文
   * @type {string}
   * @memberof GetContentsItem
   * @example "寝方を間違えるとこんなことになります。"
   */
  summary: string

  /**
   * 投稿日時
   * @type {string}
   * @memberof GetContentsItem
   * @example "1985-08-09"
   */
  addDate: string

  /**
   * コメント数
   * @type {number}
   * @memberof GetContentsItem
   * @example 26
   */
  commentCount: number

  /**
   * いいね数
   * @type {number}
   * @memberof GetContentsItem
   * @example 13
   */
  favoriteCount: number

  /**
   * 投稿者名
   * @type {string}
   * @memberof GetContentsItem
   * @example "麻野卓郎"
   */
  postName: string

  /**
   * カテゴリーID
   * @type {number}
   * @memberof GetContentsItem
   * @example "1"
   */
  categoryId: number
}

/**
 * コンテンツ一覧取得レスポンス全体
 * @interface GetContentsListResponse
 */
export type GetContentsListResponse = {
  /**
   * コンテンツアイテム配列
   * @type {GetContentsItem[]}
   * @memberof GetContentsListResponse
   */
  items: GetContentsItem[]

  /**
   * フィルタ後の総件数
   * @type {number}
   * @memberof GetContentsListResponse
   * @example 60
   */
  totalCount: number
}

/**
 * コンテンツ詳細画面のAPIレスポンス型
 * @interface GetContentDetailResponse
 */
export type GetContentDetailResponse = {
  /**
   * コンテンツ固有ID
   * @type {number}
   * @memberof GetContentDetailResponse
   * @example 1
   */
  id: number

  /**
   * カテゴリーID
   * @type {number}
   * @memberof GetContentDetailResponse
   * @example 1
   */
  categoryId: number

  /**
   * 画像(サムネイル・本文)
   * 空文字の場合は画像無し
   * @type {string}
   * @memberof GetContentDetailResponse
   * @example "data:image/png;base64,...."
   */
  image: string

  /**
   * 投稿者のアイコン画像
   * @type {string | null}
   * @memberof GetContentDetailResponse
   * @example "data:image/png;base64,...."
   */
  userIcon: string | null

  /**
   * タイトル
   * @type {string}
   * @memberof GetContentDetailResponse
   * @example "新機能リリースのお知らせ"
   */
  title: string

  /**
   * 要約
   * @type {string}
   * @memberof GetContentDetailResponse
   * @description 編集機能で必須になるためレスポンスに記述、詳細では表示させない。
   * @example "この度既存案件にて新機能を追加しました。"
   */
  summary: string

  /**
   * 本文リッチテキスト
   * @type {JSON}
   * @memberof GetContentDetailResponse
   */
  content: JSON

  /**
   * 登録日（yyyy/MM/dd形式）
   * @type {string}
   * @memberof GetContentDetailResponse
   * @example "2025/09/11"
   */
  addDate: string

  /**
   * 更新日（yyyy/MM/dd形式）
   * @type {string}
   * @memberof GetContentDetailResponse
   * @example "2025/09/11"
   */
  updDate: string

  /**
   * コメント数
   * @type {number}
   * @memberof GetContentDetailResponse
   * @example 5
   */
  commentCount: number

  /**
   * いいね数
   * @type {number}
   * @memberof GetContentDetailResponse
   * @example 10
   */
  favoriteCount: number

  /**
   * 投稿者名
   * @type {string}
   * @memberof GetContentDetailResponse
   * @example "情創 太郎"
   */
  postUser: string

  /**
   * 投稿者ID
   * @type {string}
   * @memberof GetContentDetailResponse
   * @example 'js000'
   * @description 編集ボタン判定用に返しています。
   */
  addTancd: string
  /**
   * コンテンツのいいねフラグ
   * @default 0
   */
  content_like_flag: 0 | 1
}

export type PostLikeResponse = {
  success: boolean
  totalCount?: number
}
