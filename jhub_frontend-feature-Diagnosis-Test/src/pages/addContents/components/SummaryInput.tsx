/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { TextField, Typography } from '@mui/material'
import { errorTextOutside } from '../AddContentsForm'

// 要約入力コンポーネントのプロパティ型
type SummaryInputProps = {
  summary: string
  onChange: (value: string) => void
  error?: boolean
  helperText?: string
}

/**
 * 要約入力コンポーネント
 * @param SummaryInputProps
 * @returns
 */
const SummaryInput = ({ summary, onChange, error, helperText }: SummaryInputProps) => {
  return (
    <div css={wrap}>
      {/* エラー文は TextField の外に独立表示 */}
      {error && helperText && (
        <Typography variant="caption" css={errorTextOutside}>
          {helperText}
        </Typography>
      )}
      <TextField
        fullWidth
        multiline
        value={summary}
        onChange={e => onChange(e.target.value)}
        variant="outlined"
        css={noBorderInput}
        placeholder="投稿する内容の要約を入力してください。"
        error={error}
        minRows={1}
        maxRows={5}
        slotProps={{ htmlInput: { maxLength: 200 } }}
      />
    </div>
  )
}

export default SummaryInput

// ---- Emotion CSS ----
const wrap = css({
  display: 'flex',
  flexDirection: 'column',
})

const noBorderInput = css({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
    backgroundColor: '#fff',
  },
})
