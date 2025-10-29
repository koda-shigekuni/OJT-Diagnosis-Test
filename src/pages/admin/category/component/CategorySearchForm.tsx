/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React from 'react'
import text from '../../../../utils/text.json'

// Propsの型定義
interface Props {
  tempStatus: string
  setTempStatus: (v: string) => void
  tempName: string
  setTempName: (v: string) => void
  tempSort: 'asc' | 'desc'
  setTempSort: (v: 'asc' | 'desc') => void
  handleSearch: () => void
  handleReset: () => void
  searchParams: URLSearchParams
}

const CategorySearchForm: React.FC<Props> = ({
  tempStatus,
  setTempStatus,
  tempName,
  setTempName,
  tempSort,
  setTempSort,
  handleSearch,
  handleReset,
}) => {
  return (
    <Box css={styles.searchForm}>
      <Box css={styles.row}>
        {/* ステータス選択 */}
        <FormControl size="small" css={styles.formItem}>
          <InputLabel>{text.adminCategory.statusDisplay}</InputLabel>
          <Select value={tempStatus} onChange={e => setTempStatus(e.target.value)}>
            <MenuItem value="">{text.adminCategory.all}</MenuItem>
            <MenuItem value="0">{text.adminCategory.displayStatuson}</MenuItem>
            <MenuItem value="1">{text.adminCategory.displayStatusdown}</MenuItem>
          </Select>
        </FormControl>

        {/* カテゴリ名検索 */}
        <TextField
          label={text.adminCategory.categoryName}
          size="small"
          value={tempName}
          onChange={e => setTempName(e.target.value)}
          css={styles.textField}
        />

        {/* 検索ボタン */}
        <Button variant="contained" css={styles.searchButton} onClick={handleSearch}>
          {text.adminCategory.search}
        </Button>

        {/* リセットボタン */}
        <Button variant="contained" color="success" css={styles.resetButton} onClick={handleReset}>
          {text.adminCategory.reset}
        </Button>
      </Box>

      {/* ソート順切替 */}
      <Select
        size="small"
        value={tempSort}
        onChange={e => setTempSort(e.target.value as 'asc' | 'desc')}
        css={styles.sort}
      >
        <MenuItem value="desc">{text.adminCategory.desc}</MenuItem>
        <MenuItem value="asc">{text.adminCategory.asc}</MenuItem>
      </Select>
    </Box>
  )
}

export default CategorySearchForm

const styles = {
  searchForm: css({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    padding: '10px',
    borderRadius: '8px',
  }),
  row: css({
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flex: 1,
  }),
  sort: css({
    marginLeft: 'auto',
    minWidth: '180px',
    backgroundColor: '#fff',
  }),
  formItem: css({
    minWidth: '250px',
    backgroundColor: '#fff',
    borderRadius: '4px',
  }),
  textField: css({
    minWidth: '380px',
    backgroundColor: '#fff',
    borderRadius: '4px',
  }),
  searchButton: css({
    height: '40px',
    marginLeft: '50px',
    minWidth: '130px',
  }),
  resetButton: css({
    height: '40px',
    marginLeft: '20px',
    minWidth: '130px',
  }),
}
