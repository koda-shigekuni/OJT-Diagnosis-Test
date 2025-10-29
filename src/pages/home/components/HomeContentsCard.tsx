/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import CommentIcon from '@mui/icons-material/Comment'
import FavoriteIcon from '@mui/icons-material/Favorite'
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { GetHomeContentsResponse } from '../../../api/type/response/home'
import defaultImage from '../../../assets/NOIMAGE.png'
import type { RootState } from '../../../redux/store'
import { useAppSelector } from '../../../redux/store/hook'
import { contentDetailPath } from '../../../utils/URL'

interface Props {
  content: GetHomeContentsResponse
}

/**
 * コンテンツカードのレイアウトをするコンポーネント
 * レイアウト維持のまま視認性を改善（タイトル拡大・左寄せ／投稿者・カテゴリ小さめ）
 */
const HomeContentsCard = ({ content }: Props) => {
  const navigate = useNavigate()
  const src = content.image || defaultImage
  // Reduxストアからカテゴリ配列取得
  const categories = useAppSelector((state: RootState) => state.category.items)
  // CategoryIDが一致するものを検索
  const category = categories.find(cat => cat.id === content.category_id)

  return (
    <Card css={cardStyle}>
      {/* アクションエリアをクリック可能にする */}
      <CardActionArea css={actionAreaStyle} onClick={() => navigate(contentDetailPath(content.id))}>
        {/* 画像部分 */}
        <CardMedia component="img" src={src} css={mediaStyle} />

        <CardContent css={contentStyle}>
          {/* タイトル*/}
          <Typography css={titleTextStyle}>{content.title}</Typography>
          {/* 概要 */}
          <Typography variant="body2" color="text.secondary" css={summaryTextStyle}>
            {content.summary}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions css={topActionsStyle}>
        <Box css={statsBoxStyle}>
          <CommentIcon fontSize="small" css={commentIconStyle} />
          {/* コメント数を表示*/}
          <Typography variant="body2" css={commentTextStyle}>
            {content.comment_count}
          </Typography>

          <FavoriteIcon fontSize="small" css={favoriteIconStyle} />
          {/* いいね数を表示 */}
          <Typography variant="body2" css={favoriteTextStyle}>
            {content.favorite_count}
          </Typography>
        </Box>
      </CardActions>

      <Divider css={dividerStyle} />

      <CardActions css={bottomActionsStyle} disableSpacing>
        <Box css={postBoxStyle}>
          {/* 投稿者のアバター*/}
          <Avatar src={content.user_icon || undefined} css={avatarStyle}>
            {!content.user_icon && content.post_name?.[0]}
          </Avatar>
          {/* 投稿者名（小さめ・caption相当） */}
          <Typography variant="caption" css={postTextStyle}>
            {content.post_name}
          </Typography>
        </Box>

        {/* カテゴリ名（小さめ・サブトーン） */}
        <Typography variant="caption" color="text.secondary" css={categoryTextStyle}>
          {category ? category.label : '-'}
        </Typography>
      </CardActions>
    </Card>
  )
}

export default HomeContentsCard

// CSS-----------------------------------------------------------------------------------------------------------------------------------

/** 基本レイアウト */
const cardStyle = css({
  position: 'relative',
  overflow: 'hidden',
  width: 246,
  height: 345,
  borderRadius: 16,
  boxShadow:
    '0px 1px 3px rgba(0,0,0,0.2),0px 1px 1px rgba(0,0,0,0.14),0px 2px 1px rgba(0,0,0,0.12)',
  display: 'flex',
  flexDirection: 'column',
  marginRight: 8,
  marginBottom: 16,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    transition: 'background-color 0.3s ease',
    pointerEvents: 'none',
  },
  '&:hover::after': {
    backgroundColor: 'rgba(255, 200, 98, 0.25)',
  },
})

/** アクションエリア用レイアウト */
const actionAreaStyle = css({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
})

/** 画像表示スタイル */
const mediaStyle = css({
  width: '100%',
  height: 138,
  flexShrink: 0,
  objectFit: 'cover',
})

/** コンテンツ部分のレイアウト（ネスト選択子は撤廃し個別に制御） */
const contentStyle = css({
  flexGrow: 1,
  paddingInline: 16,
  paddingTop: 8,
})

/** タイトル用 */
const titleTextStyle = css({
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '16px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  minHeight: '2.4rem',
})

/** 要約用*/
const summaryTextStyle = css({
  textAlign: 'left',
  display: '-webkit-box',
  fontSize: '14px',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  minHeight: '2.4rem',
})

/** 上部アクションボタン群のレイアウト */
const topActionsStyle = css({
  paddingInline: 16,
  paddingBottom: 8,
  display: 'flex',
  justifyContent: 'flex-end',
  flexShrink: 0,
})

/** コメント＆いいね数用ボックス */
const statsBoxStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

/** コメントアイコン色 */
const commentIconStyle = css({
  color: '#4caf50',
})

/** コメント数テキスト */
const commentTextStyle = css({
  fontWeight: 'bold',
  color: '#4caf50',
})

/** いいねアイコン色 */
const favoriteIconStyle = css({
  marginLeft: 16,
  color: 'orange',
})

/** いいね数テキスト */
const favoriteTextStyle = css({
  fontWeight: 'bold',
  color: 'orange',
})

/** 区切り線 */
const dividerStyle = css({
  width: 'calc(100% - 16px)',
  margin: '3.2px auto',
  borderColor: '#e0e0e0',
  flexShrink: 0,
})

/** 下部アクション群のレイアウト */
const bottomActionsStyle = css({
  padding: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
  height: 32,
  marginTop: 'auto',
})

/** 投稿者情報ボックス */
const postBoxStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
})

/** アバタースタイル */
const avatarStyle = css({
  width: 26,
  height: 26,
  fontSize: 14,
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

/** 投稿者名テキスト*/
const postTextStyle = css({
  fontWeight: 600,
  fontSize: '0.75rem',
  lineHeight: 1.2,
})

/** カテゴリ名テキスト*/
const categoryTextStyle = css({
  paddingLeft: 8,
  fontSize: '0.72rem',
  lineHeight: 1.2,
  letterSpacing: '0.01em',
})
