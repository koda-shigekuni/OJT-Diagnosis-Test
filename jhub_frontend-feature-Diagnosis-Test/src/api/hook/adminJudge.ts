import { useQuery } from '@tanstack/react-query'
import { fetchAdminJudgeApi } from '../axios/adminJudge'
import type { GetAdminJudge } from '../type/response/adminJudge'

export const useGetAdminJudgeQuery = () =>
  useQuery<GetAdminJudge, Error, GetAdminJudge>({
    queryKey: ['adminjudge'],
    queryFn: fetchAdminJudgeApi,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
