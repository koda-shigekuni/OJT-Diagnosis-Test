import { useEffect, useRef, useState } from 'react'

type Option = {
  /** スクロール対象。未指定は window */
  scrollTarget?: HTMLElement | Window
  /** 上方向へこの px 以上戻ったら再表示（デフォルト 12px） */
  revealThreshold?: number
  /** 下スクロール時も常に表示するか（デフォルト false） */
  alwaysShowOnScrollDown?: boolean
  /** このY以上で常に表示（ピン留め）。未指定なら無効 */
  pinAtY?: number
}

/**
 * スクロール方向でツールバーの表示制御 + 先頭以外で影付与
 * - hidden: 隠す/表示
 * - elevated: 先頭以外なら true（AppBar の elevation 制御などに）
 */
export const useSmartToolbarBehavior = (opts?: Option) => {
  const { scrollTarget, revealThreshold = 12, alwaysShowOnScrollDown = false, pinAtY } = opts || {}

  const [hidden, setHidden] = useState(false)
  const [elevated, setElevated] = useState(false)

  const lastYRef = useRef(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    const w: Window | undefined = typeof window !== 'undefined' ? window : undefined
    const target: Window | HTMLElement | undefined = scrollTarget || w
    if (!target) return

    const getY = () =>
      target instanceof Window ? target.scrollY : (target as HTMLElement).scrollTop

    const onScroll: EventListener = () => {
      if (tickingRef.current) return
      tickingRef.current = true

      requestAnimationFrame(() => {
        const y = getY()
        const last = lastYRef.current
        const dy = y - last

        // 影の有無
        setElevated(y > 0)

        // ピン留めが有効で、しきい値を超えたら常に表示
        if (typeof pinAtY === 'number' && y >= pinAtY) {
          setHidden(false)
        } else {
          if (dy > 0) {
            // 下スクロール
            setHidden(!alwaysShowOnScrollDown)
          } else if (last - y > revealThreshold) {
            // 上方向に一定戻ったら表示
            setHidden(false)
          }
        }

        lastYRef.current = y
        tickingRef.current = false
      })
    }

    // 初期位置
    lastYRef.current = getY()

    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [scrollTarget, revealThreshold, alwaysShowOnScrollDown, pinAtY])

  return { hidden, elevated }
}
