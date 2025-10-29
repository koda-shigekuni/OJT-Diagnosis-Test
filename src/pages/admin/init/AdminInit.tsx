/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import text from '../../../utils/text.json'
import AdminWrapper from '../../common/AdminWrapper'

/**
 * 管理者初期表示ページ
 * @returns
 */
const AdminInit = () => {
  return (
    <AdminWrapper>
      <h2 css={styles.title}>{text.adminInit.title}</h2>
    </AdminWrapper>
  )
}
export default AdminInit

const styles = {
  title: css({ fontSize: '24px', padding: '24px' }),
}
