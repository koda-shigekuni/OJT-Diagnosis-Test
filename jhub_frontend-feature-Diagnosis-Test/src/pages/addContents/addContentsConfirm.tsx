/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  Category as CategoryIcon,
  Public as PublicIcon,
  Description as SummaryIcon,
  Title as TitleIcon,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import type { JSONContent } from '@tiptap/core'
import { EditorContent } from '@tiptap/react'
import { useEffect } from 'react'
import defaultImage from '../../assets/NOIMAGE.png'
import text from '../../utils/text.json'
import { useSyncedEditors } from './components/editor/useSyncedEditors'

export type ConfirmValues = {
  title: string
  summary: string
  content: JSONContent
  imageBase64?: string | null
  categoryName: string
  displayFlag: number
  categoryId: number
}

type Props = {
  open: boolean
  values: ConfirmValues | null
  sending?: boolean
  onClose: () => void
  onConfirm: () => void
}

const AddContentsConfirm = ({ open, values, sending = false, onClose, onConfirm }: Props) => {
  // 読み取り専用プレビュー
  const { previewEditor } = useSyncedEditors({
    content: values?.content ?? { type: 'doc', content: [] },
    codeLanguage: 'Java',
    onChange: () => {},
  })

  useEffect(() => {
    if (previewEditor && values?.content) {
      previewEditor.commands.setContent(values.content)
    }
  }, [previewEditor, values?.content])

  // ダイアログ表示中だけショートカット有効化
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (sending) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
        e.preventDefault()
        onConfirm()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, sending, onClose, onConfirm])

  const thumbnailUrl =
    values?.imageBase64 && values.imageBase64.length > 0 ? values.imageBase64 : defaultImage
  const displayFlag = values?.displayFlag === 1 ? 1 : 0
  const handleClose = (_: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (sending && reason === 'backdropClick') return // 送信中はバックドロップ閉鎖抑止
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-hint"
    >
      <DialogTitle id="confirm-title" css={dialogTitle}>
        {text.contentsConfirm.title[displayFlag]}
        <Typography component="div" css={confirmMessage}>
          {text.contentsConfirm.confirm[displayFlag]}
        </Typography>
      </DialogTitle>

      <DialogContent dividers css={dialogContent}>
        {/* メタ情報＋サムネイル */}
        <div css={[metaWrapper, metaSectionCard]}>
          {/* 左：テキスト */}
          <div css={metaInfoBlock} role="group" aria-label="メタ情報">
            {/* タイトル */}
            <div css={metaItem}>
              <div css={metaLabelPill}>
                <TitleIcon fontSize="small" css={metaIcon} />
                {text.contentsConfirm.label}
              </div>
              <div css={[metaValue, metaValueStrong, lineClamp2]}>{values?.title || '—'}</div>
            </div>

            {/* サマリー */}
            <div css={metaItem}>
              <div css={metaLabelPill}>
                <SummaryIcon fontSize="small" css={metaIcon} />
                {text.contentsConfirm.summary}
              </div>
              <div css={[metaValue, lineClamp2]}>{values?.summary || '—'}</div>
            </div>

            {/* 公開設定 */}
            <div css={metaItem}>
              <div css={metaLabelPill}>
                <PublicIcon fontSize="small" css={metaIcon} />
                {text.contentsConfirm.meta}
              </div>
              <div css={metaValue}>{values?.displayFlag === 1 ? '下書き' : '公開'}</div>
            </div>

            {/* カテゴリー */}
            <div css={metaItem} style={{ borderBottom: 'none' }}>
              <div css={metaLabelPill}>
                <CategoryIcon fontSize="small" css={metaIcon} />
                {text.contentsConfirm.category}
              </div>
              <div css={metaValue}>{values?.categoryName ?? '未設定'}</div>
            </div>
          </div>

          {/* 右：サムネイル */}
          <div css={thumbBox} aria-label="サムネイル">
            <CardMedia
              component="img"
              image={thumbnailUrl}
              alt={values?.title ? `「${values.title}」のサムネイル` : 'thumbnail'}
              css={thumbMediaCss}
            />
          </div>
        </div>

        {/* 本文プレビュー */}
        <Card css={[card, previewCard]}>
          <CardContent css={cardInner}>
            <Box css={[viewerBox, proseReadable]}>
              {previewEditor && <EditorContent editor={previewEditor} />}
            </Box>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions css={actionsBar}>
        <div id="confirm-hint" css={hintKeys}>
          {text.contentsConfirm.hintkey}
        </div>
        <Box css={actionsRight}>
          <Button variant="outlined" onClick={onClose} disabled={sending}>
            {text.contentsConfirm['cansel.button']}
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={onConfirm}
            disabled={sending}
            aria-busy={sending ? 'true' : 'false'}
          >
            {text.contentsConfirm['add.button']}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default AddContentsConfirm

/* ====== Emotion CSS ====== */
const dialogTitle = css({
  position: 'sticky',
  top: 0,
  zIndex: 2,
  padding: '14px 20px',
  fontSize: 18,
  fontWeight: 800,
  lineHeight: 1.4,
  textAlign: 'center',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.86) 100%)',
  backdropFilter: 'saturate(140%) blur(6px)',
  borderBottom: '1px solid #eef0f3',
})

