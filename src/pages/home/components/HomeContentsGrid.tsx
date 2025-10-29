/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { GetHomeContentsResponse } from '../../../api/type/response/home'
import HomeContentsCard from './HomeContentsCard'

interface Props {
  contents: GetHomeContentsResponse[]
}

/**
 *グリッドのレイアウトコンポーネント
 * @param GetHomeContentsResponse[]
 * @returns
 */
const HomeContentsGrid = ({ contents }: Props) => (
  <div css={containerStyle}>
    {contents.map(content => (
      <HomeContentsCard key={content.id} content={content} />
    ))}
  </div>
)

export default HomeContentsGrid

// -----------------------------CSS
// コンテナ基本レイアウト
const containerStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  justifyItems: 'center',
  margin: '0 auto',
})
