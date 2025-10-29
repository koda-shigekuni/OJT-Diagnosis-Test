import api from '../axios'
import { ADMIN_USERS } from '../requesUrl'
import type { GetAdminUserList } from '../type/response/adminUserList'

type Params = {
  authority: string
  empName: string
}

/**
 * ユーザ一覧取得API
 * @param params
 * @returns
 */
export const getAdminUserList = async (params: Params): Promise<GetAdminUserList> => {
  const response = await api.get<GetAdminUserList>(ADMIN_USERS, {
    params: {
      authority: params.authority,
      empName: params.empName,
    },
  })
  return response.data
}
/**
 * ユーザー権限変更API
 * @param params
 * @returns
 */
export const updateUserAuthority = async (params: { empId: string; authority: string }) => {
  const response = await api.post('/admin/updateUserAuthority', {
    empId: params.empId,
    authority: params.authority,
    withCredentials: true,
  })
  return response.data
}
