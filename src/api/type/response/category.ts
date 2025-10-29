/**
 * カテゴリー取得レスポンス
 * @interface GetCategoryItem
 */
export type GetCategoryItem = {
  /**
   *カテゴリーID
   *@type {number}
   *@memberof getCategoryResponce
   *@example 4
   */
  id: number
  /**
   *カテゴリー名
   *@type {string}
   *@memberof getCategoryResponce
   *@example クリリンの園芸ライフ
   */
  label: string

  /**
   *カテゴリーカラー
   *@type {string}
   *@memberof getCategoryResponce
   *@example '#198589'
   */
  colorCode: string
}

// サーバーから配列で返却
export type CategoryResponse = GetCategoryItem[]
