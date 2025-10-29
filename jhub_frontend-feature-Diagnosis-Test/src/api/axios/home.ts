import api from '../axios'
import { HOME_CONTENTS } from '../requesUrl'
import type { GetHomeContentsResponse } from '../type/response/home'

/**
 * ホーム人気一覧情報取得API
 * @returns
 */
export const getHomeContents = async (): Promise<GetHomeContentsResponse[]> => {
  const { data } = await api.get<GetHomeContentsResponse[]>(HOME_CONTENTS)
  return data
}
