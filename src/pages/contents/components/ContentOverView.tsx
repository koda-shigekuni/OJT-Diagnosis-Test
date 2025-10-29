/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import CloseIcon from '@mui/icons-material/Close'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FolderCopyIcon from '@mui/icons-material/FolderCopy'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import ListIcon from '@mui/icons-material/List'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { FormControl, IconButton, MenuItem, Select } from '@mui/material'
import Switch from '@mui/material/Switch'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { SortKey } from '../../../api/type/sortKey'
import type { RootState } from '../../../redux/store'
import text from '../../../utils/text.json'

/**
 * コンポーネントに渡すプロパティの型定義
 */
type OverviewProps = {
  /** 現在選択中のカテゴリキー */
  category: string
  /** カテゴリを更新する関数 */
  setCategory: (v: string) => void
  /** 現在選択中のソートキー */
  sort: SortKey
  /** ソートキーを更新する関数 */
  setSort: (v: SortKey) => void
  /** モーダルを閉じるハンドラ */
  onClose: () => void
}

/**
 * カテゴリIDに応じてアイコンを返す関数
 */
const getCategoryIcon = (id: number) => {
  switch (id) {
    case 1:
      return <FolderCopyIcon sx={{ fontSize: 34 }} />
    case 2:
      return <InsertDriveFileIcon sx={{ fontSize: 34 }} />
    case 3:
      return <ShowChartIcon sx={{ fontSize: 34 }} />
    default:
      return <FolderCopyIcon sx={{ fontSize: 34, color: '#aaa' }} />
  }
}

/**
 * ContentOverviewコンポーネント
 * - コンテンツ一覧のフィルター／ソート設定を行うモーダル
 * - カテゴリ情報をReduxから取得
 */
const ContentOverview = ({ category, setCategory, sort, setSort, onClose }: OverviewProps) => {
  // Reduxストアからカテゴリ一覧（id, label, colorCode）を取得
  const categories = useSelector((state: RootState) => state.category.items)

  // カテゴリ機能のON/OFF状態を管理
  const [categoryActive, setCategoryActive] = useState(true)
  // ソート機能のON/OFF状態を管理
  const [sortActive, setSortActive] = useState(true)

  /**
   * カテゴリON/OFF切り替え処理
   * OFFにした際にはカテゴリ選択をクリアする
   */
  const handleCategoryToggle = () => {
    setCategoryActive(prev => {
      const next = !prev
      if (!next) {
        setCategory('') // OFF時はカテゴリ選択をリセット
      }
      return next
    })
  }

  /**
   * ソートON/OFF切り替え処理
   * OFFにした際にはソートを「新着順」に戻す
   */
  const handleSortToggle = () => {
    setSortActive(prev => {
      const next = !prev
      if (!next) {
        setSort('new') // OFF時はデフォルトのnewにリセット
      }
      return next
    })
  }

  return (
    <div css={wrapStyle}>
      {/* ヘッダー：タイトルとクローズボタン */}
      <div css={headerRowStyle}>
        <div css={headerTitleStyle}>{text.contentOverView.title}</div>
        <IconButton size="small" onClick={onClose} css={closeButtonStyle}>
          <CloseIcon />
        </IconButton>
      </div>

      {/* 本体：カテゴリ設定セクションとソート設定セクション */}
      <div css={innerStyle}>
        {/* ===== カテゴリ設定 ===== */}
        <div css={sectionStyle}>
          {/* セクションヘッダー：アイコン・ラベル・スイッチ */}
          <div css={sectionHeaderStyle}>
            <FilterAltIcon fontSize="small" css={sectionIconStyle} />
            <span>{text.contentOverView['category.label']}</span>
            <Switch
              checked={categoryActive}
              onChange={handleCategoryToggle}
              color="default"
              size="small"
              css={switchStyle}
            />
          </div>
          {/* カテゴリカードのリスト */}
          <div css={cardRowStyle}>
            {categories.map(c => (
              <button
                key={c.id}
                type="button"
                css={[catCardStyle, category === String(c.id) && catCardActiveStyle]}
                onClick={() => setCategory(category === String(c.id) ? '' : String(c.id))}
                disabled={!categoryActive}
              >
                <span css={catCardIcon}>{getCategoryIcon(c.id)}</span>
                <span css={catCardLabel}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ===== ソート設定 ===== */}
        <div css={sectionStyle}>
          {/* セクションヘッダー：アイコン・ラベル・スイッチ */}
          <div css={sectionHeaderStyle}>
            <ListIcon fontSize="small" css={sectionIconStyle} />
            <span>{text.contentOverView['content.sort']}</span>
            <Switch
              checked={sortActive}
              onChange={handleSortToggle}
              color="default"
              size="small"
              css={switchStyle}
            />
          </div>
          {/* ソート順選択用ドロップダウン */}
          <FormControl size="small" css={sortSelectWrapStyle}>
            <Select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              disabled={!sortActive}
              displayEmpty
              css={sortSelectStyle}
            >
              <MenuItem value="new">{text.contentOverView['sort.new']}</MenuItem>
              <MenuItem value="old">{text.contentOverView['sort.old']}</MenuItem>
              <MenuItem value="mostLiked">{text.contentOverView['sort.like']}</MenuItem>
              <MenuItem value="mostCommented">{text.contentOverView['sort.comment']}</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  )
}

export default ContentOverview

// --- スタイル定義 --- //

/** モーダル全体のラッパー */
const wrapStyle = css({
  width: 745,
  height: 600,
  background: '#fff',
  borderRadius: 0,
  boxShadow: 'none',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  boxSizing: 'border-box',
})

/** ヘッダー行：タイトルを中央に配置し、右上に閉じるボタン */
const headerRowStyle = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: '28px 24px 28px',
  borderBottom: '2px solid #ededed',
})

