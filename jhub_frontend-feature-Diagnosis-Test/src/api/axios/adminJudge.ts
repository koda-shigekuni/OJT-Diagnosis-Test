import api from '../axios'
import { ADMIN_JUDGE_URL } from '../requesUrl'
import type { GetAdminJudge } from '../type/response/adminJudge'

/**
 * 管理者判定APIを呼び出す
 * @returns GetAdminJudge { is_admin_hub: '1' | '2' }
 */
export const fetchAdminJudgeApi = async (): Promise<GetAdminJudge> => {
  const response = await api.get<GetAdminJudge>(ADMIN_JUDGE_URL, {
    withCredentials: true,
  })
  return response.data
}
