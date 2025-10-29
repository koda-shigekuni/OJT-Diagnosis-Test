import api from '../axios'
import {
  ADMIN_COMMENT_DELETE,
  ADMIN_CONTENTS,
  ADMIN_CONTENTS_DETAIL,
  ADMIN_CONTENTS_DSPLAYCHANGE,
} from '../requesUrl'
import type { GetAdminContentDetailRequest } from '../type/request/AdminContentDetail'
import type { GetAdminContentsResponse } from '../type/response/adminContent'
import type { GetAdminContentDetailResponse } from '../type/response/AdminContentDetail'

/**
 * 検索パラメータ
 */
type Params = {
  status: string
  title: string
  empName: string
  categoryId?: string
}

/**
 * コンテンツ掲載切替パラメータ
 */
type UpdateStatusRequest = {
  contents_id: number
  display_type: number
}

/**
 * コメント論理削除時のパラメータ
 */
type DeleteComentRequest = {
  id: number
  ent_kbn: number
}

/**
 * コンテンツ一覧情報取得API
 * @returns
 */
export const getAdminContents = async (params: Params): Promise<GetAdminContentsResponse> => {
  const response = await api.get<GetAdminContentsResponse>(ADMIN_CONTENTS, {
    params: {
      status: params.status,
      title: params.title,
      empName: params.empName,
      categoryId: params.categoryId,
    },
  })
  return response.data
}

/**
 * コンテンツ詳細取得API
 * @param params
 * @returns
 */
export const getAdminContentsDetail = async (params: GetAdminContentDetailRequest) => {
  const response = await api.get<GetAdminContentDetailResponse>(ADMIN_CONTENTS_DETAIL, { params })
  return response.data
}

/**
 * コンテンツ掲載ステータス切り替えAPI
 * @param params
 * @returns
 */
export const AdminContentDisplayChange = async (params: UpdateStatusRequest) => {
  const response = await api.post(ADMIN_CONTENTS_DSPLAYCHANGE, params)
  return response.data
}

/**
 * コメント論理削除API
 * @param params
 * @returns
 */
export const AdminComentDelete = async (params: DeleteComentRequest) => {
  const response = await api.post(ADMIN_COMMENT_DELETE, params)
  return response.data
}
