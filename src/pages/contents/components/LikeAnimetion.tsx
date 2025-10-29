/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { IconButton } from '@mui/material'
import { useState } from 'react'

/* ハートのポップアニメーション */
const pop = keyframes`
  0%   { transform: scale(1); }
  30%  { transform: scale(1.3); }
  60%  { transform: scale(0.9); }
  100% { transform: scale(1); }
`

/* キラキラ（飛び散り）アニメーション */
const sparkle = keyframes`
  0%   { transform: scale(0.2) translate(0,0); opacity: 1; }
  80%  { transform: scale(1) translate(var(--x), var(--y)); opacity: 1; }
  100% { transform: scale(1.2) translate(var(--x), var(--y)); opacity: 0; }
`

type Props = {
  liked: boolean
  disabled?: boolean
  onClick: () => void
}

//ライク用アニメーション
export const LikeAnimetion = ({ liked, disabled, onClick }: Props) => {
  const [animating, setAnimating] = useState(false)
  const [sparkles, setSparkles] = useState<number[]>([])

  const handleClick = () => {
    if (disabled) return
    setAnimating(true)
    onClick()

    // キラキラを 6 個発生させる
    setSparkles(Array.from({ length: 6 }, (_, i) => i))

    setTimeout(() => {
      setAnimating(false)
      setSparkles([])
    }, 1500)
  }

  return (
    <div css={wrapper}>
      <IconButton onClick={handleClick} disabled={disabled}>
        {liked ? (
          <FavoriteIcon
            css={css({
              color: 'orange',
              animation: animating ? `${pop} 0.8s ease` : 'none',
            })}
          />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>

      {/* キラキラを描画 */}
      {sparkles.map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const distance = 32
        const x = Math.cos(angle) * distance + 'px'
        const y = Math.sin(angle) * distance + 'px'

        return (
          <span
            key={`sparkle-${i}`}
            css={css({
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: ['#FFD700', '#FF69B4', '#87CEFA', '#9efa87ff'][i % 4], // 金・ピンク・水色
              transform: 'translate(-50%, -50%)',
              animation: `${sparkle} 0.8s forwards`,
              '--x': x,
              '--y': y,
              pointerEvents: 'none',
            })}
          />
        )
      })}
    </div>
  )
}

const wrapper = css({
  position: 'relative',
  display: 'inline-block',
})
