export type MyContents = {
  /**
   * コンテンツID
   */
  content_id: number
  /**
   * 最終更新日
   */
  last_post_date: string
  /**
   * コンテンツタイトル
   */
  title: string
  /**
   * コンテンツ要約
   */
  summary: string
  /**
   * コメント数
   */
  comment_count: number
  /**
   * いいね数
   */
  like_count: number
  /**
   * カテゴリ名
   */
  category_name: string
}
export type CountContents = {
  /**
   * コンテンツ総数
   */
  total_contents_count: number
}

/**
 * レスポンス定義
 */
export type MyContentsResponse = {
  myContents: MyContents[]
  contents_count: CountContents
}
