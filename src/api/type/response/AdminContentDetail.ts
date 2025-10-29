/**
 * 管理画面用コンテンツ詳細のレスポンス型
 */
export type GetAdminContentDetailResponse = {
  /**
   * コンテンツID
   */
  id: number
  /**
   * 投稿者
   */
  content_user: string
  /**
   * コンテンツのタイトル
   */
  title: string
  /**
   * コンテンツの要約
   */
  summary: string
  /**
   * コンテンツの本文
   */
  content: string
  /**
   * 投稿日時
   */
  add_date: string
  /**
   * 更新日時
   */
  upd_date: string
  /**
   * いいね数
   */
  like_count: number
  /**
   * コメント数
   */
  comment_count: number
  /**
   * 表示状態フラグ
   */
  display_type: string
  /**
   * ユーザのアイコン画像
   */
  user_icon: string | null
  /**
   * コンテンツのサムネイル
   */
  image: string | null
  /**
   * カテゴリ名
   */
  category_name: string | null
  /**
   * コンテンツ詳細に投稿されているコメントの配列
   */
  comments: {
    /**
     * コメントID
     */
    id: number
    /**
     * コメント内容
     */
    body: string
    /**
     * 投稿者
     */
    post_user: string
    /**
     * 投稿日時
     */
    post_date: string
    /**
     * コメントのいいね数
     */
    like_count: number
  }[]
}
