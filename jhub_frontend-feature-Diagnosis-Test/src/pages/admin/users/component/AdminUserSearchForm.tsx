/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import text from '../../../../utils/text.json'

type Props = {
  tempAuthority: string
  tempEmpName: string
  setTempAuthority: (value: string) => void
  setTempEmpName: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

const AdminUserSearchForm = ({
  tempAuthority,
  tempEmpName,
  setTempAuthority,
  setTempEmpName,
  onSearch,
  onReset,
}: Props) => {
  return (
    <Box css={styles.searchForm}>
      <FormControl size="small" css={styles.formItem}>
        <InputLabel>{text.adminUserList.authority}</InputLabel>
        <Select value={tempAuthority} onChange={e => setTempAuthority(e.target.value)}>
          <MenuItem value="">{text.adminContents.all}</MenuItem>
          <MenuItem value="1">{text.adminUserList.host}</MenuItem>
          <MenuItem value="2">{text.adminUserList.user}</MenuItem>
        </Select>
      </FormControl>

      <TextField
        css={styles.textField}
        label={text.adminUserList.userSearch}
        size="small"
        value={tempEmpName}
        onChange={e => setTempEmpName(e.target.value)}
      />

      <Button variant="contained" css={styles.searchButton} onClick={onSearch}>
        {text.adminUserList.search}
      </Button>
      <Button variant="contained" color="success" css={styles.resetButton} onClick={onReset}>
        {text.adminUserList.reset}
      </Button>
    </Box>
  )
}

export default AdminUserSearchForm

const styles = {
  searchForm: css({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    padding: '10px',
    borderRadius: '8px',
  }),
  formItem: css({
    minWidth: '180px',
    backgroundColor: '#fff',
    borderRadius: '4px',
  }),
  textField: css({
    minWidth: '380px',
    backgroundColor: '#fff',
    borderRadius: '4px',
  }),
  searchButton: css({ height: '40px', marginLeft: '50px', minWidth: '130px' }),
  resetButton: css({ height: '40px', marginLeft: '20px', minWidth: '130px' }),
}
