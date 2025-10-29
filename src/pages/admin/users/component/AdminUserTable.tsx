/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Edit } from '@mui/icons-material'
import type { AdminUserList } from '../../../../api/type/response/adminUserList'
import text from '../../../../utils/text.json'

type Props = {
  isLoading: boolean
  users: AdminUserList[]
  onEdit: (user: AdminUserList) => void
}

const AdminUserTable = ({ isLoading, users, onEdit }: Props) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell css={styles.lavel}>{text.adminUserList.authority}</TableCell>
            <TableCell css={styles.lavel}>{text.adminUserList.name}</TableCell>
            <TableCell css={styles.lavel}>{text.adminUserList.id}</TableCell>
            <TableCell css={styles.lavel}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} align="center" style={{ height: '150px' }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" style={{ height: '150px' }}>
                <Typography fontWeight="bold">{text.adminUserList.notuser}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map(user => (
              <TableRow key={user.emp_id} css={styles.tableBody}>
                <TableCell>
                  <Box css={styles.statusLabel(user.is_admin_hub)}>
                    {user.is_admin_hub === '1' ? text.adminUserList.host : text.adminUserList.user}
                  </Box>
                </TableCell>
                <TableCell css={styles.namecell}>{user.emp_name}</TableCell>
                <TableCell css={styles.cell}>{user.emp_id}</TableCell>
                <TableCell align="right">
                  <Button css={styles.editButton} sx={{ mr: 1 }} onClick={() => onEdit(user)}>
                    <Edit sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {text.adminUserList.authorityupdate}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AdminUserTable

const styles = {
  tableBody: css({
    backgroundColor: '#fff',
    '&:hover': { backgroundColor: '#bed2fdff', cursor: 'pointer' },
  }),
  cell: css({ fontSize: '18px', fontWeight: 'bold' }),
  namecell: css({
    fontSize: '18px',
    fontWeight: 'bold',
    width: '500px',
    overflow: 'hidden',
    wordBreak: 'break-word',
  }),
  editButton: css({
    color: '#000000',
    fontWeight: 'bold',
    fontSize: '12px',
    padding: '10px 40px',
    minWidth: '160px',
    textAlign: 'center',
    border: 'none',
    borderRadius: '30px',
    background: '#D9D9D9',
  }),
  lavel: css({ color: '#3061F1', fontSize: '16px', fontWeight: 'bold' }),
  statusLabel: (is_admin_hub: string) =>
    css({
      display: 'inline-block',
      color: '#000000',
      fontWeight: 'bold',
      fontSize: '12px',
      padding: '10px 0',
      minWidth: '120px',
      textAlign: 'center',
      borderRadius: '4px',
      backgroundColor: is_admin_hub === '1' ? '#86F030' : '#D9D9D9',
    }),
}
