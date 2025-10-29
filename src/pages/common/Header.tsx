/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import HelpIcon from '@mui/icons-material/Help'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/LOGO.png'
import { useAppSelector } from '../../redux/store/hook'
import { ADMIN_INIT, HOME_URL, LOGIN_URL } from '../../utils/URL'

const ICON_SIZE = 40

/** ヘッダー */
const Header = () => {
  const navigate = useNavigate()
  const { is_admin_hub } = useAppSelector(state => state.adminJudge)

  const hiddenHelpIconPaths = [LOGIN_URL]
  const isHelpIconHidden = hiddenHelpIconPaths.includes(location.pathname)

  const hiddenNotifiIconPaths = [LOGIN_URL]
  const isNotifiIconHidden = hiddenNotifiIconPaths.includes(location.pathname)

  return (
    <header css={headerStyle}>
      <div css={headerInnerStyle}>
        {/* 左アイコン */}
        <div css={leftIconStyle}>
          <ManageAccountsIcon
            css={[adminIconStyle, is_admin_hub !== '1' && { visibility: 'hidden' }]}
            onClick={() => {
              if (is_admin_hub === '1') navigate(ADMIN_INIT)
            }}
          />
        </div>

        {/* 中央ロゴ */}
        <div css={titleStyle} onClick={() => navigate(HOME_URL)}>
          <img src={logo} alt="logo" css={logoStyle} />
        </div>

        {/* 右アイコン群 */}
        <div css={rightIconsStyle}>
          <NotificationsIcon
            css={[iconStyle, isNotifiIconHidden && { visibility: 'hidden' }]}
            onClick={() => {
              /* TODO: 通知画面に遷移 */
            }}
          />
          <HelpIcon
            css={[iconStyle, isHelpIconHidden && { visibility: 'hidden' }]}
            onClick={() => {
              /* TODO: ヘルプ画面に遷移 */
            }}
          />
        </div>
      </div>
    </header>
  )
}
export default Header

/** ヘッダーバー全体 */
const headerStyle = css({
  position: 'fixed',
  top: 0,
  width: '100%',
  height: '56px',
  backgroundColor: '#FFC862',
  zIndex: 1200,
  overflow: 'hidden',
})

/** 内側コンテナ */
const headerInnerStyle = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  height: '100%',
})

/** 左側アイコン */
const leftIconStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: ICON_SIZE + 8,
})

/** タイトル（ロゴ） */
const titleStyle = css({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
})

const logoStyle = css({
  height: '55px',
  width: 'auto',
  cursor: 'pointer',
  '@media (max-width: 600px)': {
    height: 32,
  },
})

/** アイコン共通 */
const iconStyle = css({
  width: ICON_SIZE,
  height: ICON_SIZE,
  cursor: 'pointer',
  color: 'white',
  transition: 'opacity 0.2s ease',
  ':hover': { opacity: 0.8 },
  '@media (max-width: 600px)': {
    width: 32,
    height: 32,
  },
})

/** 管理者アイコン */
const adminIconStyle = css({
  width: ICON_SIZE,
  height: ICON_SIZE,
  cursor: 'pointer',
  color: 'blue',
  transition: 'opacity 0.2s ease',
  ':hover': { opacity: 0.8 },
  '@media (max-width: 600px)': {
    width: 32,
    height: 32,
  },
})

/** 右側アイコン群 */
const rightIconsStyle = css({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  '@media (max-width: 600px)': {
    gap: '8px',
  },
})
