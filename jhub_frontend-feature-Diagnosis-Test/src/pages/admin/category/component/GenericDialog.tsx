/** @jsxImportSource @emotion/react */
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import type { ReactNode } from 'react'

type DialogProps = {
  open: boolean
  onClose: () => void
  onExited?: () => void
  title: string
  content: ReactNode
  actions: ReactNode
}

//表示用ダイアログ
const GenericDialog = ({ open, onClose, onExited, title, content, actions }: DialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      slots={{ paper: Box }}
      slotProps={{
        paper: {
          sx: {
            margin: 'auto',
            padding: 4,
            borderRadius: 2,
          },
        },
        transition: {
          onExited: onExited,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: 25 }}>
        {title}
      </DialogTitle>

      <DialogContent>{content}</DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 10 }}>{actions}</DialogActions>
    </Dialog>
  )
}

export default GenericDialog
