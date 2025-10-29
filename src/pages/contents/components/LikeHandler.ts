import { useEffect, useRef, useState } from 'react'
import { usePostLikeQuery } from '../../../api/hook/contents'

//ライク機能
export const LikeHandler = (
  targetId: number,
  targetType: '0' | '1',
  initialCount = 0,
  initialLiked = false,
  onSuccess?: () => void
) => {
  const { mutate: postLike } = usePostLikeQuery()
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [cooldown, setCooldown] = useState(false)

  const likeBuffer = useRef(0)
  const likeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLikeCount(initialCount || 0)
    setLiked(initialLiked)
    setCooldown(false)
  }, [initialCount, initialLiked])

  const handleLike = () => {
    if (cooldown) return

    setLiked(true)
    setLikeCount(prev => prev + 1)

    likeBuffer.current += 1

    if (!likeTimer.current) {
      likeTimer.current = setTimeout(() => {
        const countToSend = likeBuffer.current

        postLike(
          { targetId, targetType, count: countToSend },
          {
            onSuccess: () => {
              setCooldown(true) // これ以降は押せない
              if (onSuccess) onSuccess()
            },
            onError: err => {
              console.error('Like Error', err)
              setLiked(false)
              setLikeCount(prev => prev - countToSend)
            },
            onSettled: () => {
              likeBuffer.current = 0
              likeTimer.current = null
            },
          }
        )
      }, 1500)
    }
  }

  return { liked, likeCount, cooldown, handleLike }
}
