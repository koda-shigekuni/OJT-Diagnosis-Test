/**
 * ユーザ情報取得用レスポンス
 */
export type GetAdminJudge = {
  /**
   * 管理者フラグ
   */
  is_admin_hub: string
  /**
   * ユーザのアイコン
   */
  image: string | null
}
