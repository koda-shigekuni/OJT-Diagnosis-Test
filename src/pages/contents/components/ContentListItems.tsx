/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import CommentIcon from '@mui/icons-material/Comment'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Avatar, Box, Typography } from '@mui/material'
import type { GetContentsItem } from '../../../api/type/response/contents'
import defaultImage from '../../../assets/NOIMAGE.png'
import type { RootState } from '../../../redux/store'
import { useAppSelector } from '../../../redux/store/hook'
import text from '../../../utils/text.json'

type Props = {
  /** 一覧表示するコンテンツ情報配列 */
  items: GetContentsItem[]
  /** クリック時に呼ばれるコールバック（引数: コンテンツID） */
  onItemClick: (id: number) => void
}

/** 利用可能な画像 src かを判定 */
const isUsableImageSrc = (src: unknown): src is string => {
  if (typeof src !== 'string') return false
  const s = src.trim()
  if (s === '') return false

  // http(s) URL は許可
  if (s.startsWith('http://') || s.startsWith('https://')) return true

  // dataURL（画像）で、カンマ以降にペイロードがあること
  if (s.startsWith('data:image/')) {
    const comma = s.indexOf(',')
    if (comma === -1) return false
    const payload = s.slice(comma + 1).trim()
    return payload.length > 0 // "data:...;base64,"（空）は不可
  }

  return false
}

/**
 * コンテンツ一覧リスト表示用コンポーネント
 * カテゴリ色はReduxカテゴリストアから取得
 */
const ContentListItem = ({ items, onItemClick }: Props) => {
  // Reduxストアからカテゴリリスト取得
  const categories = useAppSelector((state: RootState) => state.category.items)

  return (
    <>
      {items.map(item => {
        const category = categories.find(cat => cat.id === item.categoryId)

        // ★ 画像の事前判定（空の dataURL を弾き、fallback 準備）
        const imageSrc = isUsableImageSrc(item.image) ? item.image : defaultImage

        return (
          <Box key={item.id} css={itemStyle} onClick={() => onItemClick(item.id)}>
            <Box css={leftStyle}>
              <Box css={userRowStyle}>
                <Avatar src={item.userIcon || undefined} css={avatarStyle}>
                  {!item.userIcon && item.postName?.[0]}
                </Avatar>
                <span css={userNameStyle}>{item.postName}</span>
              </Box>

              <Typography variant="h6" css={titleStyle}>
                {item.title}
              </Typography>

              <Typography css={summaryStyle}>{item.summary}</Typography>

              <Box css={metaRowStyle}>
                <span css={dateStyle}>
                  {text.contentResult.addDate}
                  {item.addDate}
                </span>
                <span
                  css={[
                    categoryStyle,
                    category?.colorCode
                      ? css({ backgroundColor: category.colorCode })
                      : css({ backgroundColor: '#9e9e9e' }),
                  ]}
                >
                  {category ? category.label : '-'}
                </span>
              </Box>

              <Box css={statsRowStyle}>
                <CommentIcon fontSize="small" css={commentIconStyle} />
                <span css={commentTextStyle}>{item.commentCount}</span>
                <FavoriteIcon fontSize="small" css={favoriteIconStyle} sx={{ marginLeft: 2 }} />
                <span css={favoriteTextStyle}>{item.favoriteCount}</span>
              </Box>
            </Box>

            <Box css={rightStyle}>
              <Box css={imageBoxStyle}>
                <img
                  src={imageSrc}
                  alt={item.title}
                  css={imageStyle}
                  onError={e => {
                    if (e.currentTarget.src !== defaultImage) {
                      e.currentTarget.src = defaultImage
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        )
      })}
    </>
  )
}

export default ContentListItem

// --- Emotion スタイル定義（既存） ---

/** アイテム1件分の全体ラッパー */
const itemStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  minHeight: 150,
  padding: '22px 24px',
  borderBottom: '1px solid #e3e3e3',
  background: '#fff',
  transition: 'background 0.2s',
  cursor: 'pointer',
  ':hover': { background: 'rgba(255, 200, 98, 0.25)' },
})

/** 左エリア：テキスト情報等 */
const leftStyle = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 4,
  minWidth: 0,
})

/** 右エリア：画像表示用 */
const rightStyle = css({
  width: 184,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

/** 画像の外枠ボックス */
const imageBoxStyle = css({
  width: 200,
  height: 150,
  borderRadius: 8,
  background: '#e3e3e3',
  position: 'relative',
  overflow: 'hidden',
})

/** サムネイル画像 */
const imageStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
})

/** タイトルテキスト */
const titleStyle = css({
  fontWeight: 700,
  fontSize: '1.15rem',
  margin: '8px 0 4px',
})

/** サマリーテキスト */
const summaryStyle = css({
  color: '#555',
  fontSize: '0.99rem',
  margin: 0,
  minHeight: 24,
})

/** 投稿者名 */
const userNameStyle = css({
  fontWeight: 700,
  fontSize: '1rem',
  marginRight: 8,
})

/** アバター */
const avatarStyle = css({
  width: 36,
  height: 36,
  fontSize: 18,
  textAlign: 'center',
  border: '2px solid #e0e0e0',
  background: '#f5f6fa',
  color: '#22C55E',
  fontWeight: 700,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  objectFit: 'cover',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
})

/** 投稿日・カテゴリ行 */
const metaRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontSize: '0.95rem',
  color: '#666',
  marginTop: 10,
})

/** カテゴリラベル */
const categoryStyle = css({
  color: '#fff',
  fontWeight: 700,
  borderRadius: 4,
  padding: '1px 8px',
  fontSize: '0.92rem',
})

/** コメント数・いいね数行 */
const statsRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginTop: 10,
  fontWeight: 600,
  fontSize: '1rem',
  marginLeft: 'auto',
  marginRight: 24,
})

/** コメントアイコン */
const commentIconStyle = css({ color: '#4caf50' })

/** コメント数 */
const commentTextStyle = css({ color: '#4caf50' })

/** いいねアイコン */
const favoriteIconStyle = css({ color: 'orange' })

/** いいね数 */
const favoriteTextStyle = css({ color: 'orange' })

/** 投稿者行 */
const userRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 4,
})

/** 投稿日テキスト */
const dateStyle = css({ color: '#999', fontSize: '0.9rem' })
