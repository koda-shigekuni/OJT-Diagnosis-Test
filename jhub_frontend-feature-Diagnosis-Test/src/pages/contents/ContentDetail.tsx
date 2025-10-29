/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import CommentIcon from '@mui/icons-material/Comment'
import EditIcon from '@mui/icons-material/Edit'
import FlightIcon from '@mui/icons-material/Flight'
import { Button, IconButton, Tooltip } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetCommentQuery } from '../../api/hook/comment'
import { useGetContentDetailQuery } from '../../api/hook/contents'
import { useSession } from '../../api/session'
import noImage from '../../assets/NOIMAGE.png'
import text from '../../utils/text.json'
import { contentsEditPath } from '../../utils/URL'
import ContentsWrapper from '../common/contentsWrapper'
import SideMenu from '../common/SideMenu'
import ContentDetailSkelton from '../common/skelton/ContentDetailSkelton'
import RichTextViewer from './common/RichTextViewer'
import CommentForm from './components/CommentForm'
import CommentList from './components/CommentList'
import { LikeAnimetion } from './components/LikeAnimetion'
import { LikeHandler } from './components/LikeHandler'

const SCROLL_THRESHOLD = 100 // スクロールボタン表示位置
/**
 * コンテンツ詳細画面
 */
const ContentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [numericId])
  const navigate = useNavigate()
  const { data: session } = useSession()

  /** 利用可能な画像 src かを判定 */
  const isUsableImageSrc = (src: unknown): src is string => {
    if (typeof src !== 'string') return false
    const s = src.trim()
    if (s === '') return false

    // http(s) URL は許可
    if (s.startsWith('http://') || s.startsWith('https://')) return true

    // dataURL（画像）で、カンマ以降にペイロードがあること
    if (s.startsWith('data:image/')) {
      const comma = s.indexOf(',')
      if (comma === -1) return false
      const payload = s.slice(comma + 1).trim()
      return payload.length > 0 // "data:...;base64,"（空）は不可
    }
    return false
  }
  const { data: contentDetail, refetch: refetchContent } = useGetContentDetailQuery(numericId)
  const { refetch } = useGetCommentQuery(numericId)
  const imageSrc = isUsableImageSrc(contentDetail?.image) ? contentDetail.image : noImage

  // いいね機能
  const likeHandler = LikeHandler(
    contentDetail?.id ?? 0,
    '0',
    Number(contentDetail?.favoriteCount) || 0,
    contentDetail?.content_like_flag === 1,
    () => refetchContent()
  )
  // --- スクロールトップボタン制御 ---
  const [showScrollTop, setShowScrollTop] = useState(false)

  // 監視用（過去状態を保持）
  const [prevShowScrollTop, setPrevShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_THRESHOLD)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ★ showScrollTop の変化を監視する useEffect
  useEffect(() => {
    if (prevShowScrollTop !== showScrollTop) {
      console.log('スクロールトップボタン:', showScrollTop)
      console.log('スクロールピクセル:', window.scrollY + 'px')

      setPrevShowScrollTop(showScrollTop) // 過去状態を更新
    }
  }, [showScrollTop, prevShowScrollTop])
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (document.documentElement) {
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (document.body) {
      document.body.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <ContentsWrapper>
      <SideMenu />
      <div css={card}>
        {contentDetail ? (
          <>
            <header css={headerRow}>
              <div css={headerText}>
                {/* 投稿者（上部） */}
                <div css={authorRow}>
                  <img
                    css={userIcon}
                    src={contentDetail.userIcon ?? noImage}
                    alt={contentDetail.postUser}
                    loading="lazy"
                    decoding="async"
                    onError={e => {
                      if (e.currentTarget.src !== noImage) {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = noImage
                      }
                    }}
                  />
                  <div css={author}>{contentDetail.postUser}</div>
                  {session?.emp_id && session.emp_id === contentDetail.addTancd && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(contentsEditPath(contentDetail.id))}
                      css={editButton}
                    >
                      {text.contentDetail.edit}
                    </Button>
                  )}
                </div>

                {/* タイトル（左ボーダーライン） */}
                <h1 css={titleWithBorder}>{contentDetail.title}</h1>

                {/* 投稿日・更新日 */}
                <div css={meta}>
                  <span>
                    {text.contentDetail['postDate.label']} {contentDetail.addDate}
                  </span>
                  <span css={sep}>{text.common.slash}</span>
                  <span>
                    {text.contentDetail['updateDate.label']}
                    {contentDetail.updDate}
                  </span>
                </div>

                {/* コメント数 & いいね数 */}
                <div css={statsRow}>
                  <span css={commentStat}>
                    <CommentIcon css={commentIcon} /> {contentDetail.commentCount}
                  </span>
                  <span css={favoriteStat}>
                    <LikeAnimetion
                      liked={likeHandler.liked || contentDetail.content_like_flag === 1}
                      disabled={likeHandler.cooldown || contentDetail.content_like_flag === 1}
                      onClick={likeHandler.handleLike}
                    />
                    <span>{likeHandler.likeCount ?? 0}</span>
                  </span>
                </div>
              </div>

              {/* 右側カラム（編集ボタン＋サムネイル） */}
              <div css={thumbBox}>
                <img
                  src={imageSrc}
                  alt={contentDetail.title}
                  css={thumbImg}
                  loading="lazy"
                  decoding="async"
                  onError={e => {
                    if (e.currentTarget.src !== noImage) {
                      e.currentTarget.src = noImage
                    }
                  }}
                />
              </div>
            </header>

            <hr css={divider} />

            {/* 本文 */}
            <article css={contentBody}>
              {/* RichTextViewer 側が className="tiptap-viewer" を付けているので、
                  下の Emotion スタイルで見た目を完全同期できる */}
              <RichTextViewer content={contentDetail.content} />
            </article>
          </>
        ) : (
          <ContentDetailSkelton />
        )}
      </div>
      {contentDetail && <CommentList contentsId={contentDetail.id} />}
      {contentDetail && <CommentForm contentsId={contentDetail.id} onSuccess={() => refetch()} />}
      {/* スクロールトップボタン*/}
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 64 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 64 }}
          css={scrollTopFixedWrap}
        >
          <Tooltip title="トップへ戻る" placement="left">
            <IconButton css={scrollTopIconBtn} onClick={handleScrollTop} size="large">
              <FlightIcon css={scrollTopIcon} />
            </IconButton>
          </Tooltip>
        </motion.div>
      )}
    </ContentsWrapper>
  )
}

