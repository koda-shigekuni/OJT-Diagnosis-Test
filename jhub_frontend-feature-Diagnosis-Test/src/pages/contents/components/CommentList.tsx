/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useGetCommentQuery, usePostCommentMutate } from '../../../api/hook/comment'
import { useSession } from '../../../api/session'
import text from '../../../utils/text.json'
import { LikeAnimetion } from './LikeAnimetion'
import { LikeHandler } from './LikeHandler'

type commentProps = { contentsId: number }

const CommentList = ({ contentsId }: commentProps) => {
  const enabled = Number.isInteger(contentsId) && contentsId > 0
  const {
    data: comments,
    isError,
    refetch: refetchComments,
  } = useGetCommentQuery(contentsId, { enabled })

  const { data: session } = useSession()
  const postCommentMutate = usePostCommentMutate()

  // 編集モーダル管理
  const [editOpen, setEditOpen] = useState(false)
  const [editCommentId, setEditCommentId] = useState<number | null>(null)
  const [editCommentBody, setEditCommentBody] = useState('')
  const [editError, setEditError] = useState<string | null>(null)

  // 削除モーダル管理
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null)

  // ...メニュー管理
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuCommentId, setMenuCommentId] = useState<number | null>(null)

  // 編集開始
  const handleEditOpen = (commentId: number, body: string) => {
    setEditCommentId(commentId)
    setEditCommentBody(body)
    setEditOpen(true)
    setEditError(null)
    handleMenuClose()
  }
  const handleEditClose = () => setEditOpen(false)

  // 編集API呼び出し
  const handleEditSubmit = () => {
    if (!editCommentId) return
    if (!editCommentBody.trim()) {
      setEditError('コメント本文を入力してください')
      return
    }
    postCommentMutate.mutate(
      {
        action: 'update',
        contentsId,
        commentId: editCommentId,
        commentBody: editCommentBody,
      },
      {
        onSuccess: () => {
          setEditOpen(false)
          setEditError(null)
          refetchComments()
        },
        onError: () => {
          setEditError('コメント編集に失敗しました')
        },
      }
    )
  }

  // メニュー
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, commentId: number) => {
    setAnchorEl(event.currentTarget)
    setMenuCommentId(commentId)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuCommentId(null)
  }

  // 削除ダイアログを開く
  const handleDeleteDialogOpen = (commentId: number) => {
    setDeleteCommentId(commentId)
    setDeleteOpen(true)
    handleMenuClose()
  }
  const handleDeleteDialogClose = () => setDeleteOpen(false)

  // 削除処理
  const handleDelete = () => {
    if (!deleteCommentId) return
    postCommentMutate.mutate(
      {
        action: 'delete',
        contentsId,
        commentId: deleteCommentId,
        commentBody: '',
      },
      {
        onSuccess: () => {
          setDeleteOpen(false)
          refetchComments()
        },
        onError: () => {
          alert('削除に失敗しました')
        },
      }
    )
  }

  if (isError) {
    return (
      <Card css={card}>
        <Typography color="error" css={errorText}>
          {text.comment['comment.isError']}
        </Typography>
      </Card>
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <Card css={card}>
        <Typography variant="body2" css={emptyText}>
          {text.comment['comment.notComment']}
        </Typography>
      </Card>
    )
  }

  return (
    <Card css={card}>
      <Typography component="h2" css={title}>
        {text.comment['comment.title']}
      </Typography>
      <Divider css={divider} />
      <Box css={list}>
        {comments.map(comment => (
          <Box key={comment.id} css={commentItem}>
            <Box css={avatarWrap}>
              {comment.userIcon ? (
                <img src={comment.userIcon} alt={comment.postUser} css={avatarCircle} />
              ) : (
                <span css={avatarCircle}>{comment.postUser[0]}</span>
              )}
            </Box>
            <Box css={bubbleWrap}>
              <Box css={bubbleHeader}>
                <Typography variant="subtitle2" css={userNameText}>
                  {comment.postUser}
                </Typography>
                <span css={dateText}>{comment.addDate}</span>
                {/* ・・・メニュー：自分のコメントだけ */}
                {comment.postUserId === session?.emp_id && (
                  <>
                    <IconButton
                      size="small"
                      onClick={e => handleMenuOpen(e, comment.id)}
                      aria-label="メニュー"
                      css={menuButton}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && menuCommentId === comment.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleEditOpen(comment.id, comment.body ?? '')}>
                        <EditIcon fontSize="small" css={menuIcon} />
                        {text.comment['comment.edit']}
                      </MenuItem>
                      <MenuItem onClick={() => handleDeleteDialogOpen(comment.id)}>
                        <DeleteIcon fontSize="small" css={menuIconDelete} />
                        <span css={deleteMenuText}>{text.comment['comment.delete']}</span>
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
              {/* コメント本文 */}
              <Typography variant="body2" css={commentBody}>
                {comment.body}
              </Typography>
              {/* お気に入り */}
              <Box css={favoriteArea}>
                <CommentLikeButton
                  commentId={comment.id}
                  favoriteCount={comment.favoriteCount}
                  initialLiked={comment.comment_like_flag === 1}
                  onSuccess={refetchComments}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      {/* 編集用モーダル */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle css={dialogTitleCss}>
          <EditIcon fontSize="small" /> {text.editComment.title}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            value={editCommentBody}
            onChange={e => setEditCommentBody(e.target.value)}
            minRows={3}
            label="コメント本文"
            error={!!editError}
            helperText={editError}
            slotProps={{ htmlInput: { maxLength: 300 } }}
            css={editTextField}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="success" variant="outlined">
            {text.common.cancel}
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleEditSubmit}
            disabled={postCommentMutate.isPending}
          >
            {postCommentMutate.isPending ? <CircularProgress size={22} /> : text.common.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認モーダル */}
      <Dialog open={deleteOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle css={dialogTitleCss}>
          <DeleteIcon fontSize="small" color="error" /> {text.deleteComment.title}
        </DialogTitle>
        <DialogContent>
          <Typography css={deleteText}>
            {text.deleteComment.confirm}
            <br />
            {text.deleteComment.deleteconfirm}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="success" variant="outlined">
            {text.common.cancel}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={postCommentMutate.isPending}
          >
            {postCommentMutate.isPending ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              text.deleteComment.delete
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default CommentList

const CommentLikeButton = ({
  commentId,
  favoriteCount,
  initialLiked,
  onSuccess,
}: {
  commentId: number
  favoriteCount: number
  initialLiked: boolean
  onSuccess?: () => void
}) => {
  const { liked, likeCount, cooldown, handleLike } = LikeHandler(
    commentId,
    '1',
    Number(favoriteCount) || 0,
    initialLiked,
    onSuccess
  )

  return (
    <Box css={favoriteArea}>
      <LikeAnimetion liked={liked} disabled={cooldown || initialLiked} onClick={handleLike} />
      <span css={favoriteCountText}>{likeCount}</span>
    </Box>
  )
}

/* ───── styles ───── */
const card = css({
  padding: 16,
  borderRadius: 10,
  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  background: '#fff',
  width: '100%',
  maxWidth: 900,
  margin: '32px auto',
})

const title = css({
  fontSize: 28,
  margin: 0,
  paddingLeft: 14,
  marginBottom: 8,
  letterSpacing: 2,
  borderLeft: '6px solid #4caf50',
  fontFamily: '"Dela Gothic One", sans-serif',
  lineHeight: 1.2,
  display: 'flex',
  alignItems: 'center',
})

const divider = css({
  margin: '4px 0 12px',
  borderColor: '#b2b2b2',
})

const list = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
})

const commentItem = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 18,
})

const avatarWrap = css({
  flexShrink: 0,
  marginTop: 6,
})

const avatarCircle = css({
  width: 44,
  height: 44,
  background: '#f2f2f2',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  color: '#758597',
  fontSize: 22,
  objectFit: 'cover',
})

const bubbleWrap = css({
  position: 'relative',
  background: '#f7f6f6',
  borderRadius: 10,
  padding: '12px 28px 18px 18px',
  minWidth: 220,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

const bubbleHeader = css({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 6,
  gap: 10,
})

const userNameText = css({
  fontWeight: 600,
  fontSize: 16,
  color: '#555',
})

const dateText = css({
  fontSize: 12,
  color: '#aaa',
  marginLeft: 'auto',
})

const commentBody = css({
  fontSize: 17,
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  color: '#363636',
  marginBottom: 6,
})

const favoriteArea = css({
  position: 'absolute',
  right: 18,
  bottom: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  color: '#999',
  fontSize: 15,
})

const favoriteCountText = css({ fontSize: 15, color: '#999' })
const emptyText = css({ color: '#6B7280' })
const errorText = css({ fontWeight: 600 })

const editTextField = css({ marginTop: 10 })

const dialogTitleCss = css({ fontSize: 24, fontFamily: '"Dela Gothic One", sans-serif' })
const menuButton = css({ marginLeft: 2, padding: 6 })
const menuIcon = css({ marginRight: 8 })
const menuIconDelete = css({ marginRight: 8, color: '#e53935' })
const deleteMenuText = css({ color: '#e53935', fontWeight: 600 })

const deleteText = css({ color: '#e53935', fontWeight: 500, marginTop: 4, textAlign: 'center' })
