/**
 * 管理画面用カテゴリ一覧の各アイテム型
 */
export type GetAdminCategory = {
  /**
   * カテゴリID
   */
  category_id: number
  /**
   * 表示判定フラグ
   */
  display_type: number
  /**
   * カテゴリの名前
   */
  category_name: string
  /**
   * 最終更新日
   */
  last_post_date: string
}

/**
 * 管理画面用カテゴリ一覧APIのレスポンス型
 */
export type GetAdminCategoryRespose = {
  /**
   * カテゴリ一覧データ配列
   */
  categories: GetAdminCategory[]
  /**
   * コンテンツ総件数
   */
  total_count: number
}
