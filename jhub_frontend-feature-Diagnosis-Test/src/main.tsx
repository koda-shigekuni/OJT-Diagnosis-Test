import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import smoothscroll from 'smoothscroll-polyfill'
import App from './App.tsx'
import './css/index.css'
import theme from './css/theme.ts'
import { store } from './redux/store.ts'

const queryClient = new QueryClient()
smoothscroll.polyfill()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            preventDuplicate={false}
            domRoot={document.body}
          >
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)
