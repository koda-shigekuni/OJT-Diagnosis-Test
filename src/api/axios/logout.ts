import api from '../axios'
import { POST_LOGOUT } from '../requesUrl'

export const postLogout = async (): Promise<void> => {
  await api.post(POST_LOGOUT, {}, { withCredentials: true })
}
