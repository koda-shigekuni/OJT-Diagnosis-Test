/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, FormControl, MenuItem, Select, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetAdminUserQuery, useUpdateUserAuthority } from '../../../api/hook/adminUserList'
import type { AdminUserList } from '../../../api/type/response/adminUserList'
import { setAdminJudge } from '../../../redux/slice/adminJudgeSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/store/hook'
import text from '../../../utils/text.json'
import AdminWrapper from '../../common/AdminWrapper'
import GenericDialog from '../category/component/GenericDialog'
import AdminUserCount from './component/AdminUserCount'
import AdminUserPagination from './component/AdminUserPagination'
import AdminUserSearchForm from './component/AdminUserSearchForm'
import AdminUserTable from './component/AdminUserTable'

// 定数
const rowsPerPage = 20 // 1ページあたりの表示件数
const DEFAULT_PAGE = 1 // 初期ページ番号

// APIエラーレスポンスの型
type ErrorResponse = { response?: { data?: { message?: string } } }

const AdminUserListPage = () => {
  const [searchParams] = useSearchParams() // URL のクエリパラメータ取得
  const navigate = useNavigate() // ページ遷移フック

  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.adminJudge) // 現在のユーザー情報

  // 検索条件とページ番号をまとめた state
  const initialState = { authority: '', empName: '', page: DEFAULT_PAGE }
  const [state, setState] = useState(initialState)

  // 検索フォーム用の一時入力値
  const [tempAuthority, setTempAuthority] = useState('')
  const [tempEmpName, setTempEmpName] = useState('')

  // ダイアログ関連 state
  const [open, setOpen] = useState(false) // ダイアログ開閉フラグ
  const [selectedUser, setSelectedUser] = useState<AdminUserList | null>(null) // 選択されたユーザー情報
  const [newAuthority, setNewAuthority] = useState('') // ダイアログで選択された新しい権限
  const [errorMessage, setErrorMessage] = useState('') // エラーメッセージ表示用

  // URL パラメータが変化したら state に反映
  useEffect(() => {
    const authority = searchParams.get('authority') || ''
    const empName = searchParams.get('empName') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    setState({ authority, empName, page })
  }, [searchParams])

  // ユーザー一覧取得 API
  const { data, isLoading, refetch } = useGetAdminUserQuery({
    authority: state.authority,
    empName: state.empName,
  })

  // 権限更新 API
  const { mutate, isPending } = useUpdateUserAuthority()

  // ページング処理（表示対象ユーザーを切り出す）
  const paginatedUsers = useMemo(() => {
    if (!data?.userList) return []
    const start = (state.page - 1) * rowsPerPage
    return data.userList.slice(start, start + rowsPerPage)
  }, [data?.userList, state.page])

  /** 検索ボタン押下処理 */
  const handleSearch = () => {
    // クエリパラメータを作成
    const query: Record<string, string> = {}
    if (tempAuthority) query.authority = tempAuthority
    if (tempEmpName) query.empName = tempEmpName
    query.page = '1'
    // URL を更新
    navigate(`?${new URLSearchParams(query).toString()}`)
    // API 再取得
    refetch()
    // state を更新
    setState({ authority: tempAuthority, empName: tempEmpName, page: 1 })
  }

  /** リセットボタン押下処理 */
  const handleReset = () => {
    // URL を初期化
    navigate(`?page=${DEFAULT_PAGE}`)
    // フォーム入力をクリア
    setTempAuthority('')
    setTempEmpName('')
    // state を初期化
    setState({ authority: '', empName: '', page: DEFAULT_PAGE })
  }

  /** 権限変更ダイアログを開く */
  const handleOpenDialog = (user: AdminUserList) => {
    setSelectedUser(user) // 対象ユーザーを保持
    setNewAuthority(user.is_admin_hub) // 現在の権限を初期値に設定
    setErrorMessage('') // エラーメッセージをクリア
    setOpen(true) // ダイアログを開く
  }

  /** ダイアログを閉じる */
  const handleCloseDialog = () => {
    setOpen(false)
  }

  /** ダイアログが閉じたあとにリセットする処理 */
  const handleDialogExited = () => {
    setSelectedUser(null) // ユーザー情報をリセット
    setErrorMessage('') // エラーメッセージをリセット
  }

  /** 権限更新処理 */
  const handleUpdate = () => {
    if (!selectedUser) return
    mutate(
      { empId: selectedUser.emp_id, authority: newAuthority }, // API に渡すデータ
      {
        onSuccess: () => {
          if (selectedUser.emp_id === currentUser.emp_id) {
            dispatch(setAdminJudge({ ...currentUser, is_admin_hub: newAuthority }))
          }
          handleCloseDialog()
        },
        onError: (error: unknown) => {
          // エラー時 → メッセージを表示
          if (typeof error === 'object' && error !== null && 'response' in error) {
            const err = error as ErrorResponse
            setErrorMessage(err.response?.data?.message || text.adminUserList.miss)
          } else {
            setErrorMessage(text.adminUserList.miss)
          }
        },
      }
    )
  }

  /** ページ切り替え処理 */
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    // state の page を更新
    setState(prev => ({ ...prev, page: value }))
    // URL 更新
    navigate(
      `?${new URLSearchParams({
        authority: state.authority,
        empName: state.empName,
        page: value.toString(),
      }).toString()}`
    )
  }

  return (
    <AdminWrapper>
      {/* タイトル */}
      <h2 css={styles.title}>{text.adminUserList.title}</h2>

      {/* 検索フォーム */}
      <AdminUserSearchForm
        tempAuthority={tempAuthority}
        tempEmpName={tempEmpName}
        setTempAuthority={setTempAuthority}
        setTempEmpName={setTempEmpName}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 件数表示 */}
      <AdminUserCount count={data?.userList.length ?? 0} isLoading={isLoading} />

      {/* ユーザー一覧テーブル */}
      <AdminUserTable isLoading={isLoading} users={paginatedUsers} onEdit={handleOpenDialog} />

      {/* 権限変更ダイアログ */}
      <GenericDialog
        open={open}
        onClose={handleCloseDialog}
        onExited={handleDialogExited}
        title={text.adminUserList.authorityupdate}
        content={
          <>
            {/* 対象ユーザー名とID */}
            <Typography css={styles.username}>
              {text.adminUserList.terget} {selectedUser?.emp_name} {selectedUser?.emp_id}
            </Typography>

            {/* エラーメッセージ */}
            {errorMessage && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {errorMessage}
              </Typography>
            )}

            {/* 権限選択 */}
            <FormControl sx={{ mt: 2 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                paddingRight={'8px'}
                border={'1px solid #a7a5a5ff'}
                borderRadius={'5px'}
              >
                <Box css={styles.labelBoxStyle}>{text.adminUserList.authority}</Box>
                <Select
                  value={newAuthority}
                  onChange={e => setNewAuthority(e.target.value)}
                  size="small"
                  sx={{ flex: 1, width: '220px' }}
                >
                  <MenuItem value="1">{text.adminUserList.host}</MenuItem>
                  <MenuItem value="2">{text.adminUserList.user}</MenuItem>
                </Select>
              </Box>
            </FormControl>
          </>
        }
        actions={
          <>
            {/* キャンセルボタン */}
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              color="error"
              sx={{
                borderRadius: '30px',
                padding: '8px 25px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {text.adminUserList.notselect}
            </Button>

            {/* 更新ボタン */}
            <Button
              onClick={handleUpdate}
              disabled={isPending}
              variant="contained"
              color="success"
              sx={{ padding: '8px 35px', borderRadius: '30px' }}
            >
              {text.adminUserList.changerool}
            </Button>
          </>
        }
      />

      {/* ページネーション */}
      <AdminUserPagination
        count={Math.ceil((data?.userList.length ?? 0) / rowsPerPage)}
        page={state.page}
        onChange={handlePageChange}
      />
    </AdminWrapper>
  )
}

export default AdminUserListPage

const styles = {
  title: css({ fontSize: '24px', padding: '24px' }),
  labelBoxStyle: css({
    width: 120,
    backgroundColor: '#f0f0f0',
    padding: '15px',
    textAlign: 'center',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    fontWeight: 'bold',
  }),
  username: css({
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    paddingBottom: '5px',
    textDecoration: 'underline #747373',
    textUnderlineOffset: '6px',
  }),
}
