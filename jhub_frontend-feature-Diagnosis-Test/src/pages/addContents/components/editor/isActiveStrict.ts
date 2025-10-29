import { Editor } from '@tiptap/core'

/**
 * 厳密にマークがアクティブかどうかを判定するユーティリティ
 *
 * 挙動:
 * - 選択範囲が empty（キャレットのみ）の場合は、キャレット位置の marks を評価して判定する
 * - 範囲選択されている場合は、選択範囲内の **テキストノードすべて** が該当マークを持っているときに true を返す
 * - 選択範囲内にテキストが一切存在しない（＝判定対象が無い）場合は false を返す
 *
 * 目的:
 * - エディタのツールバー等で「このマークが完全に適用されているか」を厳密に判定するために使う
 *
 * @param editor - TipTap の Editor インスタンス
 * @param markName - 判定したいマーク名（'bold' | 'italic' | 'underline' | 'strike' | 'highlight'）
 * @returns boolean - 全てのテキストにマークがあるなら true、そうでなければ false
 */
export const isMarkActiveStrict = (
  editor: Editor,
  markName: 'bold' | 'italic' | 'underline' | 'strike'
): boolean => {
  const { state } = editor
  const { from, to, empty, $from } = state.selection
  const markType = state.schema.marks[markName]
  if (!markType) return false // スキーマに存在しないマーク名なら false

  // キャレットのみ（範囲選択でない）場合はカーソル位置の marks を確認
  if (empty) {
    const marks = $from.marks()
    return !!markType.isInSet(marks)
  }

  // 範囲選択されている場合のロジック
  let hasAnyText = false // 選択範囲内にテキストノードが存在するか
  let allHave = true // 見つかった全てのテキストノードがマークを持つか

  // 選択範囲内をノード単位で走査
  state.doc.nodesBetween(from, to, node => {
    // テキストノードかつ実テキストがある場合のみ判定対象とする
    if (node.isText && node.text && node.text.length > 0) {
      hasAnyText = true
      // マークがなければ全体判定を false にして早期終了
      if (!markType.isInSet(node.marks)) {
        allHave = false
        return false // nodesBetween のコールバックで false を返すと走査を打ち切る
      }
    }
    return true
  })

  // テキストがひとつでもあれば allHave を返す。テキストがなければ false を返す。
  return hasAnyText ? allHave : false
}

/**
 * 見出し（heading）が厳密にアクティブかどうかを判定するユーティリティ
 *
 * 挙動:
 * - 選択が empty の場合はキャレットの親ノードを判定（そのノードが指定レベルの heading であれば true）
 * - 範囲選択の場合は、選択範囲内の **すべてのブロック要素** が指定の heading レベルであるときに true
 * - 選択範囲内に判定対象となるブロックが一切なければ false
 *
 * 利用例:
 * - ツールバーで「H2 が有効か」を正確に判定して、ボタンを active にする等
 *
 * @param editor - TipTap の Editor インスタンス
 * @param level - 判定したい見出しレベル（1 | 2 | 3）
 * @returns boolean - 選択範囲内の全ブロックが指定レベルの見出しなら true
 */
export const isHeadingActiveStrict = (editor: Editor, level: 1 | 2 | 3): boolean => {
  const { state } = editor
  const { from, to, empty, $from } = state.selection
  const headingType = state.schema.nodes.heading
  if (!headingType) return false // スキーマに heading が無ければ false

  // キャレットのみ：親ノードが heading でレベルが一致するか
  if (empty) {
    const parent = $from.parent
    return parent.type === headingType && parent.attrs.level === level
  }

  // 範囲選択：テキストブロック（段落や見出し）を走査して全てが一致するか確認
  let hasAnyBlock = false
  let allMatch = true

  state.doc.nodesBetween(from, to, node => {
    // テキストブロック（段落・見出し・コードブロック等）
    if (node.isTextblock) {
      hasAnyBlock = true
      // 見出しでない、またはレベルが異なる場合は不一致
      if (node.type !== headingType || node.attrs.level !== level) {
        allMatch = false
        return false // 早期終了
      }
    }
    return true
  })

  return hasAnyBlock ? allMatch : false
}

/**
 * 厳密にコードブロックがアクティブかどうかを判定するユーティリティ
 *
 * 挙動:
 * - 空選択（キャレットのみ）の場合はキャレット位置の親ノードが codeBlock かどうかを返す
 * - 範囲選択の場合は、選択範囲内の **すべてのブロック要素** が codeBlock であるときに true
 * - 判定対象のブロックがなければ false
 *
 * 利用例:
 * - ツールバーでコードブロックボタンをトグル表示する際の厳密判定に使用
 *
 * @param editor - TipTap の Editor インスタンス
 * @returns boolean - 選択範囲内の全ブロックが codeBlock であれば true
 */
export const isCodeBlockActiveStrict = (editor: Editor): boolean => {
  const { state } = editor
  const { from, to, empty, $from } = state.selection
  const codeType = state.schema.nodes.codeBlock
  if (!codeType) return false

  // キャレットのみ：親ノードが codeBlock か判定
  if (empty) return $from.parent.type === codeType

  // 範囲選択：すべてのテキストブロックが codeBlock か確認
  let hasAnyBlock = false
  let allMatch = true

  state.doc.nodesBetween(from, to, node => {
    if (node.isTextblock) {
      hasAnyBlock = true
      if (node.type !== codeType) {
        allMatch = false
        return false
      }
    }
    return true
  })

  return hasAnyBlock ? allMatch : false
}
