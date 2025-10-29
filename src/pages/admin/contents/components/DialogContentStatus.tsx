/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Typography } from '@mui/material'
import type { GetAdminContentDetailResponse } from '../../../../api/type/response/AdminContentDetail'
import text from '../../../../utils/text.json'
import { labelBoxStyle, labelStyle } from '../style/styles'

type Props = {
  data: GetAdminContentDetailResponse
  statusFlag: number
}

/**
 * コンテンツ掲載/掲載停止ダイアログ
 * 表示用ダイアログ(GenericDialog)に送る中身
 * @param param0
 * @returns
 */
const DialogContentStatus = ({ data, statusFlag }: Props) => (
  <Box>
    <Box
      mt={2}
      color="red"
      fontWeight="bold"
      textAlign="center"
      paddingBottom={'30px'}
      fontSize={'20px'}
    >
      {statusFlag === 1
        ? text.adminContentsDetail.contentcomfil
        : text.adminContentsDetail.contentdowncomfil}
    </Box>

    <Box
      display="grid"
      gridTemplateColumns="160px 1fr"
      border="1px solid #a7a5a5ff"
      borderRadius="5px"
      sx={{ maxWidth: '480px', margin: '0 auto' }}
    >
      <Box sx={labelStyle} css={styles.valueCell}>
        {text.adminContentsDetail.title}
      </Box>
      <Box css={styles.valueCells} sx={{ maxWidth: '350px' }}>
        <Typography sx={{ wordBreak: 'break-word' }}>{data.title}</Typography>
      </Box>
      <Box sx={labelBoxStyle} css={styles.valueCell}>
        {text.adminContentsDetail.post_user}
      </Box>
      <Box css={styles.valueCell}>{data.content_user}</Box>
    </Box>
  </Box>
)

export default DialogContentStatus

const styles = {
  valueCell: css({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderTop: '1px solid #a7a5a5ff',
    '&:first-of-type': { borderTop: 'none' },
  }),
  valueCells: css({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    '&:first-of-type': { borderTop: 'none' },
  }),
}
