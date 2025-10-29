/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Box, Typography } from '@mui/material'
import defaultImage from '../../../assets/NOIMAGE.png'

/**
 * コンテンツ一覧用スケルトンアイテム
 *
 * データ読み込み中にプレースホルダーとして表示する
 * テキストや画像領域をグレーのボックスで表現
 *
 * @returns {JSX.Element}
 */
const ContentSkeletonItem = () => {
  return (
    <Box css={itemStyle}>
      {/* 左カラム：ユーザー名、タイトル、概要、メタ情報、ステータス */}
      <Box css={leftStyle}>
        {/* ユーザー名プレースホルダー */}
        <Box css={userRowStyle}>
          <span css={userNameStyle}>---</span>
        </Box>

        {/* タイトルプレースホルダー */}
        <Typography variant="h6" css={titleStyle}>
          <span css={skeletonBox} />
        </Typography>

        {/* 概要プレースホルダー */}
        <Typography css={summaryStyle}>
          <span css={skeletonBox} />
        </Typography>

        {/* 日付とカテゴリプレースホルダー */}
        <Box css={metaRowStyle}>
          <span css={dateStyle}>----</span>
          <span css={categoryStyle}>----</span>
        </Box>

        {/* コメント数・いいね数プレースホルダー */}
        <Box css={statsRowStyle}>
          <ChatBubbleOutlineIcon fontSize="small" />
          <span>--</span>
          <FavoriteBorderIcon fontSize="small" />
          <span>--</span>
        </Box>
      </Box>

      {/* 右カラム：画像プレースホルダー */}
      <Box css={rightStyle}>
        <Box css={imageBoxStyle}>
          <img src={defaultImage} alt="noimage" css={imageStyle} />
        </Box>
      </Box>
    </Box>
  )
}

export default ContentSkeletonItem

// --- Emotion スタイル定義 ---

/** アイテム全体のレイアウト */
const itemStyle = css({
  display: 'flex',
  padding: '16px',
  borderBottom: '1px solid #eee',
})

/** 左カラム全体（テキスト系のラップ） */
const leftStyle = css({
  flex: 1,
})

/** 右カラム：画像枠のラップ */
const rightStyle = css({
  width: '120px',
  display: 'flex',
  alignItems: 'center',
})

/** ユーザー名行のスタイル */
const userRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
})

/** ユーザー名テキストプレースホルダー */
const userNameStyle = css({
  fontWeight: 'bold',
  fontSize: '1rem',
  color: '#aaa',
})

/** タイトルテキストラップ */
const titleStyle = css({
  margin: '6px 0 4px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
})

/** 概要テキストラップ */
const summaryStyle = css({
  color: '#ccc',
  marginBottom: '6px',
})

/** 日付とカテゴリ行のスタイル */
const metaRowStyle = css({
  display: 'flex',
  gap: '16px',
  fontSize: '0.95rem',
  color: '#bbb',
  marginBottom: '2px',
})

/** 日付プレースホルダー（特にスタイル不要） */
const dateStyle = css({})

/** カテゴリプレースホルダー（特にスタイル不要） */
const categoryStyle = css({})

/** コメント数・いいね数行のスタイル */
const statsRowStyle = css({
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  fontSize: '0.95rem',
  color: '#bbb',
})

/** 画像ボックスの枠 */
const imageBoxStyle = css({
  width: '100px',
  height: '72px',
  overflow: 'hidden',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

/** 画像プレースホルダーのスタイル */
const imageStyle = css({
  display: 'inline-block',
  background: '#e0e0e0',
  width: '100px',
  height: '72px',
  borderRadius: '6px',
})

/** 汎用スケルトンボックス（テキスト用） */
const skeletonBox = css({
  display: 'inline-block',
  background: '#e0e0e0',
  height: '1.2em',
  width: '60%',
  borderRadius: '3px',
})
