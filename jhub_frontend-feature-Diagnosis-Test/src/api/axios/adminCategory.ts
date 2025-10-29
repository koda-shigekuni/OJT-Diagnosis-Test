// api/axios/adminCategory.ts
import api from '../axios'
import { CATEGORY_ACTION, GET_ADMIN_CATEGORY } from '../requesUrl'
import type { GetAdminCategoryRespose } from '../type/response/adminCategory'

export const getAdminCategoryAxios = async (params?: { status?: string; name?: string }) => {
  const res = await api.get<GetAdminCategoryRespose>(GET_ADMIN_CATEGORY, { params })
  return res.data
}

export const categoryActionAxios = async (data: {
  action: 'add' | 'update' | 'display_change'
  category_id?: number
  category_name?: string
  display_type?: number
}): Promise<GetAdminCategoryRespose> => {
  const res = await api.post<GetAdminCategoryRespose>(CATEGORY_ACTION, data)
  return res.data
}
