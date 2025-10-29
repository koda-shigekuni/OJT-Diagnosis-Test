import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../redux/store/hook'

/**
 * 管理者専用ルート
 */
const AdminRoute = () => {
  const { is_admin_hub } = useAppSelector(state => state.adminJudge)

  // 管理者以外は即ホームにリダイレクト
  if (is_admin_hub !== '1') {
    return <Navigate to="/home" replace />
  }

  // 管理者なら子ルートを表示
  return <Outlet />
}

export default AdminRoute
