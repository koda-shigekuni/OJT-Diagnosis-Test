/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import AddReactionIcon from '@mui/icons-material/AddReaction'
import { Button, IconButton, TextField } from '@mui/material'
import EmojiPicker, {
  Categories,
  EmojiStyle,
  SuggestionMode,
  type EmojiClickData,
} from 'emoji-picker-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { usePostCommentMutate } from '../../../api/hook/comment'
import text from '../../../utils/text.json'
import { commentSchema, type CommentFormInput } from '../../../validation/commentSchema'

/**
 * コメント投稿フォーム
 * @param contentsId 対象コンテンツID
 * @param onSuccess 投稿成功時コールバック
 */
type FormProps = {
  contentsId: number
  onSuccess?: () => void
}

const MAX_COMMENT_LENGTH = 300

const CommentForm = ({ contentsId, onSuccess }: FormProps) => {
  // react-hook-form のセットアップ
  const { handleSubmit, reset, formState, register, setValue, watch } = useForm<CommentFormInput>({
    resolver: zodResolver(commentSchema), // バリデーション
    defaultValues: {
      commentBody: '',
    },
    mode: 'onSubmit', // 送信時のみバリデーション
  })
  // コメント送信カスタムフック
  const postCommentMutation = usePostCommentMutate()
  // UI制御用State
  const [locked, setLocked] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  // テキストエリア参照
  const textareaRef = useRef<HTMLInputElement>(null)

  /**
   * 投稿成功時の処理
   * 完了表示→リセット→コールバック呼び出し
   */
  const handleSuccess = () => {
    setCompleted(true)
    setTimeout(() => {
      setCompleted(false)
      setLocked(false)
      reset()
      onSuccess?.()
    }, 1500)
  }

  /**
   * 送信時の実処理
   */
  const onSubmit = (data: CommentFormInput) => {
    setLocked(true)
    postCommentMutation.mutate(
      { action: 'create', contentsId, commentId: 0, commentBody: data.commentBody },
      {
        onSuccess: handleSuccess,
        onError: () => {
          setLocked(false)
          alert('コメント投稿に失敗しました')
        },
      }
    )
  }

  /**
   * 絵文字選択イベント（選択された位置に絵文字を挿入）
   */
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    const value = watch('commentBody') || ''
    const emojiChar = emojiData.emoji
    // テキストエリアのカーソル位置に挿入
    if (textareaRef.current) {
      const input = textareaRef.current
      const start = input.selectionStart ?? value.length
      const end = input.selectionEnd ?? value.length
      const newValue = value.substring(0, start) + emojiChar + value.substring(end)
      setValue('commentBody', newValue)
      setShowEmoji(false)
      setTimeout(() => {
        input.focus()
        input.selectionStart = input.selectionEnd = start + emojiChar.length
      }, 50)
    } else {
      setValue('commentBody', value + emojiChar)
      setShowEmoji(false)
    }
  }

  // ボタン無効制御
  const disabled = locked || completed

  const commentBody = watch('commentBody') || ''
  const currentLength = commentBody.length

  const ratio = currentLength / MAX_COMMENT_LENGTH

  return (
    <form onSubmit={handleSubmit(onSubmit)} css={formWrap}>
      {/* バリデーションエラーメッセージ */}
      {formState.errors.commentBody && (
        <div css={errorMsg}>{formState.errors.commentBody.message}</div>
      )}
      <div css={inputRow}>
        <div css={textareaContainer}>
          {/* コメント入力欄 */}
          <TextField
            inputRef={textareaRef}
            label="コメントを投稿する"
            multiline
            minRows={4}
            maxRows={8}
            variant="outlined"
            disabled={disabled}
            css={textarea}
            slotProps={{ htmlInput: { maxLength: 300 } }}
            {...register('commentBody')}
          />
          {/* 絵文字ボタン */}
          <IconButton
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            css={emojiBtn}
            tabIndex={-1}
            disabled={disabled}
            aria-label="絵文字を挿入"
          >
            <AddReactionIcon fontSize="medium" />
          </IconButton>
          {/* 絵文字ピッカー */}
          {showEmoji && (
            <div css={emojiPickerWrap}>
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                autoFocusSearch={false}
                emojiStyle={EmojiStyle.NATIVE}
                lazyLoadEmojis={true}
                searchDisabled={true}
                categories={[
                  { category: Categories.SUGGESTED, name: 'よく使う絵文字' },
                  { category: Categories.SMILEYS_PEOPLE, name: '顔・人物' },
                  { category: Categories.ANIMALS_NATURE, name: '動物・自然' },
                  { category: Categories.ACTIVITIES, name: '記念日とオブジェクト' },
                  { category: Categories.SYMBOLS, name: '記号' },
                ]}
                width={320}
                height={380}
                suggestedEmojisMode={SuggestionMode.FREQUENT}
              />
            </div>
          )}
        </div>
      </div>
      {/* 文字数カウンター */}
      <div css={charCountStyle(ratio)}>
        {currentLength} / {MAX_COMMENT_LENGTH}
      </div>
      <div css={footer}>
        {/* 投稿ボタン：状態で文言出し分け */}
        <Button variant="contained" type="submit" disabled={disabled} css={submitBtn}>
          {completed
            ? text.postComment.sucsess
            : postCommentMutation.isError
              ? text.postComment.isError
              : text.postComment.default}
        </Button>
      </div>
    </form>
  )
}

