import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { HOME_URL } from '../../utils/URL'
import { postLogin } from '../axios/login'
import type { LoginRequest } from '../type/request/login'
import type { LoginResponse } from '../type/responce/login'

export const useLoginMutation = (setErrorFlg: React.Dispatch<React.SetStateAction<boolean>>) => {
  const navigate = useNavigate()
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: postLogin,

    onSuccess: response => {
      console.log('ログイン成功', response)
      navigate(HOME_URL)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      if (error.response?.status === 401) {
        console.log('401エラーキャッチ')
        setErrorFlg(true)
      }
    },
  })
}
