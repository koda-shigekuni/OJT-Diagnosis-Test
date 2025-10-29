import axios from 'axios'
import { LOGIN_URL } from '../utils/URL'

const BASE_URL: string = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
})
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && location.pathname !== LOGIN_URL) {
      console.log('ログイン失敗')
      window.location.href = LOGIN_URL
      console.log(window.location.href)
    }
    // if (err.response?.status === 401 && location.pathname === LOGIN_URL) {
    //   const message = err.response?.data?.message
    //   throw new Error(message)
    // }
    return Promise.reject(err)
  }
)

export default api
