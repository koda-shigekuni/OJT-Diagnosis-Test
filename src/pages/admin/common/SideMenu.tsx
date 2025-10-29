/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  AdminPanelSettings,
  ExpandLess,
  ExpandMore,
  Home,
  List as ListIcon,
  People,
  Storage,
} from '@mui/icons-material'
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import text from '../../../utils/text.json'

/**
 * サイドバーのメニューコンポーネント
 * 管理画面のナビゲーションメニューを表示する
 * @returns {JSX.Element}
 */
const SidebarMenu = () => {
  // マスターデータメニューの開閉状態
  const [openMaster, setOpenMaster] = useState(false)
  const navigate = useNavigate()

  return (
    <Box css={styles.sidebar}>
      {/* 上部メニュー群 */}
      <List component="nav" css={styles.menuList}>
        <ListItemButton onClick={() => navigate('/admin')}>
          <ListItemIcon>
            <AdminPanelSettings htmlColor="#fff" />
          </ListItemIcon>
          <ListItemText primary={text.adminInit.title} css={styles.menuText} />
        </ListItemButton>
        {/* コンテンツ管理画面へのリンク */}
        <ListItemButton onClick={() => navigate('/admin/contents')}>
          <ListItemIcon>
            <ListIcon htmlColor="#fff" />
          </ListItemIcon>
          <ListItemText primary={text.adminContents.title} css={styles.menuText} />
        </ListItemButton>

        {/* マスターデータメニューのトグルボタン */}
        <ListItemButton onClick={() => setOpenMaster(!openMaster)}>
          <ListItemIcon>
            <Storage htmlColor="#fff" />
          </ListItemIcon>
          <ListItemText primary={text.adminSide.mstdate} css={styles.menuText} />
          {/* 開閉状態によってアイコンを切り替え */}
          {openMaster ? <ExpandLess htmlColor="#fff" /> : <ExpandMore htmlColor="#fff" />}
        </ListItemButton>

        {/* マスターデータのサブメニュー（折りたたみ部分） */}
        <Collapse in={openMaster} timeout="auto" unmountOnExit>
          <List onClick={() => navigate('/admin/category')} component="div" disablePadding>
            <ListItemButton css={styles.subItem}>
              <ListItemText primary={text.adminSide.categoryAll} css={styles.menuText} />
            </ListItemButton>
          </List>
        </Collapse>

        {/* ユーザー管理画面へのリンク */}
        <ListItemButton onClick={() => navigate('/admin/userList')}>
          <ListItemIcon>
            <People htmlColor="#fff" />
          </ListItemIcon>
          <ListItemText primary={text.adminSide.userAll} css={styles.menuText} />
        </ListItemButton>
      </List>

      {/* 下部のホーム画面へ戻るボタン */}
      <List>
        <ListItemButton onClick={() => navigate('/home')} css={styles.homeButton}>
          <ListItemIcon>
            <Home htmlColor="#fff" />
          </ListItemIcon>
          <ListItemText primary={text.adminSide.homeBack} css={styles.menuText} />
        </ListItemButton>
      </List>
    </Box>
  )
}

export default SidebarMenu

const styles = {
  sidebar: css({
    position: 'fixed', // 画面に固定
    top: 0, // 上端に固定
    left: 0, // 左端に固定
    width: '260px',
    zIndex: 100,
    height: '100vh', // 画面の高さいっぱいに
    backgroundColor: '#0050b3',
    color: '#fff',
    paddingTop: '30px',
    display: 'flex',
    flexDirection: 'column',
  }),
  menuList: css({
    flexGrow: 1, // 下のホームボタンを下部に押し出す
  }),
  menuText: css({
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    bottom: 0,
  }),
  subItem: css({
    paddingLeft: '32px', // サブメニューの左側の余白
  }),
  homeButton: css({
    marginTop: 'auto', // 一番下に配置
  }),
}
