import { Avatar, Box, Typography } from '@mui/material'
import type { GetAdminContentDetailResponse } from '../../../../api/type/response/AdminContentDetail'
import defaultImage from '../../../../assets/NOIMAGE.png'
import text from '../../../../utils/text.json'
import { styles } from '../style/styles'

type Props = {
  data: GetAdminContentDetailResponse
  statusFlag: number
}

const isUsableImageSrc = (src: unknown): src is string => {
  if (typeof src !== 'string') return false
  const s = src.trim()
  if (s === '') return false
  return true
}

/**
 * コンテンツヘッダー
 * @param param0
 * @returns
 */
const ContentHeader = ({ data, statusFlag }: Props) => {
  const imageSrc = isUsableImageSrc(data.image) ? data.image : defaultImage

  return (
    <Box sx={styles.detailHeader}>
      <Box sx={styles.leftColumn}>
        <Box sx={styles.statusLabel(statusFlag)}>
          {statusFlag === 0
            ? text.adminContentsDetail.statuson
            : text.adminContentsDetail.statusdown}
        </Box>

        <Box sx={styles.userBox}>
          <Avatar src={data.user_icon ?? undefined} sx={{ width: 24, height: 24 }}>
            {data.content_user[0]}
          </Avatar>
          <Typography sx={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '20px' }}>
            {data.content_user}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '25px', fontWeight: 'bold', wordBreak: 'break-word' }}>
          {data.title}
        </Typography>

        {data.category_name && (
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '5px' }}>
            {text.adminContentsDetail.category} {data.category_name}
          </Typography>
        )}
      </Box>

      {data.image && (
        <Box sx={styles.thumbnailBox}>
          <img
            src={imageSrc}
            alt={data.title}
            style={{ width: '300px', height: '150px', objectFit: 'contain', borderRadius: '12px' }}
            onError={e => {
              if (e.currentTarget.src !== defaultImage) {
                e.currentTarget.src = defaultImage
              }
            }}
          />
        </Box>
      )}
    </Box>
  )
}

export default ContentHeader
