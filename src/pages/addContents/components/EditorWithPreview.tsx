/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import EditNoteIcon from '@mui/icons-material/EditNote'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Editor, JSONContent } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import text from '../../../utils/text.json'
import { MAX_CONTENT_LENGTH } from '../../../validation/contentsSchema'

import { errorTextOutside } from '../AddContentsForm'
import { EditorToolbar } from './editor/EditorToolbar'
import { useSyncedEditors } from './editor/useSyncedEditors'
import ImageSidebar from './ImageSidebar'

// エディタコンポーネントのプロパティ型
type editorProps = {
  content: JSONContent | null
  onChange: (c: JSONContent) => void
  image: string | null
  onImageChange: (file: File | null) => void
  /** スキーマ由来などのエラーメッセージ（本文用） */
  errorMessage?: string
  imageErrorMessage?: string
  /** 枠外に表示するアラート文（エラー/警告） */
  alertText?: string
}

/**
 * エディタ＋プレビューコンポーネント
 */
const EditorWithPreview = ({
  content,
  onChange,
  image,
  onImageChange,
  errorMessage, // ← 既存（必要なら alertText に束ねても可）
  imageErrorMessage,
  alertText,
}: editorProps) => {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [selectedLang, setSelectedLang] = useState<string>('Java')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // スクロール検知
  useEffect(() => {
    const target = scrollRef.current ?? window
    const getY = () => (target instanceof Window ? target.scrollY : target.scrollTop)
    const onScroll = () => setIsScrolled(getY() > 0)
    onScroll()
    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [])

  // TipTapエディタの初期化と同期（20,000字ハード制限）
  const { editEditor, previewEditor } = useSyncedEditors({
    content,
    codeLanguage: selectedLang,
    onChange,
    maxChars: MAX_CONTENT_LENGTH,
  })

  // エディタが初期化されるまで何も表示しない
  if (!editEditor || !previewEditor) return null

  // ---- 読了時間の推定 ---
  const estimateReadingMinutes = (editor: Editor) => {
    const chars: number = editor.storage.characterCount.characters()
    const CPM = 500
    return Math.max(1, Math.ceil(chars / CPM))
  }

  // 表示用メトリクス
  const chars = editEditor.storage.characterCount.characters()
  const minutes = estimateReadingMinutes(editEditor)

  const alert = alertText || errorMessage // errorMessage を流用したい場合はここで束ねる

  return (
    <>
      {alert && (
        <div css={errorTextOutside} role="alert" aria-live="polite">
          <Typography variant="body2" color="error">
            {alert}
          </Typography>
        </div>
      )}

      <Paper css={paperStyle} elevation={0} ref={scrollRef}>
        {/* Header */}
        <Box css={headerStyle(isScrolled)}>
          {/* Toolbar */}
          {mode === 'edit' && (
            <EditorToolbar
              editor={editEditor}
              selectedLang={selectedLang}
              setSelectedLang={setSelectedLang}
              scrollTarget={scrollRef.current ?? undefined}
            />
          )}

          {/* 画像ボタン + トグル */}
          <Box css={rightCluster}>
            <Tooltip title="記事のサムネイルを追加/変更する">
              <Button
                variant="outlined"
                css={thumbnailButton}
                size="small"
                startIcon={<AddPhotoAlternateIcon />}
                onClick={() => setSidebarOpen(true)}
              >
                {text.imageSidebar.title}
              </Button>
            </Tooltip>

            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_e, v) => v && setMode(v)}
              size="small"
            >
              <ToggleButton value="edit" css={toggleButtonStyle}>
                <EditNoteIcon />
              </ToggleButton>
              <ToggleButton value="preview" css={toggleButtonStyle}>
                <VisibilityIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Editor area */}
        <Box css={[editorAreaBase, mode === 'preview' ? editorPreviewBg : editorEditBg]}>
          {mode === 'edit' ? (
            <EditorContent editor={editEditor} />
          ) : (
            <EditorContent editor={previewEditor} />
          )}
        </Box>

        <Box css={footerStyle}>
          {/* 右側：文字数情報 */}
          <Typography variant="caption">
            {`文字数 ${chars} ／ 約${minutes}分で読める内容です`}
          </Typography>
        </Box>

        {/* 画像サイドバー */}
        <ImageSidebar
          open={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          image={image ?? ''}
          onImageChange={onImageChange}
          errorMessage={imageErrorMessage}
        />
      </Paper>
    </>
  )
}

export default EditorWithPreview

// ============ styles ============

const paperStyle = css({ backgroundColor: '#fff', boxShadow: 'none', borderRadius: 6 })

const headerStyle = (isScrolled: boolean) =>
  css({
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ddd',
    backgroundColor: 'rgba(250, 250, 250)',
    borderTopLeftRadius: isScrolled ? 0 : 6,
    borderTopRightRadius: isScrolled ? 0 : 6,
    position: 'sticky',
    top: 27,
    zIndex: 1200,
    transition: 'border-radius 150ms ease',
  })

const rightCluster = css({
  marginLeft: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
})

const toggleButtonStyle = css({
  border: '1px solid #ddd',
  borderRadius: 4,
  minWidth: 40,
  minHeight: 40,
  '&.MuiToggleButton-root': { padding: 4 },
  '&.Mui-selected': { backgroundColor: '#86F030', color: '#fff' },
  '&.Mui-selected:hover': { backgroundColor: '#76d92c' },
})

const editorAreaBase = css({
  padding: 16,
  minHeight: 300,
  borderRadius: 12,
  '& .ProseMirror': {
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
  '& .hljs': {
    backgroundColor: '#1e1e1e',
    color: '#f8f8f2',
    padding: '1em',
    borderRadius: 6,
    overflowX: 'auto',
  },
  '& img': { maxWidth: '100%', height: 'auto', display: 'block' },
  '& .youtubeVideo': {
    maxWidth: '100%',
    width: '800px',
    aspectRatio: '16/9',
    display: 'block',
    margin: '1em auto',
    borderRadius: 6,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
})

const editorEditBg = css({ backgroundColor: '#fff' })
const editorPreviewBg = css({ backgroundColor: '#fafafa' })

const thumbnailButton = css({
  border: '1px solid #86F030',
  color: '#00c70a',
  borderRadius: 4,
  minWidth: 40,
  minHeight: 40,
  '&.MuiToggleButton-root': { padding: 4 },
  '&.Mui-selected': { backgroundColor: '#86F030', color: '#fff' },
  '&.Mui-selected:hover': { backgroundColor: '#76d92c' },
})

const footerStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 12px',
  borderTop: '1px solid #eee',
  background: '#fafafa',
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
})
