/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsxImportSource @emotion/react */
import { Box, CircularProgress } from '@mui/material'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useGetAdminJudgeQuery } from '../../api/hook/adminJudge'
import { setAdminJudge } from '../../redux/slice/adminJudgeSlice'
import { useAppDispatch, useAppSelector } from '../../redux/store/hook'
import { HOME_URL, LOGIN_URL } from '../../utils/URL' // ← LOGIN_URLもimport
import { styles } from '../admin/contents/style/styles'

type Props = { children: ReactNode }

/**
 * 管理者判定を一度だけ取得し、Reduxに保持するラッパー
 * さらに、URLに"/admin"を含むページへアクセスした際に一般ユーザなら強制リダイレクト
 */
const AdminJudgeWrapper = ({ children }: Props) => {
  const dispatch = useAppDispatch()
  const { data, isLoading, error } = useGetAdminJudgeQuery() // errorを追加
  const { is_admin_hub } = useAppSelector(state => state.adminJudge)
  const location = useLocation()

  useEffect(() => {
    if (data) {
      dispatch(setAdminJudge(data))
    }
  }, [data, dispatch])

  // === 未ログイン(401)時はログイン画面へリダイレクト ===
  if (error && (error as any).response?.status === 401) {
    return <Navigate to={LOGIN_URL} replace />
  }

  if (is_admin_hub === null || isLoading) {
    return (
      <Box>
        <div css={styles.loadingBox}>
          <CircularProgress />
        </div>
      </Box>
    )
  }

  // 管理者ではないユーザが"/admin" ページへアクセスした場合
  if (is_admin_hub !== '1' && location.pathname.includes('/admin')) {
    return <Navigate to={HOME_URL} replace />
  }

  return <>{children}</>
}

export default AdminJudgeWrapper
