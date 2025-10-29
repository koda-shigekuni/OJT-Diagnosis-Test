/** @jsxImportSource @emotion/react */
import type { Editor } from '@tiptap/core'
import { Extension, type JSONContent } from '@tiptap/core'
import { useEditor } from '@tiptap/react'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MAX_CONTENT_LENGTH } from '../../../../validation/contentsSchema'
import { buildExtensions } from './extensions'

/**
 * useSyncedEditors
 * - 編集用 Editor と プレビュー用 Editor を生成し、双方向で同期するカスタムフック
 * - 親コンポーネントから渡された content を編集側へ反映しつつ、
 *   編集側の変更は onChange を通じて親へ通知する（親→編集、編集→親 の整合をとる）
 *
 * @param content - 親から渡される JSONContent（TipTap のドキュメント）
 * @param codeLanguage - CodeBlock 用のデフォルト言語（extensions 再構築に使用）
 * @param onChange - 編集側の変更を親へ渡すコールバック
 * @param maxChars - 文字数ハード上限（超過する編集はブロック）。既定: 20000
 * @returns { editEditor, previewEditor, tick }
 */
type UseSyncedEditorsArgs = {
  content: JSONContent | null
  codeLanguage: string
  onChange: (c: JSONContent) => void
  maxChars?: number
}

type UseSyncedEditorsReturn = {
  editEditor: Editor | null
  previewEditor: Editor | null
  tick: number
}

// 空ドキュメント
const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

// 単純な深い比較（JSON.stringify ベース）
const deepEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
// ドキュメント内の「文字数」を数える（サロゲートペア対応のためスプレッドでカウント）
const countCharsInDoc = (pmDoc: ProseMirrorNode): number => {
  let total = 0
  pmDoc.descendants((node: ProseMirrorNode) => {
    if (node.isText && typeof node.text === 'string') total += [...node.text].length
    return true
  })
  return total
}

export const useSyncedEditors = ({
  content,
  codeLanguage,
  onChange,
  maxChars = MAX_CONTENT_LENGTH,
}: UseSyncedEditorsArgs): UseSyncedEditorsReturn => {
  // --- 文字数ハード制限 Extension（filterTransaction でブロック） ---
  const charLimitExtension = useMemo(() => {
    if (!maxChars || maxChars <= 0) return null
    return Extension.create({
      name: 'charLimit',
      addProseMirrorPlugins() {
        return [
          new Plugin({
            filterTransaction(tr) {
              // 変更のないトランザクションは許可
              if (!tr.docChanged) return true
              // 適用後の仮 doc を評価（このトランザクションを通した場合）
              const nextDoc = tr.doc
              const nextCount = countCharsInDoc(nextDoc)
              return nextCount <= maxChars // 超えたら拒否（=入力が反映されない）
            },
          }),
        ]
      },
    })
  }, [maxChars])

  // --- extensions をメモ化（codeLanguage / maxChars で再構築） ---
  const extensions = useMemo(() => {
    const base = buildExtensions({ codeLanguage })
    return charLimitExtension ? [...base, charLimitExtension] : base
  }, [codeLanguage, charLimitExtension])

  // 最後に親へ push した JSON（自己エコー検出用）
  const lastPushedRef = useRef<JSONContent | null>(content ?? null)
  // 親へ push 中フラグ
  const pushingRef = useRef(false)

  // --- 編集用 Editor ---
  const editEditor = useEditor(
    {
      extensions,
      content: content ?? EMPTY_DOC,
      onUpdate: ({ editor }) => {
        const json = editor.getJSON()
        lastPushedRef.current = json
        pushingRef.current = true
        onChange(json)
        pushingRef.current = false
      },
    },
    [extensions]
  )

  // --- プレビュー用 Editor（非編集） ---
  const previewEditor = useEditor(
    {
      extensions,
      editable: false,
      content: content ?? EMPTY_DOC,
    },
    [extensions]
  )

  // --- 編集 -> プレビュー同期 ---
  useEffect(() => {
    if (!editEditor || !previewEditor) return
    const sync = () => {
      const json = editEditor.getJSON()
      previewEditor.commands.setContent(json, { emitUpdate: false })
    }
    editEditor.on('update', sync)
    return () => {
      editEditor.off('update', sync)
    }
  }, [editEditor, previewEditor])

  // --- 外部から渡された content の取り込み ---
  useEffect(() => {
    if (!editEditor || !previewEditor) return

    if (pushingRef.current && deepEqual(content ?? EMPTY_DOC, lastPushedRef.current)) return

    const next = content ?? EMPTY_DOC

    if (deepEqual(next, editEditor.getJSON())) {
      previewEditor.commands.setContent(next, { emitUpdate: false })
      return
    }

    const { from } = editEditor.state.selection
    editEditor.commands.setContent(next, { emitUpdate: false })
    const max = editEditor.state.doc.content.size
    const pos = Math.min(max, Math.max(1, from))
    editEditor.commands.setTextSelection({ from: pos, to: pos })

    previewEditor.commands.setContent(next, { emitUpdate: false })
  }, [content, editEditor, previewEditor])

  // --- UI 再計算用 tick ---
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!editEditor) return
    const rerender = () => setTick(t => t + 1)
    editEditor.on('selectionUpdate', rerender)
    editEditor.on('focus', rerender)
    editEditor.on('blur', rerender)
    return () => {
      editEditor.off('selectionUpdate', rerender)
      editEditor.off('focus', rerender)
      editEditor.off('blur', rerender)
    }
  }, [editEditor])

  return { editEditor, previewEditor, tick }
}
