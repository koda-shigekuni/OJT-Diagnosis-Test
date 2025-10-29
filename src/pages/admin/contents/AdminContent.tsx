/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetAdminContentsQuery } from '../../../api/hook/adminContent'
import { useAppSelector } from '../../../redux/store/hook'
import text from '../../../utils/text.json'
import { ADMIN_CONTENT_DETAIL } from '../../../utils/URL'
import AdminWrapper from '../../common/AdminWrapper'

/** ページごとの件数 */
const rowsPerPage = 20
const DEFAULT_PAGE = 1
const SORT_ORDER: 'ASC' | 'DESC' = 'DESC'

const AdminContents = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const categories = useAppSelector(state => state.category.items)

  /** 検索条件初期値 */
  const initialSearchState = {
    status: '',
    title: '',
    empName: '',
    categoryId: '',
    page: DEFAULT_PAGE,
  }

  const [searchParamsState, setSearchParamsState] = useState(initialSearchState)
  const [tempStatus, setTempStatus] = useState('')
  const [tempTitle, setTempTitle] = useState('')
  const [tempEmpName, setTempEmpName] = useState('')
  const [tempCategoryId, setTempCategoryId] = useState('')
  const [tempSortOrder, setTempSortOrder] = useState<'ASC' | 'DESC'>(SORT_ORDER)

  /** ブラウザリロード時リセット */
  useEffect(() => {
    const [navigation] = window.performance.getEntriesByType(
      'navigation'
    ) as PerformanceNavigationTiming[]
    if (navigation?.type === 'reload') {
      const query = new URLSearchParams()
      query.set('page', DEFAULT_PAGE.toString())
      navigate(`?${query.toString()}`, { replace: true })
      setSearchParamsState(initialSearchState)
      setTempStatus('')
      setTempTitle('')
      setTempEmpName('')
      setTempCategoryId('')
      setTempSortOrder(SORT_ORDER)
    }
  }, [])

  /** URLクエリ監視 */
  useEffect(() => {
    const status = searchParams.get('status') || ''
    const title = searchParams.get('title') || ''
    const empName = searchParams.get('empName') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    setSearchParamsState({ status, title, empName, categoryId, page })
  }, [searchParams])

  /** API呼び出し */
  const { data, isLoading, refetch } = useGetAdminContentsQuery(searchParamsState)

  /** 検索ボタン */
  const handleSearch = () => {
    const query: Record<string, string> = {}
    if (tempStatus) query.status = tempStatus
    if (tempTitle) query.title = tempTitle
    if (tempEmpName) query.empName = tempEmpName
    if (tempCategoryId) query.categoryId = tempCategoryId
    query.page = '1'
    navigate(`?${new URLSearchParams(query).toString()}`)
    refetch()
  }

  /** 絞り込み＆ソート＆ページネーション */
  const filteredItems = React.useMemo(() => {
    if (!data?.items) return []

    let result = data.items

    // カテゴリフィルタ
    if (searchParamsState.categoryId) {
      const selectedCategoryId = Number(searchParamsState.categoryId)
      result = result.filter(item => item.category_id === selectedCategoryId)
    }
    // 登録日ソート
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.add_date).getTime()
      const dateB = new Date(b.add_date).getTime()
      return tempSortOrder === 'DESC' ? dateB - dateA : dateA - dateB
    })
    // ページネーション
    const startIndex = (searchParamsState.page - 1) * rowsPerPage
    return result.slice(startIndex, startIndex + rowsPerPage)
  }, [data, searchParamsState.categoryId, tempSortOrder, searchParamsState.page])
  /** リセットボタン */
  const handleReset = () => {
    const query = new URLSearchParams()
    query.set('page', DEFAULT_PAGE.toString())
    navigate(`?${query.toString()}`)
    setTempStatus('')
    setTempTitle('')
    setTempEmpName('')
    setTempCategoryId('')
    setTempSortOrder(SORT_ORDER)
  }
  /** ページ切替 */
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const query = new URLSearchParams(searchParams.toString())
    query.set('page', value.toString())
    navigate(`?${query.toString()}`)
  }
  return (
    <AdminWrapper>
      <h2 css={styles.title}>{text.adminContents.title}</h2>
      {/* 検索フォーム */}
      <Box css={styles.searchForm}>
        <Box css={styles.row}>
          <FormControl size="small" css={styles.formItem}>
            <InputLabel>{text.adminContents.statusSearch}</InputLabel>
            <Select value={tempStatus} onChange={e => setTempStatus(e.target.value)}>
              <MenuItem value="">{text.adminContents.all}</MenuItem>
              <MenuItem value="0">{text.adminContents.displayStatuson}</MenuItem>
              <MenuItem value="1">{text.adminContents.displayStatusdown}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={text.adminContents.titleSearch}
            size="small"
            value={tempTitle}
            onChange={e => setTempTitle(e.target.value)}
            css={styles.textField}
          />
        </Box>
        <Box css={styles.rowunder}>
          <FormControl size="small" css={styles.formItem}>
            <InputLabel>{text.adminContents.categorySearch}</InputLabel>
            <Select value={tempCategoryId} onChange={e => setTempCategoryId(e.target.value)}>
              <MenuItem value="">{text.adminContents.all}</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id.toString()}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={text.adminContents.userSearch}
            size="small"
            value={tempEmpName}
            onChange={e => setTempEmpName(e.target.value)}
            css={styles.textField}
          />
          <Button variant="contained" css={styles.searchButton} onClick={handleSearch}>
            {text.adminContents.search}
          </Button>
          <Button
            variant="contained"
            color="success"
            css={styles.resetButton}
            onClick={handleReset}
          >
            {text.adminContents.reset}
          </Button>
          <Select
            size="small"
            value={tempSortOrder}
            onChange={e => {
              const newOrder = e.target.value as 'ASC' | 'DESC'
              setTempSortOrder(newOrder)
              const query = new URLSearchParams(searchParams.toString())
              query.set('page', '1')
              navigate(`?${query.toString()}`)
            }}
            css={styles.sort}
          >
            <MenuItem value="DESC">{text.adminContents.sortold}</MenuItem>
            <MenuItem value="ASC">{text.adminContents.sortnew}</MenuItem>
          </Select>
        </Box>
      </Box>
      {/* 検索結果件数 */}
      <Box css={styles.tableCount}>
        {!isLoading && data?.total_contents_count !== undefined && (
          <Typography fontWeight="bold">
            {text.numberword.searchresults} {data.total_contents_count}{' '}
            {text.numberword.searchnumber}
          </Typography>
        )}
      </Box>
      {/* コンテンツ一覧テーブル */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell css={styles.lavel}>{text.adminContents.statusTable}</TableCell>
              <TableCell css={styles.lavel}>{text.adminContents.titleTable}</TableCell>
              <TableCell css={styles.lavel}>{text.adminContents.categorySearch}</TableCell>
              <TableCell css={styles.lavel}>{text.adminContents.userTable}</TableCell>
              <TableCell css={styles.lavel}>{text.adminContents.addDate}</TableCell>
              <TableCell css={styles.lavel}>{text.adminContents.postTable}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" style={{ height: '150px' }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : !data ? (
              <TableRow>
                <TableCell colSpan={6} align="center" style={{ height: '150px' }}>
                  <Typography fontWeight="bold">{text.adminerr.notdata}</Typography>
                </TableCell>
              </TableRow>
            ) : data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" style={{ height: '150px' }}>
                  <Typography fontWeight="bold">{text.adminerr.notsearch}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map(item => {
                const displayFlag = Number(item.display_type)
                const categoryName =
                  categories.find(cat => cat.id === item.category_id)?.label ?? '-'

                return (
                  <TableRow
                    key={item.content_id}
                    css={styles.tableBody}
                    onClick={() => navigate(`${ADMIN_CONTENT_DETAIL}/${item.content_id}`)}
                  >
                    <TableCell>
                      <Box css={styles.statusLabel(displayFlag)}>
                        {displayFlag === 0
                          ? text.adminContents.displayStatuson
                          : text.adminContents.displayStatusdown}
                      </Box>
                    </TableCell>
                    <TableCell css={styles.cell}>{item.contents_title}</TableCell>
                    <TableCell css={styles.cell}>{categoryName}</TableCell>
                    <TableCell css={styles.cell}>{item.post_user}</TableCell>
                    <TableCell css={styles.cell}>{item.add_date}</TableCell>
                    <TableCell css={styles.cell}>{item.last_update_date}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* ページネーション */}
      <Box css={styles.pagination}>
        <Pagination
          count={Math.ceil((data?.total_contents_count ?? 0) / rowsPerPage)}
          page={searchParamsState.page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
        />
      </Box>
    </AdminWrapper>
  )
}

export default AdminContents

/** --- CSS --- */
const styles = {
  container: css({ backgroundColor: '#E8E8E8' }),
  title: css({ fontSize: '24px', padding: '24px' }),
  searchForm: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
    padding: '20px',

    borderRadius: '8px',
  }),
  row: css({ display: 'flex', gap: '16px', alignItems: 'center' }),
  rowunder: css({
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid #C5C5C5',
  }),
  formItem: css({ minWidth: '250px', backgroundColor: '#fff' }),
  textField: css({ minWidth: '400px', backgroundColor: '#fff' }),
  searchButton: css({ height: '40px', marginLeft: '50px', minWidth: '130px' }),
  resetButton: css({ height: '40px', marginLeft: '20px', minWidth: '130px' }),
  sort: css({ marginLeft: 'auto', minWidth: '140px', backgroundColor: '#fff' }),
  statusLabel: (display_flag: number) =>
    css({
      display: 'inline-block',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '12px',
      padding: '10px 0',
      minWidth: '110px',
      textAlign: 'center',
      borderRadius: '4px',
      backgroundColor: display_flag === 0 ? '#4CAF50' : '#F44336',
    }),
  pagination: css({
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
    '& .MuiPaginationItem-root': {
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      color: '#333',
      fontWeight: 'bold',
    },
    '& .Mui-selected': {
      backgroundColor: '#e0f7fa !important',
      color: '#00796b',
      border: '1px solid #00796b',
    },
  }),
  tableCount: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  }),
  tableBody: css({
    backgroundColor: '#fff',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#ACC6FF',
    },
  }),
  cell: css({ fontSize: '18px', fontWeight: 'bold' }),
  lavel: css({ color: '#3061F1', fontWeight: 'bold' }),
}