export default CommentForm

/* ---- styles ---- */

// フォーム全体
const formWrap = css({
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 3px 18px rgba(0,0,0,0.08)',
  padding: '22px 22px 18px 22px',
  maxWidth: 900,
  margin: '32px auto 18px auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  border: '1.5px solid #f2f4f8',
  position: 'relative',
})

// エラーメッセージ表示用
const errorMsg = css({
  color: '#f44336',
  fontWeight: 700,
  fontSize: 16,
  marginBottom: 6,
  marginTop: 2,
  paddingLeft: 4,
  minHeight: 24,
})

// テキストエリア+絵文字ボタンのラッパー
const inputRow = css({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
})

// テキストエリア外枠
const textareaContainer = css({
  position: 'relative',
  width: '100%',
})

// コメント入力欄
const textarea = css({
  width: '100%',
  fontSize: 17,
  background: '#f9fafb',
  borderRadius: 10,
  '.MuiInputBase-root': {
    borderRadius: 10,
    fontSize: 17,
    background: '#f9fafb',
    paddingRight: 44, // 絵文字ボタン分
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: '#e5e7eb',
  },
  '.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: '#f44336',
  },
})

// 絵文字ボタン
const emojiBtn = css({
  position: 'absolute',
  right: 8,
  bottom: 12,
  zIndex: 2,
  width: 38,
  height: 38,
  borderRadius: '50%',
  background: '#f4f5f9',
  boxShadow: '0 1px 4px rgba(100,150,200,0.07)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s',
  '&:hover': {
    background: '#e9ebf0',
  },
  '&:disabled': {
    color: '#aaa',
    opacity: 0.3,
    cursor: 'default',
  },
})

// 絵文字ピッカー
const emojiPickerWrap = css({
  position: 'absolute',
  right: 0,
  bottom: 54,
  zIndex: 10,
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 3px 32px rgba(80,100,120,0.18)',
  padding: 4,
})

// フッター（ボタンエリア）
const footer = css({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 8,
})

// 投稿ボタン
const submitBtn = css({
  minWidth: 128,
  minHeight: 44,
  fontWeight: 700,
  fontSize: 16,
  borderRadius: 8,
  boxShadow: '0 2px 6px rgba(120,180,120,0.09)',
  letterSpacing: 1,
  background: 'linear-gradient(90deg, #6EE7B7 0%, #22C55E 50%, #15803D 100%)',
  color: '#fff',
  transition: '0.18s',
  '&:disabled': {
    opacity: 0.5,
    background: '#15803D',
    color: '#fff',
  },
})

const getColorByLength = (ratio: number) => {
  if (ratio < 0.8) return '#999' // 通常（灰色）
  if (ratio < 1.0) return '#f57c00' // 警告（オレンジ）
  return '#e53935' // 限界（赤）
}

const charCountStyle = (ratio: number) =>
  css({
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 500,
    marginTop: 6,
    marginRight: 4,
    color: getColorByLength(ratio),
    transition: 'color 0.2s ease',
  })
