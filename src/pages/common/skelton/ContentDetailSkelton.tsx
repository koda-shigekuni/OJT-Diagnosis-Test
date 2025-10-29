/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Skeleton from '@mui/material/Skeleton'

const ContentDetailSkelton = () => {
  return (
    <div>
      <div css={titleStyle}>
        <Skeleton variant="rounded" width="100%" height="100%" animation="wave" />
      </div>
      <div css={postDateStyle}>
        <Skeleton variant="rounded" width="100%" height="100%" animation="wave" />
      </div>
      <div css={contentStyle}>
        <Skeleton variant="rounded" width="100%" height="100%" animation="wave" />
      </div>
    </div>
  )
}
export default ContentDetailSkelton

const titleStyle = css({
  borderRadius: '5px',
  height: '45px',
})

const postDateStyle = css({
  height: '30px',
  marginTop: '30px',
})

const contentStyle = css({
  height: '700px',
  marginTop: '40px',
})
