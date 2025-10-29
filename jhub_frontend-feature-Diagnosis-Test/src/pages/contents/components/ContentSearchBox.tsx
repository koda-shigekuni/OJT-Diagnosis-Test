/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputAdornment, TextField } from '@mui/material'

type Props = {
  keyword: string
  setKeyword: (v: string) => void
  onSearch: (e: React.FormEvent) => void
}

/**
 * コンテンツ検索ボックス
 *
 * Enterキーまたはアイコンボタン押下時のみ onSearch が呼ばれます。
 */
const ContentSearchBox = ({ keyword, setKeyword, onSearch }: Props) => {
  return (
    <form css={searchFormStyle} onSubmit={onSearch}>
      <TextField
        placeholder="コンテンツのタイトル、カテゴリ、投稿者名で検索"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        size="medium"
        css={searchInputStyle}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                {/* type="submit" でEnterもクリックも同じonSearch */}
                <IconButton
                  type="submit"
                  css={iconButtonStyle}
                  aria-label="search"
                  onClick={onSearch}
                >
                  <SearchIcon css={iconStyle} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </form>
  )
}

export default ContentSearchBox

// --- Emotion スタイル定義 ---
const searchFormStyle = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
})
const searchInputStyle = css({
  background: '#fff',
  borderRadius: 20,
  width: 926,
  height: 50,
  maxWidth: '96vw',
  fontSize: '1.17rem',
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    fontSize: '1.17rem',
    background: '#fff',
    minHeight: 10,
  },
  '& input': {
    padding: '14px 12px 14px 0',
  },
})
const iconStyle = css({
  color: '#07913B',
  fontSize: 30,
})
const iconButtonStyle = css({
  padding: 8,
  color: 'inherit',
})
