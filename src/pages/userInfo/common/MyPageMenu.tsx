/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import ArticleIcon from '@mui/icons-material/Article'
// import ErrorIcon from '@mui/icons-material/Error'
import PersonIcon from '@mui/icons-material/Person'
// import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import { Home } from '@mui/icons-material'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import { List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { postLogout } from '../../../api/axios/logout'
import text from '../../../utils/text.json'
type Props = {
  children: ReactNode
}

const MyPageMenu = ({ children }: Props) => {
  const navigate = useNavigate()
  return (
    <div css={styles.wrapper}>
      <Paper css={styles.menucard}>
        <List>
          <ListItem css={styles.listText} onClick={() => navigate('/myPage')}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={text.mypage.title} />
          </ListItem>
          <ListItem css={styles.listText} onClick={() => navigate('/myContents')}>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary={text.mypage.coment} />
          </ListItem>
          {/* <ListItem css={styles.listText}>
            <ListItemIcon>
              <ErrorIcon />
            </ListItemIcon>
            <ListItemText primary={text.mypage.notify} />
          </ListItem>
          <ListItem css={styles.listText}>
            <ListItemIcon>
              <WorkHistoryIcon />
            </ListItemIcon>
            <ListItemText primary={text.mypage.update} />
          </ListItem> */}
          <ListItem onClick={() => navigate('/home')} css={styles.listText}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary={text.adminSide.homeBack} />
          </ListItem>
          <ListItem
            onClick={async () => {
              await postLogout()
              window.location.href = '/login' // セッション削除後にログイン画面へ
            }}
            css={styles.listText}
          >
            <ListItemIcon>
              <MeetingRoomIcon />
            </ListItemIcon>
            <ListItemText primary={text.adminSide.logout} />
          </ListItem>
        </List>
      </Paper>
      <Paper css={[styles.card, styles.mainCard]}>{children}</Paper>
    </div>
  )
}

export default MyPageMenu

const styles = {
  wrapper: css({
    display: 'flex',
    gap: '60px',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '45px',
  }),
  card: css({
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    maxWidth: 400,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  }),
  mainCard: css({
    flex: 1,
    minHeight: '750px',
    padding: '50px',
    maxWidth: 900,
    width: '850px',
  }),
  listText: css({
    borderBottom: 'double',
  }),
  menucard: css({
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '30%',
    maxWidth: 300,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  }),
}
