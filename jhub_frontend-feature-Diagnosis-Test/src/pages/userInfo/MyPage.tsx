/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Alert, Box, Slide, Snackbar, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { postUserIcon } from '../../api/axios/mypage'
import { useGetMypageQuery } from '../../api/hook/mypage'
import text from '../../utils/text.json'
import ContentsWrapper from '../common/contentsWrapper'
import MyPageSkeleton from '../common/skelton/MyPageSkeleton'
import ActivityRecord from './common/ActivityRecord'
import FavoriteContents from './common/FavoriteContents'
import MyPageMenu from './common/MyPageMenu'
import UserImageUploader from './common/UserImageUpload'
import { useAppDispatch } from '../../redux/store/hook'
import { setAdminJudge } from '../../redux/slice/adminJudgeSlice'

/**
 *ユーザー情報の表示などを担当するメインページ
 * @returns
 */
const MyPage = () => {
  const dispatch = useAppDispatch()
  const { data, isLoading } = useGetMypageQuery()
  const queryClient = useQueryClient()
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success')

  if (isLoading) return <MyPageSkeleton />
  if (!data) return null

  const handleSaveIcon = async (base64: string) => {
    try {
      await postUserIcon(base64)
      await queryClient.invalidateQueries({ queryKey: ['mypage'] })
      setToastMessage(text.mypage.toast)
      setToastSeverity('success')
      dispatch(setAdminJudge({ image: base64 }))
    } catch {
      setToastMessage(text.mypage.toasterr)
      setToastSeverity('error')
    } finally {
      setToastOpen(true)
    }
  }

  return (
    <ContentsWrapper>
      <Box css={styles.layout}>
        <MyPageMenu>
          <Typography css={styles.title}>{text.mypage.title}</Typography>
          <UserImageUploader base64Image={data.user?.icon_base64 ?? null} onSave={handleSaveIcon} />
          <Typography align="center" fontWeight={'bold'}>
            {data.user?.emp_name}
          </Typography>
          <ActivityRecord
            content_count={data.actibty.content_count}
            total_likes={data.actibty.total_likes}
            last_post_date={data.actibty.last_post_date}
            text={text.mypage}
          />
          <FavoriteContents favorite_contents={data.favorite_contents} />
        </MyPageMenu>
      </Box>

      {/* トースト */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        slots={{ transition: Slide }}
        slotProps={{ transition: { direction: 'left' } }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          variant="filled"
          sx={{
            width: '100%',
            backgroundColor: toastSeverity === 'success' ? 'primary.main' : 'error.main',
            color: '#fff',
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </ContentsWrapper>
  )
}

export default MyPage

const styles = {
  layout: css({ padding: 10, display: 'flex', gap: 110, justifyContent: 'center' }),
  title: css({
    paddingTop: '5px',
    fontSize: '30px',
    fontFamily: '"Dela Gothic One", sans-serif',
    borderBottom: '1px solid #D3D3D3',
  }),
}
