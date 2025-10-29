import { Box, Typography } from '@mui/material'
import type { GetAdminContentDetailResponse } from '../../../../api/type/response/AdminContentDetail'
import text from '../../../../utils/text.json'
import { styles } from '../style/styles'

type Props = {
  data: GetAdminContentDetailResponse
}

/**
 * コンテンツメタ情報
 * @param param0
 * @returns
 */
const ContentMeta = ({ data }: Props) => (
  <Box sx={styles.Detaildata}>
    <Typography>
      {text.adminContentsDetail.savedate} {data.add_date}
    </Typography>
    <Typography>
      {text.adminContentsDetail.update} {data.upd_date ? data.upd_date : 'なし'}
    </Typography>
    <Box sx={styles.count}>
      <Typography>
        {text.adminContentsDetail.total_like} {data.like_count}
      </Typography>
      <Typography>
        {text.adminContentsDetail.total_comment} {data.comment_count}
      </Typography>
    </Box>
  </Box>
)

export default ContentMeta
