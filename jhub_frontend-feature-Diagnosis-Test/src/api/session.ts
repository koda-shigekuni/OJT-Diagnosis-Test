import { useQuery } from '@tanstack/react-query'
import api from './axios'
import { GET_SESSION } from './requesUrl'

export type Session = {
  emp_id: string
}

export const checkSession = async (): Promise<Session> => {
  const res = await api.get<Session>('/session')
  return res.data
}

type SessionResponse = {
  emp_id: string
}

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async (): Promise<SessionResponse> => {
      const res = await api.get(GET_SESSION)
      return res.data as SessionResponse
    },
  })
}
