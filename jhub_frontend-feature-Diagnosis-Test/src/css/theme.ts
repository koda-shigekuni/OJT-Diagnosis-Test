/* MUIコンポーネントのベースCSS*/
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent', // 背景色
          padding: '0',
          fontSize: '16px',
        },
        standardError: {
          backgroundColor: 'transparent',
          color: '#d32f2f',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: '16px',
        },
      },
    },
  },
})

export default theme
