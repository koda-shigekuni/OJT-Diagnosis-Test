/** @jsxImportSource @emotion/react */
import { Extension } from '@tiptap/core'
import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Color from '@tiptap/extension-color'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import ImageExtension from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { all, createLowlight } from 'lowlight'
import { SafeHeadingBackspace } from './ext/SafeHeadingBackspace'
import ImageNodeView from './ImageNodeView'

/**
 * lowlight（ハイライトライブラリ）を初期化
 * - createLowlight に利用可能なすべての言語を渡す
 * - CodeBlockLowlight でコードハイライトに利用する
 */
const lowlight = createLowlight(all)

/**
 * フォントサイズ拡張（TextStyle に fontSize 属性を追加）
 *
 * 目的：
 * - TipTap の textStyle マークに fontSize 属性を持たせることで、
 *   ユーザーが選択したテキストに対して font-size を付与／除去できるようにする。
 *
 * 実装ポイント：
 * - addGlobalAttributes で textStyle タイプに fontSize 属性を追加
 * - renderHTML / parseHTML を定義して DOM ↔ 属性のマッピングを行う
 * - addCommands で setFontSize(size) を提供（null を渡すと解除）
 */
export const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            // HTML に出力する際の属性（style を直接付与）
            renderHTML: attrs => (attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {}),
            // DOM から取り込む際に style から復元
            parseHTML: element => {
              const size = (element as HTMLElement).style.fontSize
              return { fontSize: size || null }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      /**
       * setFontSize(size)
       * - size が null の場合は fontSize を解除（デフォルトへ戻す）
       * - 文字列（例 "16px"）を渡すと textStyle マークに設定する
       */
      setFontSize:
        (size: string | null) =>
        ({ chain }) => {
          if (!size) return chain().setMark('textStyle', { fontSize: null }).run()
          return chain().setMark('textStyle', { fontSize: size }).run()
        },
    }
  },
})

/**
 * buildExtensions
 * - Editor 作成時に渡す拡張群を組み立てて返すヘルパー
 * - 引数 opts.codeLanguage を受け取り、CodeBlockLowlight のデフォルト言語にセットする
 *
 * 注意点（設計メモ）：
 * - StarterKit をベースにして不要な組み込みを無効化している（codeBlock/link/heading など）
 * - Youtube 拡張には allowFullscreen やクラス名を付与してスタイル制御を容易にしている
 * - CharacterCount を入れておくと文字数監視が可能（保存前バリデーションなどに利用）
 * - SafeHeadingBackspace は独自拡張（見出しで Backspace した時の挙動を安全にする）
 */
export const buildExtensions = (opts: { codeLanguage: string }) => {
  const { codeLanguage } = opts
  return [
    // 基本機能セット（段落・見出し・リストなど）。一部機能を無効化してカスタムする
    StarterKit.configure({
      codeBlock: false, // CodeBlockLowlight を利用するため無効化
      underline: false, // TextStyle + Underline を明示的に追加するため無効化
      link: false, // Link を個別で configure する
      heading: false, // Heading を後で個別に configure する
      trailingNode: {
        // ドキュメント末尾のデフォルトノード設定
        node: 'paragraph',
        notAfter: ['heading', 'codeBlock'],
      },
    }),

    // テキストの配置（textAlign）を見出しと段落で有効にする
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left',
    }),

    // 基本的なマーク類
    Underline,
    TextStyle, // textStyle マーク（色・フォント関連の基盤）
    Highlight.configure({
      multicolor: true,
    }),
    Color, // テキストカラー対応（ChromePicker 等と連携して使用）

    // カスタム：フォントサイズ拡張（上で定義）
    FontSize,

    // 見出し（h1/h2/h3 のみ許可）
    Heading.configure({
      levels: [1, 2, 3],
    }),

    // リンク（クリック時に自動で遷移しない設定）
    Link.configure({ openOnClick: false }),

    // 画像ノード（TipTap の公式 Image 拡張）
    ImageExtension.extend({
      addNodeView() {
        return ReactNodeViewRenderer(ImageNodeView)
      },
    }),

    // コードブロック（lowlight を使ったハイライト）
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: codeLanguage,
      HTMLAttributes: { class: 'hljs' }, // CSSでハイライト用クラスを参照可能にする
    }),

    // YouTube の埋め込み（iframe ではなく独自ノードで管理）
    Youtube.configure({
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'youtubeVideo', // スタイル適用用クラス
      },
    }),

    // 文字数カウント（フロント側での簡易バリデーションに便利）
    CharacterCount.configure(),

    // 安全な見出しの Backspace ハンドリング（独自拡張）
    SafeHeadingBackspace,
  ]
}
