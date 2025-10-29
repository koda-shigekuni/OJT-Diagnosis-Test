/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Pagination } from '@mui/material'

/**
 * ページネーション用コンポーネントの Props
 * @interface Props
 */
type Props = {
  /** 現在表示中のページ番号 */
  page: number
  /** ページ番号を更新する関数 */
  setPage: (n: number) => void
  /** 総ページ数 */
  pageCount: number
}

/**
 * コンテンツ一覧ページ用ページネーション
 *
 * ページ数が 1 以下の場合は何も表示しません。
 * @param {Props} props
 * @param {number} props.page - 現在のページ番号
 * @param {(n: number) => void} props.setPage - ページ変更ハンドラ
 * @param {number} props.pageCount - 総ページ数
 */
const ContentPagination = ({ page, setPage, pageCount }: Props) => {
  // ページ数が 1 以下ならページネーション自体を非表示
  if (pageCount <= 1) return null

  return (
    <Pagination
      count={pageCount} // 総ページ数
      page={page} // 現在のページ番号
      onChange={(_, value) => setPage(value)} // ページ変更時のコールバック
      hidePrevButton // 「前へ」ボタンを非表示
      hideNextButton // 「次へ」ボタンを非表示
      shape="rounded" // 角丸デザイン
      boundaryCount={1} // 始端／終端のページ番号個数
      siblingCount={1} // 現在ページ前後のページ番号個数
      css={paginationStyle} // Emotion スタイル適用
    />
  )
}

export default ContentPagination

// --- Emotion スタイル定義 ---
const paginationStyle = css({
  // ページネーション上下のマージンと中央寄せ
  marginTop: 16,
  marginBottom: 16,
  display: 'flex',
  justifyContent: 'center',

  // ページ番号アイテム共通スタイル
  '& .MuiPaginationItem-root': {
    borderRadius: 8, // 角丸
    border: '1px solid #808080', // 枠線
    color: '#808080', // テキスト色
    fontWeight: 'bold', // 太字
  },

  // ホバー時の背景色
  '& .MuiPaginationItem-root:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },

  // 選択中アイテムのスタイル
  '& .MuiPaginationItem-root.Mui-selected': {
    backgroundColor: '#ECC5F5', // 選択時の背景色
    color: '#FFF', // 選択時の文字色
    borderColor: '#ECC5F5', // 選択時の枠線色
    '&:hover': {
      backgroundColor: '#ECC5F5', // ホバー時も同じ背景色
    },
  },
})
