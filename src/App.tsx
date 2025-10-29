import 'highlight.js/styles/atom-one-dark.css'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import AdminJudgeWrapper from '././pages/common/AdminJudgeWrapper'
import AdminCategory from './pages/admin/category/AdminCategory'
import AdminContents from './pages/admin/contents/AdminContent'
import AdminContentDetail from './pages/admin/contents/AdminContentDetail'
import AdminInit from './pages/admin/init/AdminInit'
import AdminUserList from './pages/admin/users/AdminUserList'

import AddContents from './pages/addContents/AddContentsPage'
import EditContentsPage from './pages/addContents/EditContentsPage'
import CategoryWrapper from './pages/common/CategoryWrapper'
import ContentDetail from './pages/contents/ContentDetail'
import Contents from './pages/contents/Contents'
import HomePage from './pages/home/toppage'
import Login from './pages/login/Login'
import TestPage from './pages/test/test'
import MyContents from './pages/userInfo/myContents/MyContents'
import MyPage from './pages/userInfo/MyPage'
import {
  ADD_CONTENTS_URL,
  ADMIN_CATEGORY,
  ADMIN_CONTENT_DETAIL,
  ADMIN_CONTENTS,
  ADMIN_INIT,
  ADMIN_USER_LIST,
  CONTENT_DETAIL_URL,
  CONTENTS_EDIT_URL,
  CONTENTS_URL,
  HOME_URL,
  LOGIN_URL,
  MY_CONTENTS_URL,
  MYPAGE_URL,
  TEST_URL,
} from './utils/URL'

const CategoryWrappedRoutes = () => (
  // Outletで子ルートが挿入される
  <CategoryWrapper>
    <Outlet />
  </CategoryWrapper>
)

//ユーザ情報取得リダックス
const AdminJudgeWrapperRoutes = () => (
  <AdminJudgeWrapper>
    <Outlet />
  </AdminJudgeWrapper>
)
/**
 * ルーター設定
 * 各URLとコンポーネントの定義
 * @returns
 */
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path={LOGIN_URL} element={<Login />} />
          <Route element={<AdminJudgeWrapperRoutes />}>
            <Route element={<CategoryWrappedRoutes />}>
              <Route path={ADD_CONTENTS_URL} element={<AddContents />} />
              <Route path={CONTENTS_URL} element={<Contents />} />
              <Route path={`${CONTENT_DETAIL_URL}/:id`} element={<ContentDetail />} />
              <Route path={HOME_URL} element={<HomePage />} />
              <Route path={`${CONTENTS_EDIT_URL}/:id`} element={<EditContentsPage />} />
              <Route path={ADMIN_CONTENTS} element={<AdminContents />} />
            </Route>
            <Route path={TEST_URL} element={<TestPage />} />
            <Route path={MYPAGE_URL} element={<MyPage />} />
            <Route path={MY_CONTENTS_URL} element={<MyContents />} />

            <Route path={ADMIN_INIT} element={<AdminInit />} />
            <Route path={ADMIN_CATEGORY} element={<AdminCategory />} />
            <Route path={ADMIN_USER_LIST} element={<AdminUserList />} />
            <Route path={`${ADMIN_CONTENT_DETAIL}/:id`} element={<AdminContentDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
