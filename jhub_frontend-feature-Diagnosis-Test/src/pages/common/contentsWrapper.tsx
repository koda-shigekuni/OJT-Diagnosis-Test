/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from './Header'

type ContentsWrapperProps = {
  children: React.ReactNode
  title?: string
  disableWrapperPadding?: boolean // 追加
}

/**
 * 画面全体を包むコンポーネント
 */
const ContentsWrapper = (props: ContentsWrapperProps) => {
  const { children, title, disableWrapperPadding } = props

  return (
    <div
      css={[
        childrenWrapperStyle,
        !disableWrapperPadding && noPaddingStyle, // 条件で上書き
      ]}
    >
      <Header />
      <div css={childrenStyle}>
        {title && <div css={titleStyle}>{title}</div>}
        {children}
      </div>
    </div>
  )
}
export default ContentsWrapper

// --- Emotionスタイル ---
const childrenWrapperStyle = css({
  backgroundColor: ' #ffc862',
  padding: '80px 0 80px 0',
})
const noPaddingStyle = css({
  padding: '0', // disableWrapperPadding=true のとき
})
const childrenStyle = css({
  padding: '16px 12px',
})
const titleStyle = css({
  textAlign: 'center',
  fontWeight: 'bold',
  marginBottom: '20px',
})
