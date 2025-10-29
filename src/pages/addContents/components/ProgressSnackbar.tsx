/** @jsxImportSource @emotion/react */
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, LinearProgress, Typography } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface Props {
  message: string
  duration: number // 表示時間（ミリ秒）
  onClose: () => void
}

/**
 * アップロード成功時に表示するカスタムSnackbar
 * 緑色の背景に進捗バー付き
 */
const ProgressSnackbar = forwardRef<HTMLDivElement, Props>(
  ({ message, duration, onClose }, ref) => {
    // プログレスバーの進捗（0〜100%）
    const [progress, setProgress] = useState(100)

    // マウント/アンマウント時のログ
    useEffect(() => {
      console.log('[SNACK] ProgressSnackbar mounted')
      return () => console.log('[SNACK] ProgressSnackbar unmounted')
    }, [])

    // duration に基づいてプログレスバーを減らす
    useEffect(() => {
      const interval = 100
      const steps = duration / interval
      const decrement = 100 / steps

      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(timer)
            onClose()
            return 0
          }
          return prev - decrement
        })
      }, interval)

      return () => clearInterval(timer)
    }, [duration, onClose])

    return (
      <>
        <Box ref={ref} css={container}>
          {/* 上段：アイコン・メッセージ・閉じるボタン */}
          <Box css={header}>
            <CheckCircleOutlineIcon css={icon} />
            <Typography variant="body2" css={messageText}>
              {message}
            </Typography>
            <IconButton size="small" onClick={onClose} css={closeButton}>
              <CloseIcon fontSize="small" css={closeIcon} />
            </IconButton>
          </Box>

          {/* 下段：進捗バー */}
          <LinearProgress
            variant="determinate"
            value={progress}
            color="success"
            css={progressBar}
          />
        </Box>
      </>
    )
  }
)

export default ProgressSnackbar

// =============================
// Emotion スタイル定義
// =============================
const container = css({
  width: 300,
  padding: 8,
  backgroundColor: '#66bb6a',
  border: '1px solid #43a047',
  borderRadius: 4,
})

const header = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const icon = css({
  color: '#fff',
})

const messageText = css({
  color: '#fff',
  fontWeight: 500,
  flexGrow: 1,
  marginLeft: 8,
})

const closeButton = css({
  color: '#2e7d32', // success.dark の代替
  padding: 4,
})

const closeIcon = css({
  color: '#fff',
  fontSize: '16px',
})

const progressBar = css({
  marginTop: 8,
  height: 6,
  borderRadius: 3,
})
