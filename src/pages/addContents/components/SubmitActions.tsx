// src/components/SubmitActions.tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, Stack } from '@mui/material'
import text from '../../../utils/text.json'

// 送信アクションコンポーネントのプロパティ型
type SubmitActionsProps = {
  onSubmit: (displayFlag: number) => void
}

/**
 * 送信アクションコンポーネント
 * - 「下書き保存」「公開」ボタンを表示
 * @param SubmitActionsProps
 * @returns
 */
const SubmitActions = ({ onSubmit }: SubmitActionsProps) => {
  return (
    <Box css={containerStyle}>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* 下書きボタン → display_flag = 1 */}
        <Button variant="contained" onClick={() => onSubmit(1)} css={draftButtonStyle}>
          {text.postContents['draft.button']}
        </Button>

        {/* 公開ボタン → display_flag = 0 */}
        <Button variant="contained" color="success" onClick={() => onSubmit(0)}>
          {text.postContents['confirm.button']}
        </Button>
      </Stack>
    </Box>
  )
}

export default SubmitActions

/* ========================= Emotion CSS ========================= */
const containerStyle = css({
  display: 'flex',
  justifyContent: 'flex-end',
})

/** 下書きボタン（白背景＋枠線＋軽い影） */
const draftButtonStyle = css({
  backgroundColor: '#fff',
  color: 'rgba(0,0,0,0.87)',
  border: '1px solid rgba(0,0,0,0.12)',
  boxShadow:
    '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    boxShadow:
      '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  },
})
