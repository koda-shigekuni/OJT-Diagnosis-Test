import api from '../axios'
import { GET_MYCONTENTS, GET_MYPAGE, POST_ICON } from '../requesUrl'
import type { MypageResponse } from '../type/responce/mypage'
import type { MyContentsResponse } from '../type/response/myContents'

export const getMypage = async () => {
  const res = await api.get<MypageResponse>(GET_MYPAGE)
  return res.data
}

export const postUserIcon = async (base64: string): Promise<void> => {
  await api.post(POST_ICON, { base64 }, { withCredentials: true })
}

export const getMyContents = async () => {
  const res = await api.get<MyContentsResponse>(GET_MYCONTENTS)
  return res.data
}
