/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import TitleIcon from '@mui/icons-material/Title'
import { Box, IconButton, Popover, Tooltip, Typography } from '@mui/material'
import type { Editor } from '@tiptap/core'
import { useEffect, useState } from 'react'
import text from '../../../../utils/text.json'

type Props = { editor: Editor }

/**
 * HeadingPicker
 * - 現在のブロック（段落 / H1 / H2 / H3）を判定し、見出しに切り替える UI を提供します。
 * - ポップオーバーで段落または見出しを選択可能。
 * - エディタの selection/transaction/focus/blur イベントを監視して再レンダーします。
 */
export const HeadingPicker = ({ editor }: Props) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  // editor のイベントでインクリメントして再レンダーを促すための state
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!editor) return
    const rerender = () => setTick(t => t + 1)

    // 選択変更やトランザクション、フォーカス状態の変化で再レンダー
    editor.on('selectionUpdate', rerender)
    editor.on('transaction', rerender)
    editor.on('focus', rerender)
    editor.on('blur', rerender)

    return () => {
      editor.off('selectionUpdate', rerender)
      editor.off('transaction', rerender)
      editor.off('focus', rerender)
      editor.off('blur', rerender)
    }
  }, [editor])

  // ---- 現在のノード（段落 or 見出しレベル）を判定 ----
  const { $from } = editor.state.selection
  const node = $from.parent
  // heading ノードなら level（1|2|3）を取得、そうでなければ 0（段落）
  const currentLevel = node.type.name === 'heading' ? (node.attrs.level as 1 | 2 | 3) : 0

  // i18n テキスト取得（フォールバックあり）
  const tLabel = text.editor?.['heading.label'] ?? '見出しを選択'
  const tParagraph = text.editor?.['heading.paragraph'] ?? '段落'
  const tH1 = text.editor?.['heading.h1'] ?? '見出し H1'
  const tH2 = text.editor?.['heading.h2'] ?? '見出し H2'
  const tH3 = text.editor?.['heading.h3'] ?? '見出し H3'

  const triggerLabel = currentLevel ? `H${currentLevel}` : tParagraph

  /**
   * setHeading
   * - level === 0: 段落へ戻す
   * - 空ドキュメント（真に空）の場合は見出しノードを新規作成してキャレットを見出し内に移動する
   * - 通常ケースは選択範囲のブロックを見出し化する
   */
  const setHeading = (level: 0 | 1 | 2 | 3) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run()
      setAnchor(null)
      return
    }

    // ドキュメントが真に空（段落ノードが一つで中身が空）か判定
    const doc = editor.state.doc
    const isTrulyEmpty =
      doc.childCount === 1 &&
      doc.firstChild?.type.name === 'paragraph' &&
      doc.firstChild.content.size === 0

    if (isTrulyEmpty) {
      // 空ドキュメントなら見出しを新規作成してキャレットを見出し内に移動
      editor.commands.setContent(
        { type: 'doc', content: [{ type: 'heading', attrs: { level }, content: [] }] },
        { emitUpdate: true }
      )

      const d = editor.state.doc
      const last = d.lastChild
      if (last) {
        // 見出しノードの開始位置を計算してキャレットをセット
        const startPos = d.content.size - last.nodeSize + 1
        editor.commands.setTextSelection(startPos)
      }
      editor.commands.focus()
      setAnchor(null)
      return
    }

    // 通常：その場のブロックを見出し化
    editor.chain().focus().setHeading({ level }).run()
    setAnchor(null)
  }

  // ポップオーバーをクリックしてもエディタの選択が外れないようにする
  const keepSelectionMouseDown: React.MouseEventHandler = e => e.preventDefault()

  return (
    <>
      <Tooltip title={tLabel}>
        <IconButton
          size="small"
          onMouseDown={keepSelectionMouseDown}
          onClick={e => setAnchor(e.currentTarget)}
          css={trigger}
          data-render-tick={String(tick)}
        >
          <TitleIcon fontSize="small" />
          <Typography variant="caption" css={triggerText}>
            {triggerLabel}
          </Typography>
        </IconButton>
      </Tooltip>

      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        // ポップオーバー内でフォーカスを奪わないようにする（エディタの選択を維持）
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <Box css={menu}>
          <button css={item} onMouseDown={keepSelectionMouseDown} onClick={() => setHeading(0)}>
            <span css={para}>{tParagraph}</span>
          </button>
          <button css={item} onMouseDown={keepSelectionMouseDown} onClick={() => setHeading(1)}>
            <span css={h1}>{tH1}</span>
          </button>
          <button css={item} onMouseDown={keepSelectionMouseDown} onClick={() => setHeading(2)}>
            <span css={h2}>{tH2}</span>
          </button>
          <button css={item} onMouseDown={keepSelectionMouseDown} onClick={() => setHeading(3)}>
            <span css={h3}>{tH3}</span>
          </button>
        </Box>
      </Popover>
    </>
  )
}

// ===== styles =====
const trigger = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: 6,
})
const triggerText = css({ marginLeft: 2 })

const menu = css({
  padding: 8,
  minWidth: 220,
  display: 'grid',
  gap: 6,
})
const item = css({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid transparent',
  background: 'transparent',
  cursor: 'pointer',
  ':hover': { background: '#f5f7fb', borderColor: '#e0e3e7' },
})
const para = css({ fontSize: 14 })
const h1 = css({ fontSize: 24, fontWeight: 700, lineHeight: 1.2 })
const h2 = css({ fontSize: 20, fontWeight: 700, lineHeight: 1.25 })
const h3 = css({ fontSize: 18, fontWeight: 700, lineHeight: 1.3 })
