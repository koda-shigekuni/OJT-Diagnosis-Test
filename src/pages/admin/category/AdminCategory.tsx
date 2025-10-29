/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Add } from '@mui/icons-material'
import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAdminCategoryAction, useAdminGetCategory } from '../../../api/hook/adminCategory'
import { fetchCategories } from '../../../api/hook/fetchCategories'
import type { GetAdminCategory } from '../../../api/type/response/adminCategory'
import { useAppDispatch } from '../../../redux/store/hook'
import text from '../../../utils/text.json'
import AdminWrapper from '../../common/AdminWrapper'
import CategoryPagination from './component/CategoryPagination'
import CategorySearchForm from './component/CategorySearchForm'
import CategoryTable from './component/CategoryTable'
import GenericDialog from './component/GenericDialog'
// 型定義
export interface CategoryFormValues {
  category_name: string
  display_type: number
}

// 定数
const rowsPerPage = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT: 'asc' | 'desc' = 'desc'

/**
 * カテゴリ一覧ページ
 */
const AdminCategory = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // 検索条件
  const initialSearchState = { status: '', name: '', page: DEFAULT_PAGE }
  const [searchParamsState, setSearchParamsState] = useState(initialSearchState)

  //検索初期値
  const [tempStatus, setTempStatus] = useState('')
  const [tempName, setTempName] = useState('')
  const [tempSort, setTempSort] = useState<'asc' | 'desc'>(DEFAULT_SORT)

  // ダイアログ制御
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'update'>('add')
  const [targetCategoryId, setTargetCategoryId] = useState<number | null>(null)
  const [targetStatus, setTargetStatus] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>()

  // URLパラメータを反映
  useEffect(() => {
    const status = searchParams.get('status') || ''
    const name = searchParams.get('name') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    setSearchParamsState({ status, name, page })
  }, [searchParams])

  const { data, isLoading, refetch } = useAdminGetCategory({
    status: searchParamsState.status || undefined,
    name: searchParamsState.name || undefined,
  })

  const { mutate: categoryAction, isPending: categoryActionPending } = useAdminCategoryAction()

  /** ダイアログを開く */
  const handleOpenDialog = (mode: 'add' | 'update', category?: GetAdminCategory) => {
    setDialogMode(mode)
    if (mode === 'update' && category) {
      setTargetCategoryId(category.category_id)
      setTargetStatus(category.display_type)
      reset({
        category_name: category.category_name,
        display_type: category.display_type,
      })
    } else {
      setTargetCategoryId(null)
      setTargetStatus(0)
      reset({ category_name: '', display_type: 0 })
    }
    setOpenDialog(true)
  }

  /** ダイアログ閉じる */
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  /** ダイアログ閉じた後にリセット */
  const handleDialogExited = () => {
    reset({ category_name: '' })
    setTargetCategoryId(null)
    setErrorMessage(null)
  }

  /** フォーム送信 */
  const onSubmit = (values: CategoryFormValues) => {
    if (dialogMode === 'add') {
      categoryAction(
        { action: 'add', category_name: values.category_name },
        {
          onSuccess: () => {
            refetch()
            dispatch(fetchCategories())
            handleCloseDialog()
          },
          onError: () => setErrorMessage(text.adminCategoryErr.usedaddcategory),
        }
      )
    } else if (dialogMode === 'update' && targetCategoryId) {
      categoryAction(
        {
          action: 'update',
          category_id: targetCategoryId,
          category_name: values.category_name,
          display_type: values.display_type,
        },
        {
          onSuccess: () => {
            refetch()
            dispatch(fetchCategories())
            handleCloseDialog()
          },
          onError: (error: unknown) => {
            if (typeof error === 'object' && error !== null && 'response' in error) {
              const err = error as { response?: { data?: { message?: string } } }
              setErrorMessage(err.response?.data?.message || text.adminCategoryErr.miss)
            }
          },
        }
      )
    }
  }

  // ソート
  const sortedCategories = useMemo(() => {
    if (!data?.categories) return []
    return [...data.categories].sort((a, b) => {
      const dateA = new Date(a.last_post_date).getTime()
      const dateB = new Date(b.last_post_date).getTime()
      return tempSort === 'asc' ? dateA - dateB : dateB - dateA
    })
  }, [data?.categories, tempSort])

  // ページング
  const paginatedCategories = useMemo(() => {
    const start = (searchParamsState.page - 1) * rowsPerPage
    return sortedCategories.slice(start, start + rowsPerPage)
  }, [sortedCategories, searchParamsState.page])

  // 検索
  const handleSearch = () => {
    const query: Record<string, string> = {}
    if (tempStatus) query.status = tempStatus
    if (tempName) query.name = tempName
    query.page = '1'
    navigate(`?${new URLSearchParams(query).toString()}`)
    refetch()
    setSearchParamsState({ status: tempStatus, name: tempName, page: 1 })
  }

  //リセットボタン押下時
  const handleReset = () => {
    navigate(`?page=${DEFAULT_PAGE}`)
    setTempStatus('')
    setTempName('')
    setTempSort(DEFAULT_SORT)
    setSearchParamsState({ status: '', name: '', page: DEFAULT_PAGE })
  }

  //ページネーション機能
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchParamsState(prev => ({ ...prev, page: value }))
    navigate(
      `?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: value.toString() }).toString()}`
    )
  }

  return (
    <AdminWrapper>
      {/* 画面タイトル */}
      <h2 css={styles.title}>{text.adminCategory.title}</h2>

      {/* 検索フォーム */}
      <CategorySearchForm
        tempStatus={tempStatus}
        setTempStatus={setTempStatus}
        tempName={tempName}
        setTempName={setTempName}
        tempSort={tempSort}
        setTempSort={setTempSort}
        handleSearch={handleSearch}
        handleReset={handleReset}
        searchParams={searchParams}
      />

      {/* 件数表示 */}
      <Box css={styles.tableCount}>
        {!isLoading && (
          <Typography fontWeight="bold">
            {text.adminCategory.searchresult} {data?.categories.length ?? 0}{' '}
            {text.adminCategory.searchnumber}
          </Typography>
        )}
      </Box>

      {/* 追加ボタン */}
      <Box css={styles.addcell}>
        <Button style={{ fontSize: '20px' }} onClick={() => handleOpenDialog('add')}>
          <Add sx={{ verticalAlign: 'middle', mr: 1 }} />
          {text.adminCategory.addCategory}
        </Button>
      </Box>

      {/* ダイアログ */}
      <GenericDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onExited={handleDialogExited}
        title={
          dialogMode === 'add' ? text.adminCategory.addCategory : text.adminCategory.updateCategory
        }
        content={
          <form id="categoryForm" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mt: 2, textAlign: 'center', paddingBottom: '10px' }}>
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </Box>
            {/* 名称 */}
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              mb={2}
              paddingRight={'8px'}
              border={'1px solid #a7a5a5ff'}
              borderRadius={'5px'}
            >
              <Box sx={labelBoxStyle}>{text.adminCategory.name}</Box>
              <TextField
                autoFocus
                fullWidth
                size="small"
                {...register('category_name', {
                  required: text.adminCategoryErr.required,
                  maxLength: { value: 50, message: text.adminCategoryErr.length },
                })}
                error={!!errors.category_name}
                helperText={errors.category_name?.message}
              />
            </Box>

            {/* 表示ステータス（編集時のみ） */}
            {dialogMode === 'update' && (
              <Box
                display="flex"
                alignItems="center"
                textAlign={'center'}
                paddingRight={'8px'}
                gap={1}
                border={'1px solid #a7a5a5ff'}
                borderRadius={'5px'}
              >
                <Box sx={labelBoxStyle}>{text.adminCategory.status}</Box>
                <Select
                  fullWidth
                  size="small"
                  defaultValue={targetStatus}
                  {...register('display_type', { required: true })}
                >
                  <MenuItem value={0}>{text.adminCategory.displayStatuson}</MenuItem>
                  <MenuItem value={1}>{text.adminCategory.displayStatusdown}</MenuItem>
                </Select>
              </Box>
            )}
          </form>
        }
        actions={
          <>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              color="error"
              sx={{ borderRadius: '30px', padding: '8px 25px' }}
            >
              {text.adminCategory.notSelect}
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ padding: '8px 50px', borderRadius: '30px' }}
              disabled={categoryActionPending}
              type="submit"
              form="categoryForm"
            >
              {dialogMode === 'add' ? text.adminCategory.add : text.adminCategory.update}
            </Button>
          </>
        }
      />

      {/* 一覧テーブル */}
      <CategoryTable
        isLoading={isLoading}
        filteredItems={paginatedCategories}
        handleOpenDialog={handleOpenDialog}
      />

      {/* ページネーション */}
      <CategoryPagination
        page={searchParamsState.page}
        totalCount={sortedCategories.length}
        rowsPerPage={rowsPerPage}
        handlePageChange={handlePageChange}
      />
    </AdminWrapper>
  )
}

export default AdminCategory

const styles = {
  title: css({ fontSize: '24px', padding: '24px' }),
  tableCount: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #C5C5C5',
  }),
  addcell: css({ position: 'relative', top: '50px', zIndex: 1200, textAlign: 'right' }),
}

const labelBoxStyle = {
  width: 160,
  backgroundColor: '#f0f0f0',
  padding: '15px',
  textAlign: 'center',
  borderTopLeftRadius: 4,
  borderBottomLeftRadius: 4,
  fontWeight: 'bold',
}
