/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Container } from '@mui/material'
import ContentsWrapper from '../common/contentsWrapper'
import SideMenu from '../common/SideMenu'
import HomeContentsList from './components/HomeContentsList'

/**
 * サイドメニューとコンテンツ一覧を組み合わせたホームページのレイアウトを提供するコンポーネント。
 * @returns
 */
const HomePage = () => (
  <ContentsWrapper>
    {/* サイドメニューを表示 */}
    <SideMenu />
    {/* コンテンツ一覧を表示 */}
    <Container maxWidth="lg" css={containerStyle}>
      <HomeContentsList />
    </Container>
  </ContentsWrapper>
)

export default HomePage

/** コンテナスタイル*/
const containerStyle = css({
  padding: '32px 0',
})
