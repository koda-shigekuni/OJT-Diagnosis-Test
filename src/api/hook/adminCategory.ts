import { useMutation, useQuery } from '@tanstack/react-query'
import { getAdminCategoryAxios, categoryActionAxios } from '../axios/adminCategory'
import type { GetAdminCategoryRespose } from '../type/response/adminCategory'

type Params = {
  status?: string
  name?: string
}

export const useAdminGetCategory = (params: Params) => {
  return useQuery<GetAdminCategoryRespose, Error>({
    queryKey: ['adminCategory', params], // パラメータをキーに含める
    queryFn: () => getAdminCategoryAxios(params),
  })
}

export const useAdminCategoryAction = () => {
  return useMutation({
    mutationFn: categoryActionAxios,
  })
}
