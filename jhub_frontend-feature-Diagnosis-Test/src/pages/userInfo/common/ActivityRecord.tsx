/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { Box, Typography } from '@mui/material'

type Props = {
  content_count: number
  total_likes: number
  last_post_date: string | null
  text: { post_content: string; total_like: string; last_post_date: string; actibity: string }
}
/**
 *
 * 投稿数・いいね数・最終投稿日などの活動記録を表示するコンポーネント
 * @returns
 */
const ActivityRecord = ({ content_count, total_likes, last_post_date, text }: Props) => (
  <Box mt={2}>
    <Typography css={styles.popularTextContainer} fontSize="20px">
      <MenuBookIcon />
      {text.actibity}
    </Typography>
    <Box css={styles.recordRow}>
      <Typography css={styles.recordLabel}>{text.post_content}</Typography>
      <Box css={styles.centerValue}>{content_count}</Box>
    </Box>
    <Box css={styles.recordRow}>
      <Typography css={styles.recordLabel}>{text.total_like}</Typography>
      <Box css={styles.centerValue}>{total_likes}</Box>
    </Box>
    <Box css={styles.recordRow}>
      <Typography css={styles.recordLabel}>{text.last_post_date}</Typography>
      <Box css={styles.centerValue}>{last_post_date || 'なし'}</Box>
    </Box>
  </Box>
)

export default ActivityRecord

const styles = {
  recordRow: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  }),
  recordLabel: css({ fontWeight: 'bold' }),
  centerValue: css({ minWidth: 200, fontWeight: 'bold' }),
  popularTextContainer: css({
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    gap: 4,
    padding: '10px',
    borderTop: '1px solid #D3D3D3',
  }),
}
