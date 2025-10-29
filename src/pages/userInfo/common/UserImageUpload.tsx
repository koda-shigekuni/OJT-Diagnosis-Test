/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import AddIcon from '@mui/icons-material/Add'
import PersonIcon from '@mui/icons-material/Person'
import { Box, Button, Modal, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import text from '../../../utils/text.json'

type Props = {
  base64Image: string | null
  onSave: (base64: string) => Promise<void>
}
/**
 *ユーザーのアイコン画像アップロード・プレビュー表示を行うコンポーネント
 */
const UserImageUploader = ({ base64Image, onSave }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const file = e.target.files[0]
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
      setIsPreviewOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!selectedFile) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setIsSaving(true)
      try {
        await onSave(base64)
        setIsPreviewOpen(false)
        setSelectedFile(null)
      } catch {
        console.log('画像の保存に失敗しました')
      } finally {
        setIsSaving(false)
      }
    }
    reader.readAsDataURL(selectedFile)
  }

  return (
    <Box css={container}>
      <Box css={avatarBox}>
        {base64Image ? (
          <img src={base64Image} alt="User Icon" css={avatarImage} />
        ) : (
          <PersonIcon style={{ fontSize: 120 }} />
        )}
        <AddIcon css={plusIcon} onClick={() => fileInputRef.current?.click()} />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          css={fileInput}
        />
      </Box>
      <Modal open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <Box css={modalStyle}>
          <Typography css={title}>{text.mypage.save_title}</Typography>
          <Box css={PreviewBox}>
            {previewUrl && <img src={previewUrl} alt="Preview" css={avatarImage} />}
          </Box>
          <Box css={buttonBox}>
            <Button
              variant="contained"
              onClick={handleSave}
              css={modalButton}
              style={{ backgroundColor: '#2EB81C', color: '#fff' }}
              disabled={isSaving}
            >
              {text.mypage.save}
            </Button>
            <Button
              variant="contained"
              css={modalButton}
              onClick={() => {
                setIsPreviewOpen(false)
                setSelectedFile(null)
              }}
              style={{ backgroundColor: '#8E8E93', color: '#fff' }}
            >
              {text.mypage.nosave}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default UserImageUploader

const container = css({
  textAlign: 'center',
})
const avatarBox = css({
  position: 'relative',
  display: 'inline-block',
  marginTop: 20,
})
const avatarImage = css({
  width: 180,
  height: 180,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid #c7c7c7',
})
const plusIcon = css({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: '#fff',
  borderRadius: '50%',
  border: '2px solid #1976d2',
  color: '#1976d2',
  fontSize: 32,
  cursor: 'pointer',
})
const fileInput = css({
  display: 'none',
})
const modalStyle = css({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: 40,
  borderRadius: 8,
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  textAlign: 'center',
})
const PreviewBox = css({
  border: '3px solid #414141ff',
  width: '60%',
  margin: 'auto',
  padding: '20px',
})
const buttonBox = css({
  display: 'flex',
  justifyContent: 'center',
  gap: 24,
  margin: '20px',
})
const modalButton = css({
  minWidth: 120,
  padding: '8px 24px',
  fontWeight: 'bold',
  fontSize: '16px',
  borderRadius: 8,
})
const title = css({
  padding: '10px',
  fontSize: '30px',
  fontFamily: '"Dela Gothic One", sans-serif',
})
