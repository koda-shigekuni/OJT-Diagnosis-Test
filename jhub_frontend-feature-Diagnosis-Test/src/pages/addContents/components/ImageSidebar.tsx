/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import UploadIcon from '@mui/icons-material/Upload'
import { Button, Drawer, IconButton, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import text from '../../../utils/text.json'

// ImageSidebar コンポーネントのプロパティ型
type ImageSidebarProps = {
  image: string | null
  onImageChange: (file: File | null) => void
  open: boolean
  onClose: () => void
  errorMessage?: string
}

/**
 * 画像サイドバーコンポーネント
 * @param ImageSidebarProps
 * @returns
 */
const ImageSidebar = ({ image, onImageChange, open, onClose, errorMessage }: ImageSidebarProps) => {
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  // ファイル選択ダイアログでの選択
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onImageChange(file)
  }

  // ドラッグ＆ドロップ関連
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0] ?? null
    onImageChange(file) // ★ そのまま返す
  }

  // 領域クリックでファイル選択ダイアログを開く
  const openFileDialog = () => fileRef.current?.click()

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div css={container}>
        {/* タイトル */}
        <div css={titleBox}>
          <Typography css={titleStyle}>{text.imageSidebar.title}</Typography>
          <IconButton onClick={onClose}>
            <KeyboardDoubleArrowRightIcon css={iconStyle} />
          </IconButton>
        </div>

        {/* ドラッグ＆ドロップ領域 */}
        <div
          css={dropZone(dragActive, !!errorMessage)}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDragEnd={onDragLeave}
          onDrop={onDrop}
          onClick={openFileDialog}
        >
          {image ? text.imageSidebar.dropZoneText : text.imageSidebar.dropZoneChangeText}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* エラーメッセージ */}
        {errorMessage && (
          <Typography
            color="error"
            variant="body2"
            aria-live="polite"
            css={{ marginTop: 4, marginBottom: 8 }}
          >
            {errorMessage}
          </Typography>
        )}

        {/* プレビュー */}
        {image ? (
          <img src={image} alt="設定中の画像" css={previewImg} />
        ) : (
          <Typography variant="body2" color="text.secondary" style={{ marginBottom: 8 }}>
            {text.imageSidebar.noImage}
          </Typography>
        )}

        {/* 通常アップロード */}
        <Button
          component="label"
          variant="contained"
          color="success"
          startIcon={<UploadIcon />}
          fullWidth
        >
          {text.imageSidebar.uploadButton}
          <input hidden type="file" accept="image/*" onChange={handleFileChange} />
        </Button>

        {/* 削除 */}
        {image && (
          <Button
            variant="text"
            color="error"
            onClick={() => onImageChange(null)} // ★ クリア時は null
            fullWidth
            style={{ marginTop: 8 }}
          >
            {text.imageSidebar.deleteButton}
          </Button>
        )}
      </div>
    </Drawer>
  )
}

export default ImageSidebar

// styles
const container = css({ width: 335, padding: 16 })
const titleBox = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '2px solid rgba(0,0,0,0.12)',
  paddingBottom: 8,
  marginBottom: 12,
})
const titleStyle = css({ fontFamily: '"Dela Gothic One", sans-serif', fontSize: '24px' })
const iconStyle = css({ fontSize: '36px' })
const previewImg = css({ width: '100%', borderRadius: 4, marginBottom: 8 })
const dropZone = (active: boolean, hasError = false) =>
  css({
    border: `2px dashed ${hasError ? '#d32f2f' : '#43a047'}`,
    background: active ? (hasError ? '#fdecea' : '#e8f5e9') : '#fff',
    borderRadius: 10,
    padding: 24,
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: 8,
    marginBottom: 8,
    color: '#666',
    transition: 'background 0.2s, border 0.2s',
    cursor: 'pointer',
    fontSize: '0.98rem',
    userSelect: 'none',
  })
