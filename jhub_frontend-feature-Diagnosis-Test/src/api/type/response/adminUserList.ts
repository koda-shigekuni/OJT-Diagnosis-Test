export interface AdminUserList {
  /**
   * ユーザID
   * @type {string}
   */
  emp_id: string
  /**
   * ユーザの名前
   * @type {string}
   */
  emp_name: string
  /**
   * 管理者フラグ
   * @type {string}
   */
  is_admin_hub: string
}

export type GetAdminUserList = {
  /**
   * ユーザ一覧情報配列レスポンス
   */
  userList: AdminUserList[]
  /**
   * 検索結果レスポンス
   */
  total_user_count: number
}
