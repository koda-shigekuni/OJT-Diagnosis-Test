/** @jsxImportSource @emotion/react */
import { Alert, Box, Button, CircularProgress, Slide, Snackbar, Typography } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  useCommentDelete,
  useContentDisplayChange,
  useGetAdminContentsDetailQuery,
} from '../../../api/hook/adminContent'
import type { GetAdminContentDetailResponse } from '../../../api/type/response/AdminContentDetail'
import text from '../../../utils/text.json'
import AdminWrapper from '../../common/AdminWrapper'
import GenericDialog from '../category/component/GenericDialog'
import { styles } from '././style/styles'
import CommentTable from './components/CommentTable'
import ContentBody from './components/ContentBody'
import ContentHeader from './components/ContentHeader'
import ContentMeta from './components/ContentMeta'
import DialogCommentDelete from './components/DialogCommentDelete'
import DialogContentStatus from './components/DialogContentStatus'

/**
 * コンテンツ詳細/コメント一覧ページ
 * @returns
 */
const AdminContentDetail = () => {
  const { id } = useParams<{ id: string }>()

  /** API呼び出し */
  const { data, isLoading, error } = useGetAdminContentsDetailQuery(Number(id))
  const { mutate: updateStatus } = useContentDisplayChange()
  const { mutate: deleteComment } = useCommentDelete()

  /**
   * ダイアログステート
   */
  const [openDialog, setOpenDialog] = useState(false)
  const [openCommentDialog, setOpenCommentDialog] = useState(false)
  const [selectedComment, setSelectedComment] = useState<
    GetAdminContentDetailResponse['comments'][number] | null
  >(null)

  /**
   * 処理成功時トーストステート
   */
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success')

  /**
   * ローディング
   */
  if (isLoading) {
    return (
      <AdminWrapper>
        <Box css={styles.loadingBox}>
          <CircularProgress />
        </Box>
      </AdminWrapper>
    )
  }

  /**
   * コンテンツが取得できなかった場合
   * アラート文を表示
   */
  if (error || !data) {
    return (
      <AdminWrapper>
        <Typography color="error" align="center" paddingTop={'100px'}>
          {text.adminContentsDetail.detailnodata}
        </Typography>
      </AdminWrapper>
    )
  }

  /**
   * 表示定義
   */
  const statusFlag = Number(data.display_type)

  /**
   * 処理成功時
   * ダイアログを閉じ、トーストを表示
   */
  const handleStatusChange = () => {
    const newStatus = statusFlag === 0 ? 1 : 0
    updateStatus(
      { contents_id: Number(id), display_type: newStatus },
      {
        onSuccess: () => {
          setOpenDialog(false)
          if (newStatus === 0) {
            setToastMessage(text.adminContentsDetail.toastsucces)
            setToastSeverity('success')
          } else {
            setToastMessage(text.adminContentsDetail.toastcontentdown)
            setToastSeverity('error')
          }
          setToastOpen(true)
        },
      }
    )
  }

  /**
   * コメント一覧の削除アイコン押下時
   * 選択されたコメントを取得し、ダイアログを開く
   * @param comment
   */
  const handleDeleteClick = (comment: GetAdminContentDetailResponse['comments'][number]) => {
    setSelectedComment(comment)
    setOpenCommentDialog(true)
  }

  /**
   * コメント削除確認ダイアログ
   */
  const handleConfirmDelete = () => {
    if (selectedComment) {
      deleteComment(
        { id: selectedComment.id, ent_kbn: 0 },
        {
          onSuccess: () => {
            // 先にダイアログを閉じる
            setOpenCommentDialog(false)

            // コメントの中身を消す処理は少し遅らせて実行
            setTimeout(() => {
              setSelectedComment(null)
            }, 300) // アニメーション時間に合わせる

            // トースト表示
            setToastMessage(text.adminContentsDetail.toastcommentdelete)
            setToastSeverity('error')
            setToastOpen(true)
          },
        }
      )
    }
  }

  return (
    <AdminWrapper>
      <Box css={styles.header}>
        <h2>{text.adminContentsDetail.detailtitle}</h2>
      </Box>

      {/* コンテンツ詳細領域 */}
      <Box css={styles.pageWrapper}>
        <Box css={styles.detailCard}>
          <ContentHeader data={data} statusFlag={statusFlag} />
          <ContentMeta data={data} />
          <ContentBody summary={data.summary} content={data.content} />
        </Box>
      </Box>

      {/* 掲載/停止ダイアログ */}
      <GenericDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={text.adminContentsDetail.contentstatus}
        content={<DialogContentStatus data={data} statusFlag={statusFlag} />}
        actions={
          <>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{
                color: '#000',
                borderRadius: '30px',
                padding: '8px 25px',
                borderColor: 'black',
              }}
            >
              {text.adminContentsDetail.cansel}
            </Button>
            <Button
              onClick={handleStatusChange}
              variant="contained"
              sx={{
                backgroundColor: statusFlag === 1 ? '#4CAF50' : '#F44336',
                color: '#fff',
                padding: '8px 45px',
                borderRadius: '30px',
              }}
            >
              {statusFlag === 1
                ? text.adminContentsDetail.status
                : text.adminContentsDetail.statusdown}
            </Button>
          </>
        }
      />

      {/* コメント一覧 */}
      <Box css={styles.pageWrapper}>
        <CommentTable comments={data.comments} onDelete={handleDeleteClick} />
      </Box>

      {/* 掲載/掲載停止ボタン */}
      <Box textAlign={'center'} marginBottom={'30px'}>
        <Button css={styles.statusButton(statusFlag)} onClick={() => setOpenDialog(true)}>
          {statusFlag === 1 ? text.adminContentsDetail.status : text.adminContentsDetail.statusdown}
        </Button>
      </Box>

      {/* コメント削除ダイアログ */}
      <GenericDialog
        open={openCommentDialog}
        onClose={() => setOpenCommentDialog(false)}
        title={text.adminContentsDetail.deletecomment}
        content={<DialogCommentDelete comment={selectedComment} />}
        actions={
          <>
            <Button
              onClick={() => setOpenCommentDialog(false)}
              variant="outlined"
              sx={{
                color: '#000',
                borderRadius: '30px',
                padding: '8px 25px',
                borderColor: 'black',
              }}
            >
              {text.adminContentsDetail.cansel}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              sx={{
                backgroundColor: '#F44336',
                color: '#fff',
                padding: '8px 45px',
                borderRadius: '30px',
              }}
            >
              {text.adminContentsDetail.delete}
            </Button>
          </>
        }
      />

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
          severity={toastSeverity}
          variant="filled"
          sx={{
            width: '100%',
            backgroundColor: toastSeverity === 'success' ? '#4CAF50' : '#F44336',
            color: '#fff',
            padding: '10px',
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </AdminWrapper>
  )
}

export default AdminContentDetail
