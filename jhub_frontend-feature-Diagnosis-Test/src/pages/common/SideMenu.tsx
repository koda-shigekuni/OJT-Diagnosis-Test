/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ArticleIcon from '@mui/icons-material/Article'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt'
import { Box, Drawer, IconButton, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/store/hook'
import { MYPAGE_URL } from '../../utils/URL'

const WIDTH = 65
const HEIGHT = 339
const ICON_SIZE = 48
const GAP = 1.2
const GAP_PX = `${GAP * 8}px` // 9.6px
const AVATAR_SIZE = 48

const menuItems = [
  { label: 'ホーム', icon: <HomeIcon />, path: '/home' },
  { label: 'コンテンツ一覧', icon: <ArticleIcon />, path: '/contents' },
  { label: 'コンテンツ投稿', icon: <AddCircleIcon />, path: '/addcontents' },
  { label: '診断', icon: <PsychologyAltIcon />, path: '/test' },
]

/**
 * サイドメニューコンポーネント
 * @returns
 */
const SideMenu = () => {
  const navigate = useNavigate()
  const { image } = useAppSelector(state => state.adminJudge)
  return (
    <Drawer variant="permanent" anchor="left" css={drawerStyle}>
      {menuItems.map(item => (
        <Tooltip key={item.path} title={item.label} placement="right">
          <IconButton onClick={() => navigate(item.path)} css={iconButtonBase}>
            {item.icon}
          </IconButton>
        </Tooltip>
      ))}
      <Tooltip title="マイページ" placement="right">
        <Box css={avatarWrapper} onClick={() => navigate(MYPAGE_URL)}>
          {image && image.startsWith('data:image') ? (
            <img src={image} alt="ユーザーアイコン" css={avatarStyle} />
          ) : (
            <PersonIcon css={avatarStyle} />
          )}
        </Box>
      </Tooltip>
    </Drawer>
  )
}

export default SideMenu

//CSS ----------------------------------------------------------------------------------------------------------------------------

// 基本デザインレイアウト
const drawerStyle = css({
  '& .MuiDrawer-paper': {
    position: 'fixed',
    top: '50%',
    left: '150px',
    transform: 'translateY(-50%)',
    width: `${WIDTH}px`,
    height: `${HEIGHT}px`,
    padding: '8px',
    borderRadius: `${WIDTH / 2}px`,
    backgroundColor: '#86F030',
    border: 'none',
    overflow: 'hidden',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: GAP_PX,
  },
})

// アイコンレイアウト
const iconButtonBase = css({
  color: 'white',
  padding: 0,
  marginTop: '1.6px',
  '& svg': {
    fontSize: `${ICON_SIZE}px`,
  },
})

// 間隔調整用
const avatarWrapper = css({
  marginTop: '40px', // 12 * 8px
})

// アバターサイズ調整用
const avatarStyle = css({
  width: `${AVATAR_SIZE}px`,
  height: `${AVATAR_SIZE}px`,
  borderRadius: '50%',
  cursor: 'pointer',
  objectFit: 'cover',
  objectPosition: 'center',
})
