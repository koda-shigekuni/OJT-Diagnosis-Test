import api from '../axios'
import { LOGIN } from '../requesUrl'
import type { LoginRequest, LoginResponse } from '../type/responce/login'

export const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>(LOGIN, data, { withCredentials: true })
  return res.data
}