export default ContentDetail

/* ───────── styles ───────── */

const card = css({
  backgroundColor: '#fff',
  borderRadius: 10,
  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
  padding: 24,
  maxWidth: 900,
  margin: '64px auto 32px',
  fontSize: 14,
  lineHeight: 1.6,
})

const headerRow = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 16,
})

const headerText = css({
  flex: 1,
  minWidth: 0,
})

const editButton = css({
  color: '#22C55E',
  borderColor: '#22C55E',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: 6,
  '&:hover': {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderColor: '#16A34A',
  },
})

/** 投稿者情報（アイコンと名前）のラッパー */
const authorRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 12,
})

/** ユーザーアイコン */
const userIcon = css({
  width: 32,
  height: 32,
  borderRadius: '50%',
  objectFit: 'cover',
  boxShadow: '0 1px 3px rgba(60,100,180,0.06)',
  border: '2px solid #e0e0e0',
})

/** 投稿者名 */
const author = css({
  fontSize: 13,
  color: '#555',
  fontWeight: 600,
})

/** タイトル：左ボーダーライン＋若干の余白・色味 */
const titleWithBorder = css({
  fontSize: 'clamp(18px, 2vw, 22px)',
  fontWeight: 700,
  margin: '0 0 10px',
  paddingLeft: 12,
  borderLeft: '6px solid #22C55E',
  color: '#000',
  lineHeight: 1.3,
})

/** 日付行 */
const meta = css({
  color: '#6b7280',
  fontSize: 13,
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
})

/** コメント数・いいね数行 */
const statsRow = css({
  display: 'flex',
  marginBlockStart: 8,
  marginLeft: 4,
  gap: 24,
  fontSize: 18,
})