/** ヘッダータイトルのスタイル */
const headerTitleStyle = css({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '2.1rem',
  fontFamily: '"Dela Gothic One", sans-serif',
  letterSpacing: 1.5,
})

/** 閉じるボタンのスタイル */
const closeButtonStyle = css({
  position: 'absolute',
  right: 18,
  top: '50%',
  transform: 'translateY(-50%)',
  padding: 4,
  color: '#000',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
})

/** 本体領域：上下に余白をとり、縦並び */
const innerStyle = css({
  padding: '28px 0 0',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 38,
})

/** セクション共通ラッパー（カテゴリ／ソート） */
const sectionStyle = css({
  width: '100%',
  maxWidth: 620,
  margin: '0 auto',
})

/** セクションヘッダー：アイコン・テキスト・スイッチを横並び */
const sectionHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  fontSize: '1.25rem',
  fontWeight: 700,
  marginBottom: 12,
  marginTop: 4,
  color: '#181818',
})

/** セクション内のアイコンスタイル */
const sectionIconStyle = css({
  color: '#222',
  fontSize: 22,
  display: 'flex',
  alignItems: 'center',
})

/** スイッチのカスタムスタイル */
const switchStyle = css({
  width: 48,
  height: 28,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(20px)', // ON時にツマミを右へ移動
      '& + .MuiSwitch-track': {
        backgroundColor: '#86F030', // ON時のトラック色
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 24,
    height: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 14,
    backgroundColor: '#ccc',
    opacity: 1,
  },
})

/** カテゴリカードを横並びするラッパー */
const cardRowStyle = css({
  display: 'flex',
  gap: 28,
  justifyContent: 'left',
})

/** カテゴリカードの基本スタイル */
const catCardStyle = css({
  background: '#f7f7f7',
  borderRadius: 18,
  border: 'none',
  minWidth: 113,
  height: 116,
  cursor: 'pointer',
  padding: '16px 8px 10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  outline: 'none',
  boxShadow: 'none',
  fontWeight: 700,
  fontSize: '1.15rem',
  letterSpacing: '0.04em',
  transition: 'box-shadow .18s, background .15s',
  borderBottom: '4px solid transparent',
  '&:hover:not(:disabled)': {
    boxShadow: '0 4px 12px rgba(255,191,80,0.12)',
    background: '#ffe0a0',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'default',
  },
})

/** 選択中のカテゴリカードに適用するスタイル */
const catCardActiveStyle = css({
  background: '#ffc862',
  borderBottom: '4px solid #fbc02d',
})

/** カテゴリカード内のアイコンスタイル */
const catCardIcon = css({
  fontSize: 38,
  marginBottom: 4,
  color: '#222',
})

/** カテゴリカード内のラベルスタイル */
const catCardLabel = css({
  fontSize: '1rem',
  marginTop: 4,
})

/** ソート選択ドロップダウンを中央配置するラッパー */
const sortSelectWrapStyle = css({
  margin: '18px auto 0',
  minWidth: 260,
  display: 'flex',
  justifyContent: 'center',
})

/** ソートセレクト本体のスタイル */
const sortSelectStyle = css({
  background: '#fff',
  borderRadius: 8,
  width: 260,
})
