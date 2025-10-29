/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import { Box, Button, Divider, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useGetHomeContentsQuery } from '../../../api/hook/home'
import text from '../../../utils/text.json'
import { ADD_CONTENTS_URL, CONTENTS_URL } from '../../../utils/URL'
import HomeContentsGrid from './HomeContentsGrid'
import HomeContentsSkeleton from './HomeContentsSkeleton'

/**
 * ホーム画面のコンテンツ一覧表示用コンポーネント
 *
 * - ローディング時はSkeletonを表示
 * - データが空の時はイラスト付きで「投稿を促す」画面を表示
 * - データがあればGridレイアウトで一覧表示
 */
const HomeContentsList = () => {
  // サーバからホーム用コンテンツ一覧を取得
  const { data = [], isLoading } = useGetHomeContentsQuery()
  const navigate = useNavigate()

  // ローディング中はSkeleton表示
  if (isLoading) {
    return <HomeContentsSkeleton />
  }
  // データが空（0件）の場合：イラスト＋メッセージ＋ボタンでUI演出
  if (data.length === 0) {
    return (
      <Box css={emptyWrapStyle}>
        <Box css={emptyInnerStyle}>
          {/* アイコンイラスト */}
          <SentimentSatisfiedAltIcon css={emptyIconStyle} />
          {/* メインメッセージ */}
          <Typography variant="h6" css={emptyMsgStyle}>
            {text.home.contents_isEmpty}
          </Typography>
          {/* サブメッセージ */}
          <Typography variant="body2" css={emptySubMsgStyle}>
            {text.home.emptySubMessage}
          </Typography>
          {/* 新規投稿ボタン */}
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate(ADD_CONTENTS_URL)}
            css={emptyBtnStyle}
          >
            {text.home.addContentsButton}
          </Button>
        </Box>
      </Box>
    )
  }

  // データが1件以上あれば通常のコンテンツリスト表示
  return (
    <Box css={wrapperStyle}>
      <Paper elevation={2} css={paperStyle}>
        {/* タイトル */}
        <Typography variant="h4" css={titleStyle}>
          {text.home.title}
        </Typography>
        {/* 一覧ページへのリンクテキスト */}
        <Typography variant="body2" css={linkStyle} onClick={() => navigate(CONTENTS_URL)}>
          {text.home.contentsLink}
        </Typography>

        <Divider css={dividerStyle} />
        {/* グリッド表示部 */}
        <HomeContentsGrid contents={data} />
      </Paper>
    </Box>
  )
}

export default HomeContentsList

// CSS----------------------------------------

/**
 * 全体のラッパースタイル
 * 上方向に余白を入れる
 */
const wrapperStyle = css({
  marginTop: '10px',
})

/**
 * Paperコンポーネントのスタイル
 * 背景、角丸、中央寄せ、最大サイズなど
 */
const paperStyle = css({
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '6px',
  boxShadow: 'none',
  width: '926px',
  height: '908px',
  margin: '0 auto',
})

/**
 * タイトルテキストのスタイル
 */
const titleStyle = css({
  marginTop: '10px',
  marginLeft: '8px',
  marginBottom: '-30px',
  fontSize: '2rem',
  fontFamily: '"Dela Gothic One", sans-serif',
})

/**
 * 一覧ページへのリンクのスタイル
 */
const linkStyle = css({
  color: '#4caf50',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  textAlign: 'right' as const,
  marginBottom: '-8px',
  marginRight: '32px',
  '&:hover': {
    textDecoration: 'underline',
  },
})

/**
 * Dividerコンポーネントの上下マージン
 */
const dividerStyle = css({
  marginTop: '24px',
  marginBottom: '24px',
})

/**
 * データが無い場合の全体ラッパー
 */
const emptyWrapStyle = css({
  width: '100%',
  minHeight: 380,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '60px',
  marginBottom: '60px',
})

/**
 * データが無い場合の内側ボックス（背景・角丸・余白）
 */
const emptyInnerStyle = css({
  background: 'linear-gradient(135deg, #f4fff7 80%, #e9fbe0 100%)',
  borderRadius: 16,
  border: '1.8px solid #e4eede',
  padding: '48px 36px 42px 36px',
  boxShadow: '0 4px 24px rgba(56, 180, 90, 0.09)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 300,
  maxWidth: 420,
  margin: '0 auto',
})

/**
 * 空時アイコン（緑・大きめ）
 */
const emptyIconStyle = css({
  color: '#22C55E',
  fontSize: 54,
  marginBottom: 18,
})

/**
 * メインメッセージ
 */
const emptyMsgStyle = css({
  fontWeight: 700,
  fontSize: '1.25rem',
  color: '#26A769',
  marginBottom: 4,
})

/**
 * サブメッセージ
 */
const emptySubMsgStyle = css({
  color: '#777',
  fontSize: '1rem',
  marginBottom: 6,
  textAlign: 'center' as const,
})

/**
 * 新規投稿ボタン
 */
const emptyBtnStyle = css({
  marginTop: 18,
  minWidth: 170,
  fontWeight: 700,
})
