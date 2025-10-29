/** @jsxImportSource @emotion/react */
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import type { GetAdminContentDetailResponse } from '../../../../api/type/response/AdminContentDetail'
import text from '../../../../utils/text.json'
import { styles } from '../style/styles'

type Props = {
  comments: GetAdminContentDetailResponse['comments']
  onDelete: (comment: GetAdminContentDetailResponse['comments'][number]) => void
}

/**
 * コメント一覧
 * @param param0
 * @returns
 */
const CommentTable = ({ comments, onDelete }: Props) => (
  <Box sx={styles.pageWrapper}>
    <Box>
      <h2 css={styles.comment}>{text.adminContentsDetail.commentlist}</h2>

      <TableContainer sx={styles.commentTableContainer}>
        <Table stickyHeader sx={styles.fullWidthTable}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '60%' }}>{text.adminContentsDetail.commentcontent}</TableCell>
              <TableCell sx={{ width: '10%' }}>{text.adminContentsDetail.post_user}</TableCell>
              <TableCell sx={{ width: '10%' }}>{text.adminContentsDetail.last_post_date}</TableCell>
              <TableCell align="center" sx={{ width: '10%' }}>
                {text.adminContentsDetail.total_like}
              </TableCell>
              <TableCell align="center" sx={{ width: '10%' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments && comments.length > 0 ? (
              comments.map(comment => (
                <TableRow key={comment.id}>
                  <TableCell sx={styles.commentBodyCell}>{comment.body}</TableCell>
                  <TableCell>{comment.post_user}</TableCell>
                  <TableCell>{comment.post_date}</TableCell>
                  <TableCell align="center">{comment.like_count}</TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="delete" color="error" onClick={() => onDelete(comment)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={styles.noCommentCell}>
                  <Typography color="textSecondary" variant="body1">
                    {text.adminContentsDetail.nocomment}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Box>
)

export default CommentTable
