export const CONTENTS_URL = '/contents'
export const CONTENT_DETAIL_URL = '/contentDetail'
export const ADD_CONTENTS_URL = '/addContents'
export const LOGIN_URL = '/login'
export const TEST_URL = '/test'
export const JSS_LOGIN_URL = 'http://js-r1go:8088/jss/login'
export const MYPAGE_URL = '/mypage'
export const MY_CONTENTS_URL = '/myContents'
export const HOME_URL = '/home'
export const ADMIN_INIT = '/admin'
export const ADMIN_CATEGORY = '/admin/category'
export const ADMIN_CONTENTS = '/admin/contents'
export const ADMIN_USER_LIST = '/admin/userList'
//詳細画面のパスを生成
export const contentDetailPath = (id: number) => `${CONTENT_DETAIL_URL}/${id}`
export const contentsEditPath = (id: number) => `${CONTENTS_EDIT_URL}/${id}`
export const ADMIN_CONTENT_DETAIL = '/admin/contentDetail'
export const CONTENTS_EDIT_URL = '/contents/edit'