const confirmMessage = css({
  marginTop: 6,
  fontSize: 15.5,
  fontWeight: 700,
  color: '#c62828',
})

const dialogContent = css({
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  '@media (min-width: 900px)': { padding: 18, gap: 14 },
})

const actionsBar = css({
  position: 'sticky',
  bottom: 0,
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 10,
  padding: '8px 14px',
  background: 'linear-gradient(0deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 100%)',
  backdropFilter: 'saturate(140%) blur(6px)',
  borderTop: '1px solid #eef0f3',
})

const actionsRight = css({
  display: 'flex',
  gap: 10,
})

const metaWrapper = css({
  display: 'grid',
  gridTemplateColumns: '1fr 300px',
  gap: 24,
  alignItems: 'start',
  '@media (max-width: 900px)': { gridTemplateColumns: '1fr' },
})
const metaSectionCard = css({
  border: '1px solid #e9ebef',
  borderRadius: 12,
  padding: 16,
  background: '#fff',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
})
const metaInfoBlock = css({ display: 'flex', flexDirection: 'column', gap: 14 })
const metaItem = css({
  display: 'grid',
  gridTemplateColumns: '220px 1fr',
  alignItems: 'start',
  columnGap: 12,
  rowGap: 6,
  padding: '6px 0',
  borderBottom: '1px dashed #e6e8eb',
  '@media (max-width: 640px)': { gridTemplateColumns: '1fr' },
})
const metaLabelPill = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 10px',
  borderRadius: 9999,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '.01em',
  background: 'rgba(255, 200, 98, 0.8)',
  border: '1px solid rgba(176, 128, 50, 0.55)',
  color: '#3b2e12',
  whiteSpace: 'nowrap',
})
const metaIcon = css({ color: '#6b4e16' })
const metaValue = css({
  fontSize: 15.5,
  lineHeight: 1.85,
  color: 'rgba(0,0,0,0.88)',
})
const metaValueStrong = css({ fontSize: 16, fontWeight: 700 })

/* ★ タイトル・要約用：2行で省略 (…) */
const lineClamp2 = css({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
})

const thumbBox = css({ display: 'flex', justifyContent: 'flex-end' })
const thumbMediaCss = css({
  width: 300,
  height: 200,
  border: '1px solid #e6e8eb',
  borderRadius: 12,
  objectFit: 'cover',
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
})
const card = css({ borderRadius: 12, border: '1px solid #e6e8eb', backgroundColor: '#fff' })
const cardInner = css({
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  '@media (min-width: 900px)': { padding: 16 },
})

const viewerBox = css({
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: 14,
  minHeight: 220,
  maxHeight: 'clamp(260px,62vh,calc(100dvh - 280px))',
  overflow: 'auto',
  overscrollBehavior: 'contain',
  background: '#fff',
  boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.03)',
})

const proseReadable = css({
  '.ProseMirror': { fontSize: '1.08rem', lineHeight: 1.9, whiteSpace: 'pre-wrap' },
})

const hintKeys = css({
  fontSize: 12.5,
  color: 'rgba(0,0,0,0.55)',
  userSelect: 'none',
  padding: '4px 0',
})

const previewCard = css({
  marginTop: 8,
  backgroundColor: '#fafafa',
  borderStyle: 'dashed',
  borderColor: '#e6e8eb',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
})
