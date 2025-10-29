import { type ReactNode, useEffect, useRef } from 'react'

import { fetchCategories } from '../../api/hook/fetchCategories'
import { useAppDispatch, useAppSelector } from '../../redux/store/hook'

/**
 * ラッパーコンポーネントのProps型定義
 * children: このラッパーで囲まれるReactノード（JSX要素など）
 */
type Props = { children: ReactNode }

/**
 * カテゴリ情報をReduxで一度だけ取得するためのWrapperコンポーネント
 *
 * ・Reduxにカテゴリ一覧がなければfetchCategoriesをdispatch
 * ・各ページの親として使うことで多重フェッチを防止
 * ・childrenにはページコンテンツが入る
 */
const CategoryWrapper = ({ children }: Props) => {
  // Reduxのdispatch関数を取得（actionを発行するために使う）
  const dispatch = useAppDispatch()

  const fetchedRef = useRef(false)

  // Reduxストアのカテゴリitems（配列）を取得
  const items = useAppSelector(state => state.category.items)
  // Reduxストアのloading状態（true:取得中/false:未取得or取得済み）を取得
  const loading = useAppSelector(state => state.category.loading)

  /**
   * 初回マウント時・items/dispatch/loadingが変化した時に発火
   * → itemsが空かつloading中でなければカテゴリ一覧をAPIから取得（dispatch）
   * → 2重フェッチ防止のために条件分岐
   */
  useEffect(() => {
    if (!loading && items.length === 0 && !fetchedRef.current) {
      dispatch(fetchCategories())
      fetchedRef.current = true
    }
    // 依存配列には「dispatch, items.length, loading」を入れる
    // items自体を入れると毎回再実行されやすいのでlengthだけ比較
  }, [dispatch, items.length, loading])

  // children（ラップしたい中身）をそのまま表示
  return <>{children}</>
}

export default CategoryWrapper
