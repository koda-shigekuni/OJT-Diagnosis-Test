import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { GetAdminJudge } from '../../api/type/response/adminJudge'

export type AdminJudgeState = {
  emp_id: string | null
  is_admin_hub: string | null
  image: string | null
}

const initialState: AdminJudgeState = {
  emp_id: null,
  is_admin_hub: null,
  image: null,
}

const adminJudgeSlice = createSlice({
  name: 'adminJudge',
  initialState,
  reducers: {
    // 部分更新できるように Partial<GetAdminJudge> にする
    setAdminJudge: (state, action: PayloadAction<Partial<GetAdminJudge>>) => {
      return { ...state, ...action.payload }
    },
    clearAdminJudge: state => {
      state.is_admin_hub = null
      state.image = null
    },
  },
})

export const { setAdminJudge, clearAdminJudge } = adminJudgeSlice.actions
export default adminJudgeSlice.reducer
