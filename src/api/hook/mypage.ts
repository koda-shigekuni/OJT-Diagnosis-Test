import { useQuery } from '@tanstack/react-query'
import { getMyContents, getMypage } from '../axios/mypage'

export const useGetMypageQuery = () => {
  return useQuery({
    queryKey: ['mypage'],
    queryFn: () => getMypage(),
  })
}

export const useGetMyContentsQuery = () => {
  return useQuery({
    queryKey: ['myContents'],
    queryFn: () => getMyContents(),
  })
}
