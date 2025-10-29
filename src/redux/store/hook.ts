// store/hooks.ts
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'

// カスタムフックをエクスポート
export const useAppDispatch = () => useDispatch<AppDispatch>()
// useSelectorの型をRootStateに合わせてカスタマイズ
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
