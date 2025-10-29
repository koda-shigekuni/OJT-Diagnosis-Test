/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Edit } from '@mui/icons-material'
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
import React from 'react'
import type { GetAdminCategory } from '../../../../api/type/response/adminCategory'
import text from '../../../../utils/text.json'

// Propsの型定義
interface Props {
  isLoading: boolean
  filteredItems: GetAdminCategory[]
  handleOpenDialog: (mode: 'add' | 'update', category?: GetAdminCategory) => void
}

const CategoryTable: React.FC<Props> = ({ isLoading, filteredItems, handleOpenDialog }) => {
  return (
    <TableContainer>
      <Table>
        {/* テーブルヘッダー */}
        <TableHead>
          <TableRow>
            <TableCell css={styles.lavel}>{text.adminCategory.status}</TableCell>
            <TableCell css={styles.lavel}>{text.adminCategory.name}</TableCell>
            <TableCell css={styles.lavel}>{text.adminCategory.last_post_date}</TableCell>
            <TableCell css={styles.lavel}></TableCell>
          </TableRow>
        </TableHead>

        {/* テーブルボディ */}
        <TableBody>
          {/* ローディング中 */}
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} align="center" style={{ height: '150px' }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : filteredItems.length === 0 ? (
            // データがないとき
            <TableRow>
              <TableCell colSpan={4} align="center" style={{ height: '150px' }}>
                <Typography fontWeight="bold">{text.adminCategory.notData}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            // データ表示
            filteredItems.map(item => (
              <TableRow key={item.category_id} css={styles.tableBody}>
                {/* ステータスラベル */}
                <TableCell>
                  <Box css={styles.statusLabel(item.display_type)}>
                    {item.display_type === 0
                      ? text.adminCategory.displayStatuson
                      : text.adminCategory.displayStatusdown}
                  </Box>
                </TableCell>

                {/* カテゴリ名 */}
                <TableCell css={styles.namecell}>{item.category_name}</TableCell>

                {/* 最終投稿日を日本の日付形式で表示 */}
                <TableCell css={styles.cell}>
                  {new Date(item.last_post_date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </TableCell>

                {/* 操作ボタン（更新・表示切替） */}
                <TableCell align="right">
                  <Button
                    css={styles.editButton}
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenDialog('update', item)}
                  >
                    <Edit sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {text.adminCategory.update}
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

export default CategoryTable

const styles = {
  statusLabel: (status: number) =>
    css({
      display: 'inline-block',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '12px',
      padding: '10px 0',
      minWidth: '120px',
      textAlign: 'center',
      borderRadius: '4px',
      backgroundColor: status === 0 ? '#4CAF50' : '#F44336', // 公開なら緑、非公開なら赤
    }),

  changeLabel: (status: number) =>
    css({
      display: 'inline-block',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '12px',
      padding: '10px 0',
      minWidth: '160px',
      textAlign: 'center',
      borderRadius: '30px',
      backgroundColor: status === 1 ? '#4CAF50' : '#F44336',
    }),
  tableBody: css({
    backgroundColor: '#fff',
    '&:hover': { backgroundColor: '#bed2fdff', cursor: 'pointer' },
  }),

  cell: css({ fontSize: '18px', fontWeight: 'bold' }),

  namecell: css({
    fontSize: '18px',
    fontWeight: 'bold',
    width: '500px',
    WebkitBoxOrient: 'vertical',
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
}
