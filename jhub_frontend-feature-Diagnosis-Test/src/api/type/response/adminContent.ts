/**
 * 管理画面用コンテンツ一覧の各アイテム型
 */
export interface AdminContentItem {
  /**
   * コンテンツID
   */
  content_id: number

  /**
   * 表示状態（0: 表示中, 1: 非表示）
   */
  display_type: number

  /**
   * コンテンツタイトル
   */
  contents_title: string

  /**
   * カテゴリID
   */
  category_id: number

  /**
   * 投稿者名
   */
  post_user: string

  /**
   * 登録日（文字列）
   */
  add_date: string
  /**
   * 最終更新日時（文字列）
   */
  last_update_date: string

  /**
   * コンテンツの総件数（一覧全体の件数）
   */
  total_contents_count: number
}

/**
 * 管理画面用コンテンツ一覧APIのレスポンス型
 */
export type GetAdminContentsResponse = {
  /**
   * コンテンツ一覧データ配列
   */
  items: AdminContentItem[]

  /**
   * コンテンツ総件数
   */
  total_contents_count: number
}