/** コメント数 */
const commentStat = css({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  color: '#4caf50',
})

const commentIcon = css({
  fontSize: 18,
  color: '#4caf50',
})

/** いいね数 */
const favoriteStat = css({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  color: 'orange',
})

const sep = css({ opacity: 0.6 })

/** サムネイル（右側・小さめ固定） */
const thumbBox = css({
  flexShrink: 0,
  width: 200,
  height: 150,
  borderRadius: 4,
  overflow: 'hidden',
  background: '#f3f4f6',
})

const thumbImg = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
})

const divider = css({
  border: 0,
  borderTop: '1px solid #e5e7eb',
  margin: '12px 0 16px',
})

/** 本文：エディタと完全同期させたい CSS を .tiptap-viewer に集約 */
const contentBody = css({
  // ベース（エディタと同じ値に）
  fontSize: 15,
  lineHeight: 1.7,

  // RichTextViewer のルートに className が付くので、そこを起点に見た目を統一
  '.tiptap-viewer': {
    fontSize: 15,
    lineHeight: 1.7,
    color: '#111827',
    wordBreak: 'break-word',
  },

  // ブロック系
  '.tiptap-viewer p': { margin: '0 0 1em' },
  '.tiptap-viewer h1': { fontSize: 22, lineHeight: 1.35, margin: '1.2em 0 0.6em', fontWeight: 700 },
  '.tiptap-viewer h2': {
    fontSize: 20,
    lineHeight: 1.35,
    margin: '1.1em 0 0.55em',
    fontWeight: 700,
  },
  '.tiptap-viewer h3': { fontSize: 18, lineHeight: 1.35, margin: '1em 0 0.5em', fontWeight: 700 },

  // list
  '.tiptap-viewer ul, .tiptap-viewer ol': { paddingLeft: '1.4rem', margin: '0 0 1em' },
  '.tiptap-viewer li': { margin: '0.25em 0' },

  // blockquote
  '.tiptap-viewer blockquote': {
    margin: '1em 0',
    padding: '0.6em 0.9em',
    borderLeft: '4px solid #e5e7eb',
    background: '#fafafa',
  },

  // code
  '.tiptap-viewer pre': {
    background: '#222',
    color: '#f8f8f2',
    padding: '1em',
    borderRadius: 6,
    overflowX: 'auto',
    margin: '1em 0',
  },
  '.tiptap-viewer code': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' },

  // hr
  '.tiptap-viewer hr': { border: 0, borderTop: '1px solid #e5e7eb', margin: '1.25em 0' },

  // table
  '.tiptap-viewer table': { borderCollapse: 'collapse', width: '100%', margin: '1em 0' },
  '.tiptap-viewer th, .tiptap-viewer td': { border: '1px solid #ddd', padding: 6 },
  '.tiptap-viewer th': { background: '#fafafc' },

  // 画像 / 埋め込み
  '.tiptap-viewer img': { maxWidth: '100%', height: 'auto', display: 'block', margin: '0.5em 0' },
  '.tiptap-viewer iframe': { maxWidth: '100%', display: 'block' },

  // リンク
  '.tiptap-viewer a': { color: '#2563eb', textDecoration: 'underline' },
})

// --- スクロールトップボタン用スタイル ---
const scrollTopFixedWrap = css({
  position: 'fixed',
  right: 32, // ← 標準的な余白に修正
  bottom: 32, // ← 標準的な余白に修正
  zIndex: 3000,
})

// ボタン（アイコンサイズ大・影/hover効果つき）
const scrollTopIconBtn = css({
  background: '#fff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'background 0.18s, box-shadow 0.18s, transform 0.18s',
  padding: 10,
  borderRadius: '50%',
  '&:hover': {
    background: '#f0fff5',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.12)', // rotateを削除
  },
  '&:active': {
    background: '#d7f7e3',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
    transform: 'scale(0.95)', // 押し込み感を追加
  },
})

// アイコンそのもの（大きさや色のみ）
const scrollTopIcon = css({
  color: '#1bbf46', // 少し落ち着いた緑
  fontSize: '2.2rem',
})
