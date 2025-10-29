/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Pagination } from '@mui/material'

type Props = {
  count: number
  page: number
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void
}

const AdminUserPagination = ({ count, page, onChange }: Props) => {
  return (
    <Box css={styles.paginationBox}>
      <Pagination
        count={count}
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={onChange}
        color="primary"
      />
    </Box>
  )
}

export default AdminUserPagination

const styles = {
  paginationBox: css({
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
    '& .MuiPaginationItem-root': {
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      color: '#333',
      fontWeight: 'bold',
    },
    '& .Mui-selected': {
      backgroundColor: '#e0f7fa !important',
      color: '#00796b',
      border: '1px solid #00796b',
    },
  }),
}
