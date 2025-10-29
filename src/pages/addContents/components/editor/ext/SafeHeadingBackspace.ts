import type { Editor as TiptapEditor } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import type { Node as PMNode } from 'prosemirror-model'
import type { Selection } from 'prosemirror-state'

/**
 * 見出しの先頭で Backspace を押したときの挙動を制御する拡張
 *
 * - 見出しの先頭で Backspace を押したとき、前のブロックが段落なら何もしない（結合も段落化もしない）
 *   - これで「勝手に改行したように見える」副作用を避ける
 * - 見出しの先頭で Backspace を押したとき、前のブロックが見出しなら既定動作（結合OK）
 * - それ以外は既定動作
 */
export const SafeHeadingBackspace = Extension.create({
  name: 'safeHeadingBackspace',

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }: { editor: TiptapEditor }) => {
        const { state } = editor
        const { $from, empty } = state.selection as Selection
        if (!empty) return false

        // ブロック先頭でなければ既定動作
        if ($from.parentOffset !== 0) return false

        // 現在ブロックが見出しか？
        if ($from.parent.type.name !== 'heading') return false

        // 親ブロックの開始位置の手前＝直前ブロックを取得
        const beforePos = $from.before()
        if (beforePos <= 0) return false // 文書先頭：既定動作（何も起きない）

        const $before = state.doc.resolve(beforePos)
        const prevNode: PMNode | null = $before.nodeBefore ?? null
        if (!prevNode) return false

        const prevType = prevNode.type.name

        if (prevType === 'heading') {
          // 前も見出し → 既定の joinBackward に任せる（結合OK）
          return false
        }

        if (prevType === 'paragraph') {
          // 前が段落 → 何もしないで停止（結合も段落化もしない）
          // これで「勝手に改行したように見える」副作用を避ける
          return true
        }

        // それ以外（リスト・コードブロック等）は既定動作
        return false
      },
    }
  },
})
