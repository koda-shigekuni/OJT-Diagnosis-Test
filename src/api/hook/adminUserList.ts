// frontend/src/api/hook/adminUserList.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAdminUserList, updateUserAuthority } from '../axios/adminUserList'
import type { GetAdminUserList } from '../type/response/adminUserList'

type Params = {
  authority: string
  empName: string
}

// ユーザ一覧取得
export const useGetAdminUserQuery = (params: Params) =>
  useQuery<GetAdminUserList, Error>({
    queryKey: ['adminUserList', params],
    queryFn: () => getAdminUserList(params),
  })

// 権限更新
export const useUpdateUserAuthority = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { empId: string; authority: string }) => updateUserAuthority(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUserList'] })
    },
  })
}
