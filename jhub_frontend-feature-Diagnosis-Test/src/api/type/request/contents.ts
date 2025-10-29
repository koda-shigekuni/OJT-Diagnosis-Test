import type { JSONContent } from '@tiptap/core'
import type { SortKey } from '../sortKey'

/**
 * コンテンツ一覧取得リクエストパラメータ
 * @interface GetContentsRequest
 */
export type GetContentsRequest = {
  /**
   * タイトル・投稿者名・カテゴリ名の部分一致検索キーワード
   * @type {string}
   * @memberof GetContentsRequest
   * @example "トレンド"
   */
  likeKw?: string

  /**
   * ページ番号（1始まり）。未指定時は1ページ目を返す
   * @type {number}
   * @memberof GetContentsRequest
   * @default 1
   */
  page_no?: number

  /**
   * 絞り込み対象のカテゴリID。未指定時は全カテゴリ対象
   * @type {number}
   * @memberof GetContentsRequest
   */
  categoryId?: number

  /**
   * 並び順キー
   * - 'new'     新着順（降順）
   * - 'old'     古い順（昇順）
   * - 'mostLiked'    いいね順（降順）
   * - 'mostCommented' コメント順（降順）
   * @type {'new' | 'old' | 'mostLiked' | 'mostCommented'}
   * @memberof GetContentsRequest
   * @default 'new'
   */
  sort?: SortKey
}

/**
 * コンテンツ詳細取得リクエストパラメータ
 * @interface GetContentDetailRequest
 */
export type GetContentDetailRequest = {
  /**
   * 取得対象のコンテンツID
   * @type {number}
   * @memberof GetContentDetailRequest
   */
  id: number
}

/**
 * コンテンツ投稿リクエストパラメータ
 * @interface AddContentsRequest
 */
export type AddContentsRequest = {
  /**
   * コンテンツ投稿の発火パラメータ
   * @type {string}
   * @memberof AddContentsRequest
   * @default 'create'
   */
  action: string

  /**
   *編集用コンテンツID
   * @type {string}
   * @memberof AddContentsRequest
   * @description コンテンツ編集画面と共通のためリクエストに含める編集時以外使用しない。
   * @example 1
   */
  contentsId?: string
  /**
   *コンテンツ内容Json
   * @type {JSONContent}
   * @memberof AddContentsRequest
   * @example {"type":"doc","content":{{"type":"text","text":"TESTCONTENT"}} }
   */
  content: JSONContent

  /**
   * サムネイル及びコンテンツ内画像(null許容)
   * @type {string | null}
   * @memberof AddContentsRequest
   * @example "base64:.../image.png"
   */
  image?: string | null

  /**
   * コンテンツタイトル
   * @type {string}
   * @memberof AddContentsRequest
   * @example "EXAMPLETITLE"
   */
  title: string
  /**
   *コンテンツ要約
   * @type {string}
   * @memberof AddContentsRequest
   * @example "EXAMPLESUMMRY"
   */
  summary: string
  /**
   * カテゴリーID
   * @type {number}
   * @memberof AddContentsRequest
   * @example "1"
   */
  categoryId: number
  /**
   * 公開フラグ
   * @type {number}
   * @memberof AddContentsRequest
   * @default 0
   * @description "下書きの場合は1になります。"
   */
  displayFlag: number
}
/*
  ライクリクエスト
 */
export type LikeContentRequest = {
  /**
   * コンテンツかコメントのID
   */
  targetId: number
  /**
   * 0：コンテンツに対してのライク
   * 1：コメントに対してのライク
   */
  targetType: string
  /**
   * ライク数
   */
  count: number
}
