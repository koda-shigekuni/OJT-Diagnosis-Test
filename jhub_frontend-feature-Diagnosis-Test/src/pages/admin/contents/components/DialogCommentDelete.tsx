/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Typography } from '@mui/material'
import type { GetAdminContentDetailResponse } from '../../../../api/type/response/AdminContentDetail'
import text from '../../../../utils/text.json'
import { labelBoxStyle, labelStyle } from '../style/styles'

type Props = {
  comment: GetAdminContentDetailResponse['comments'][number] | null
}

/**
 * コメント削除ダイアログ
 * 表示用ダイアログ(GenericDialog)に送る中身
 * @param param0
 * @returns
 */
const DialogCommentDelete = ({ comment }: Props) => (
  <Box>
    <Box
      mt={2}
      color="red"
      fontWeight="bold"
      textAlign="center"
      paddingBottom={'30px'}
      fontSize={'20px'}
    >
      {text.adminContentsDetail.commentdeletecomfil}
    </Box>
    <Box
      display="grid"
      gridTemplateColumns="160px 1fr"
      border="1px solid #a7a5a5ff"
      borderRadius="5px"
      sx={{ maxWidth: '480px', margin: '0 auto' }}
    >
      <Box sx={labelStyle} css={styles.valueCell}>
        {text.adminContentsDetail.post_user}
      </Box>
      <Box css={styles.valueCells}>{comment?.post_user}</Box>
      <Box sx={labelBoxStyle} css={styles.valueCell}>
        {text.adminContentsDetail.commentcontent}
      </Box>
      <Box sx={styles.valueCell} css={{ maxWidth: '350px' }}>
        <Typography sx={{ wordBreak: 'break-word' }}>{comment?.body}</Typography>
      </Box>
    </Box>
  </Box>
)

export default DialogCommentDelete

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
