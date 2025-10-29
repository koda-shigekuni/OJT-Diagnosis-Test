/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Pagination } from '@mui/material'
import React, { useEffect } from 'react'

// Propsの型定義
interface Props {
  page: number // 現在のページ番号
  totalCount: number // 総件数
  rowsPerPage: number // 1ページあたりの件数
  handlePageChange: (_: React.ChangeEvent<unknown>, value: number) => void
}

const CategoryPagination: React.FC<Props> = ({
  page,
  totalCount,
  rowsPerPage,
  handlePageChange,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [handlePageChange])
  return (
    <Box css={styles.pagination}>
      <Pagination
        count={Math.ceil(totalCount / rowsPerPage)} // 総ページ数を算出
        page={page}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        siblingCount={1} // 現在ページの左右に表示するページ数
        boundaryCount={1} // 最初と最後に表示するページ数
      />
    </Box>
  )
}

export default CategoryPagination

const styles = {
  pagination: css({
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
