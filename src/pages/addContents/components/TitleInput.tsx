/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { TextField, Typography } from '@mui/material'
import { errorTextOutside } from '../AddContentsForm'

type TitleInputProps = {
  value: string
  onChange: (value: string) => void
  error?: boolean
  helperText?: string
}

const TitleInput = ({ value, onChange, error, helperText }: TitleInputProps) => {
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
        value={value}
        onChange={e => onChange(e.target.value)}
        error={false} // 赤枠は消して外側だけでエラー表示
        variant="outlined"
        placeholder="タイトルを入力してください"
        multiline
        minRows={1}
        maxRows={2}
        slotProps={{ htmlInput: { maxLength: 100 } }}
        css={whiteInput} // ← CSSクラスを当てる
      />
    </div>
  )
}

export default TitleInput

// ---- Emotion CSS ----
const wrap = css({
  display: 'flex',
  flexDirection: 'column',
})

const whiteInput = css({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff', // ← フィールドだけ白
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: 'none' },
    '&.Mui-disabled': { backgroundColor: '#fff', opacity: 1 },
  },
})
