/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MenuItem, TextField, Typography } from '@mui/material'
import type { RootState } from '../../../redux/store'
import { useAppSelector } from '../../../redux/store/hook'
import text from '../../../utils/text.json'
import { errorTextOutside } from '../AddContentsForm'

// カテゴリ選択コンポーネントのプロパティ型
type categoryProps = {
  value: string
  onChange: (id: string) => void
  disabled?: boolean
  error?: boolean
  helperText?: string
  required?: boolean
}

/**
 * カテゴリー選択コンポーネント
 * @param categoryProps
 * @returns
 */
const CategorySelect = ({ value, onChange, disabled, helperText }: categoryProps) => {
  // Reduxストアからカテゴリ一覧、読み込み状態、エラー状態を取得
  const {
    items: categories,
    loading: isLoading,
    error,
  } = useAppSelector((state: RootState) => state.category)

  return (
    <div css={wrap}>
      {helperText && (
        <div css={errorTextOutside} role="alert" aria-live="polite">
          <Typography variant="caption" color="error">
            {helperText}
          </Typography>
        </div>
      )}
      <TextField
        select
        size="small"
        fullWidth
        css={fieldStyle}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        disabled={disabled || isLoading || !!error}
        slotProps={{
          select: {
            displayEmpty: true,
            renderValue: selected => {
              if (selected === '' || selected === undefined) {
                return (
                  <span style={{ color: '#9e9e9e' }}>
                    {text.categorySelect?.['category.empty']}
                  </span>
                )
              }
              const hit = categories.find(c => String(c.id) === String(selected))
              return hit?.label ?? String(selected)
            },
          },
        }}
      >
        {isLoading && (
          <MenuItem disabled value="">
            {text.categorySelect?.['category.loading']}
          </MenuItem>
        )}

        {error && (
          <MenuItem disabled value="">
            {text.categorySelect?.['category.error']}
          </MenuItem>
        )}

        {categories.map(cat => (
          <MenuItem key={cat.id} value={String(cat.id)}>
            {cat.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  )
}

export default CategorySelect

// ---- CSS ----
const wrap = css({ display: 'grid', gap: 6 })
const fieldStyle = css({ backgroundColor: '#fff', borderRadius: 4 })
