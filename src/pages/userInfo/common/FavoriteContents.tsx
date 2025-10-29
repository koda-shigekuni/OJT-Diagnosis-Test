/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import ArticleIcon from '@mui/icons-material/Article'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CONTENT_DETAIL_URL } from '../../../utils/URL'
import text from '../../../utils/text.json'

type Content = {
  id: number
  title: string
  comment_points: number | null
  like_points: number | null
}
type Props = {
  favorite_contents: Content[]
}
/**
 *
 * お気に入りコンテンツ（上位3位）を表示するコンポーネント
 * @returns
 */
const FavoriteContents = ({ favorite_contents }: Props) => {
  const navigate = useNavigate()

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return css({ color: '#FFD700', fontSize: 30 })
      case 1:
        return css({ color: '#C0C0C0', fontSize: 30 })
      case 2:
        return css({ color: '#CD7F32', fontSize: 30 })
      default:
        return css({ color: 'black' })
    }
  }

  return (
    <Box mt={2}>
      <Typography fontWeight="bold" fontSize="20px">
        {text.mypage.favorite_content}
      </Typography>

      {favorite_contents.length === 0 ? (
        <Typography mt={2} fontSize="16px" color="textSecondary">
          {text.mypage.no_content}
        </Typography>
      ) : (
        favorite_contents.map((content, idx) => (
          <Box key={content.id} mt={1} css={styles.popularItem}>
            <Box css={styles.popularTextContainer}>
              <Typography css={[styles.rankNumber, getRankColor(idx)]}>{idx + 1}.</Typography>
              <EqualizerIcon css={styles.icon} />
              <span
                onClick={() => navigate(`${CONTENT_DETAIL_URL}/${content.id}`)}
                css={styles.popularText}
              >
                {content.title}
              </span>
            </Box>
            <Box css={styles.rightInline}>
              <ArticleIcon css={styles.commentSmall} />
              <Typography css={styles.countComText}>{content.comment_points || 0}</Typography>
              <FavoriteIcon css={styles.favoriteSmall} />
              <Typography css={styles.countFavText}>{content.like_points || 0}</Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  )
}

export default FavoriteContents

const styles = {
  popularItem: css({
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    borderBottom: '1px solid #ddd',
    gap: 6,
  }),
  popularTextContainer: css({ display: 'flex', alignItems: 'center', fontWeight: 'bold', gap: 4 }),
  rankNumber: css({ fontWeight: 'bold' }),
  icon: css({ fontSize: 24 }),
  popularText: css({ fontWeight: 'bold', color: 'blue', cursor: 'pointer' }),
  rightInline: css({ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }),
  commentSmall: css({ fontSize: 18, color: 'green' }),
  favoriteSmall: css({ fontSize: 18, color: 'orangered' }),
  countComText: css({ color: 'green', fontSize: 14 }),
  countFavText: css({ color: 'orangered', fontSize: 14 }),
}
