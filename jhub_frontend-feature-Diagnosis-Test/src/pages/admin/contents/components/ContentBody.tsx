import { Box, Typography } from '@mui/material'
import text from '../../../../utils/text.json'
import RichTextViewer from '../../../contents/common/RichTextViewer'
import { styles } from '../style/styles'

type Props = {
  summary: string
  content: string
}

/**
 * コンテンツボディー
 * @param param0
 * @returns
 */
const ContentBody = ({ summary, content }: Props) => (
  <>
    <Box sx={styles.contentBox}>
      <Typography sx={styles.summary}>{text.adminContentsDetail.summary}</Typography>
      <Typography sx={styles.summarymain}>{summary}</Typography>
    </Box>
    <Box sx={styles.contentBox}>
      <Typography sx={styles.summary}>{text.adminContentsDetail.content}</Typography>
      <RichTextViewer content={content}></RichTextViewer>
    </Box>
  </>
)

export default ContentBody
