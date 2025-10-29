/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import text from '../../../utils/text.json'

/**
 * コンテンツ結果バーのプロパティ
 * @interface Props
 */
type Props = {
  /** フィルタ／検索後の総コンテンツ件数 */
  totalCount: number
  /** 現在表示中の開始番号（1始まり） */
  startNum: number
  /** 現在表示中の終了番号 */
  endNum: number
  /** 右側に表示する任意要素（フィルターアイコンなど） */
  children?: React.ReactNode
}

/**
 * コンテンツ一覧の結果表示バーコンポーネント
 *
 * 検索・絞り込み後の総件数と、現在表示中の範囲を左側に、
 * 右側にはフィルターアイコンなどを配置できる汎用バーです。
 *
 * @param {Props} props
 * @param {number} props.totalCount - 総件数
 * @param {number} props.startNum - 表示開始番号
 * @param {number} props.endNum - 表示終了番号
 * @param {React.ReactNode} [props.children] - 右側表示要素
 */
const ContentResultBar = ({ totalCount, startNum, endNum, children }: Props) => {
  return (
    <div css={resultBarStyle}>
      {/* 左側：総件数と表示範囲 */}
      <div css={resultLeftStyle}>
        <span>
          {totalCount}
          {text.contentResult.totalCount}
        </span>
        <span css={resultCountStyle}>
          {startNum}〜{endNum}
          {text.contentResult.viewCount}
        </span>
      </div>
      {/* 右側：アイコンやボタンなど */}
      <div css={resultRightStyle}>{children}</div>
    </div>
  )
}

export default ContentResultBar

// -------------------------------------
// Emotion スタイル定義
// -------------------------------------

/** コンテナ全体：左右に要素を配置 */
const resultBarStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 24px',
  background: '#ffffff',
  borderBottom: '1px solid #D3D3D3',
  fontWeight: 600,
  fontSize: '1rem',
})

/** 左側エリア：件数と範囲表示 */
const resultLeftStyle = css({
  display: 'flex',
  alignItems: 'center',
  marginTop: '6px',
  gap: '1.5rem',
})

/** 範囲テキスト（開始〜終了）のスタイル */
const resultCountStyle = css({
  fontWeight: 500,
  color: '#585858',
  fontSize: '0.95em',
})

/** 右側エリア：アイコンやフィルターボタン配置 */
const resultRightStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})
