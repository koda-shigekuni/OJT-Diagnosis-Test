import { useQuery } from '@tanstack/react-query'
import { getHomeContents } from '../axios/home'
import type { GetHomeContentsResponse } from '../type/response/home'

/**
 * HOME画面：人気コンテンツ一覧取得
 */
export const useGetHomeContentsQuery = () => {
  return useQuery<GetHomeContentsResponse[], Error>({
    queryKey: ['homeContents'],
    queryFn: () => getHomeContents(),
  })
}
