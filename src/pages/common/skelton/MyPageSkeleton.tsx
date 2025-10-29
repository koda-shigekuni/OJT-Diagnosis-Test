/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import ArticleIcon from '@mui/icons-material/Article'
// import ErrorIcon from '@mui/icons-material/Error'
import PersonIcon from '@mui/icons-material/Person'
// import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import { Box, List, ListItem, ListItemIcon, ListItemText, Paper, Skeleton } from '@mui/material'
import ContentsWrapper from '../../common/contentsWrapper'

const MyPageSkeleton = () => {
  return (
    <ContentsWrapper>
      <Box css={styles.layout}>
        {/* サイドメニュー側 */}
        <Paper css={styles.menucard}>
          <List>
            <ListItem css={styles.listText}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="マイページ" />
            </ListItem>
            <ListItem css={styles.listText}>
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="コメント投稿履歴" />
            </ListItem>
            {/* <ListItem css={styles.listText}>
              <ListItemIcon>
                <ErrorIcon />
              </ListItemIcon>
              <ListItemText primary="お知らせ" />
            </ListItem>
            <ListItem css={styles.listText}>
              <ListItemIcon>
                <WorkHistoryIcon />
              </ListItemIcon>
              <ListItemText primary="アップデート内容" />
            </ListItem> */}
          </List>
        </Paper>

        {/* メインカード */}
        <Paper css={[styles.card, styles.mainCard]}>
          <Skeleton variant="text" width="40%" height={40} />

          <Box css={styles.avatarBox}>
            <Skeleton variant="circular" width={120} height={120} style={{ textAlign: 'center' }} />
          </Box>

          <Skeleton variant="text" width="60%" height={30} style={{ margin: '16px auto' }} />

          <Box mt={2}>
            <Skeleton variant="text" width="30%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={30} />
          </Box>

          <Box mt={4}>
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={60} />
            <Skeleton variant="rectangular" width="100%" height={60} />
          </Box>
        </Paper>
      </Box>
    </ContentsWrapper>
  )
}

export default MyPageSkeleton

const styles = {
  layout: css({
    padding: 10,
    display: 'flex',
    gap: 110,
    justifyContent: 'center',
  }),
  card: css({
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    maxWidth: 400,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  }),
  menucard: css({
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '20%',
    maxWidth: 400,
    height: '50%',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  }),
  mainCard: css({
    flex: 1,
    minHeight: '750px',
    padding: '50px',
    maxWidth: 700,
  }),
  avatarBox: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  }),
  listText: css({
    borderBottom: 'double',
  }),
}
