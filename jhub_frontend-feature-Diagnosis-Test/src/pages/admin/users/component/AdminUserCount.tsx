/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Typography } from '@mui/material'
import text from '../../../../utils/text.json'

type Props = { count: number; isLoading: boolean }

const AdminUserCount = ({ count, isLoading }: Props) => {
  if (isLoading) return null
  return (
    <Box css={styles.tableCount}>
      <Typography fontWeight="bold">
        {text.adminUserList.result} {count} {text.adminUserList.resultnumber}
      </Typography>
    </Box>
  )
}

export default AdminUserCount

const styles = {
  tableCount: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #C5C5C5',
  }),
}
