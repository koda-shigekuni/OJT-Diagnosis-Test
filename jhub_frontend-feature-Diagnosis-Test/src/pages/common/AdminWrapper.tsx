/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/material'
import SideMenu from '../admin/common/SideMenu'

type Props = {
  children: React.ReactNode
}

const AdminWrapper = ({ children }: Props) => {
  return (
    <Box css={styles.root}>
      <SideMenu />
      <Box css={styles.main}>{children}</Box>
    </Box>
  )
}

export default AdminWrapper

const styles = {
  root: css({
    display: 'flex',
    backgroundColor: '#E8E8E8',
    minHeight: '100vh',
    width: '100%',
    fontFamily: '"Noto Sans JP", sans-serif',
    overflowX: 'hidden',
  }),

  main: css({
    flexGrow: 1,
    backgroundColor: '#E8E8E8',
    marginLeft: '260px',
    minHeight: '100vh',
    overflowX: 'hidden',
  }),
}
