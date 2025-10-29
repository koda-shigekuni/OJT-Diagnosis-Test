import type { JSONContent } from '@tiptap/react'
import 'highlight.js/styles/atom-one-dark.css'
import { all, createLowlight } from 'lowlight'
import React, { type JSX } from 'react'
import {
  BLOCKQUOTE,
  BOLD,
  BULLETLIST,
  CODE,
  CODEBLOCK,
  COLOR,
  DOC,
  HARDBREAK,
  HEADING,
  HIGHLIGHT,
  HORIZONTALRULE,
  IMAGE,
  ITALIC,
  LINK,
  LISTITEM,
  ORDEREDLIST,
  PARAGRAPH,
  STRIKE,
  TABLE,
  TABLECELL,
  TABLEHEADER,
  TABLEROW,
  TEXT,
  TEXTSTYLE,
  UNDERLINE,
  YOUTUBE,
} from '../../../utils/textViewerCaseConst'
import Base64Image from '../components/Base64Image'

/**
 * RichTextViewerのprops
 * content: TiptapのJSON（または文字列）のリッチテキスト本文
 */
interface RichTextViewerProps {
  content: JSONContent | string
}

/**
 * CSSサイズ値を安全に整形
 * 数値なら "px" を付与。文字列なら数値文字列にも "px" を付与
 */
const toCssSize = (v?: string | number | null): string | undefined => {
  if (v == null) return undefined
  if (typeof v === 'number') return `${v}px`
  return /^\d+(\.\d+)?$/.test(v) ? `${v}px` : v
}

/**
 * YouTubeのURLやIDを埋め込み用URLへ変換
 * ・公式URLやショートURL、videoIdなど全対応
 * ・埋め込みパラメータもセット
 */
const toYouTubeEmbedSrc = (input?: string, start?: number): string | null => {
  if (!input) return null

  if (/^https?:\/\/(www\.)?youtube\.com\/embed\//.test(input)) {
    const url = new URL(input)
    if (typeof start === 'number') url.searchParams.set('start', String(start))
    url.searchParams.set('rel', '0')
    url.searchParams.set('modestbranding', '1')
    return url.toString()
  }

  let id = ''
  try {
    const u = new URL(input)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') id = u.pathname.slice(1)
    else if (host.endsWith('youtube.com')) {
      if (u.pathname === '/watch') id = u.searchParams.get('v') ?? ''
      else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2] ?? ''
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] ?? ''
    }
  } catch {
    id = input
  }
  if (!id) return null

  const qs = new URLSearchParams({ rel: '0', modestbranding: '1' })
  if (typeof start === 'number') qs.set('start', String(start))
  return `https://www.youtube.com/embed/${encodeURIComponent(id)}?${qs}`
}

/* ----------------------------------------------------------
 * attrsアクセスヘルパ
 * ---------------------------------------------------------- */
const getStringAttr = (obj: unknown, key: string): string | undefined => {
  if (typeof obj !== 'object' || obj === null) return undefined
  const v = (obj as Record<string, unknown>)[key]
  return typeof v === 'string' ? v : undefined
}
const getNumberAttr = (obj: unknown, key: string): number | undefined => {
  if (typeof obj !== 'object' || obj === null) return undefined
  const v = (obj as Record<string, unknown>)[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}
const getSizeAttr = (obj: unknown, key: string): string | number | undefined => {
  const s = getStringAttr(obj, key)
  if (s !== undefined) return s
  const n = getNumberAttr(obj, key)
  return n
}

/**
 * lowlight（ハイライトライブラリ）を初期化
 * - createLowlight に利用可能なすべての言語を渡す
 * - CodeBlockLowlight でコードハイライトに利用する
 */
const lowlight = createLowlight(all)

/**
 * TiptapのノードをReact要素に変換
 * @param nodes Tiptapのノード配列
 * @returns React要素
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toReact(nodes: any[]): React.ReactNode {
  return nodes.map((node, i) => {
    if (typeof node === 'string') return node
    if (node.type === 'text') return node.value
    if (node.type === 'element') {
      return React.createElement(
        node.tagName,
        { key: i, ...node.properties },
        node.children ? toReact(node.children) : null
      )
    }
    return null
  })
}

/**
 * textAlign値を取得（style/attr複数対応）
 */
type TextAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end'
const pickTextAlign = (attrs?: unknown): React.CSSProperties['textAlign'] | undefined => {
  if (typeof attrs !== 'object' || attrs === null) return undefined
  const a = attrs as Record<string, unknown>
  const styleTextAlign =
    typeof a.style === 'object' && a.style !== null
      ? (a.style as Record<string, unknown>).textAlign
      : undefined
  const v = a.textAlign ?? a.align ?? a.textAlignment ?? a['data-align'] ?? styleTextAlign

  if (typeof v !== 'string') return undefined
  const ok: TextAlign[] = ['left', 'center', 'right', 'justify', 'start', 'end']
  return ok.includes(v as TextAlign) ? (v as TextAlign) : undefined
}

/**
 * 幅/高さ/アライメントを適用したブロックstyle
 */
const blockBoxStyle = (attrs?: unknown): React.CSSProperties | undefined => {
  if (typeof attrs !== 'object' || attrs === null) return undefined

  const width = getSizeAttr(attrs, 'width') ?? getSizeAttr(attrs, 'w')
  const height = getSizeAttr(attrs, 'height') ?? getSizeAttr(attrs, 'h')
  const ta = pickTextAlign(attrs)

  const style: React.CSSProperties = {}
  if (width != null) style.width = toCssSize(width)!
  if (height != null) style.height = toCssSize(height)!

  if (ta === 'center') {
    style.marginLeft = 'auto'
    style.marginRight = 'auto'
    style.display = 'block'
  } else if (ta === 'right') {
    style.marginLeft = 'auto'
    style.display = 'block'
  } else if (ta === 'left') {
    style.marginRight = 'auto'
    style.display = 'block'
  }

  return Object.keys(style).length ? style : undefined
}

/**
 * マークアップ用（strong, em, link, code, etc...）
 * マークのネストにも対応
 */
interface TextStyleMarkAttrs {
  color?: string
  fontSize?: string | number
  fontFamily?: string
  fontWeight?: string | number
  fontStyle?: 'normal' | 'italic' | 'oblique' | (string & {})
  textDecoration?: string
  backgroundColor?: string
}
const wrapMarks = (text: React.ReactNode, marks?: JSONContent['marks']): React.ReactNode => {
  if (!marks) return text
  return marks.reduce((acc, mark) => {
    switch (mark.type) {
      case BOLD:
        return <strong>{acc}</strong>
      case ITALIC:
        return <em>{acc}</em>
      case UNDERLINE:
        return <u>{acc}</u>
      case STRIKE:
        return <s>{acc}</s>
      case CODE:
        return <code>{acc}</code>
      case HIGHLIGHT: {
        const c = getStringAttr(mark.attrs, 'color')
        return <mark style={{ backgroundColor: c }}>{acc}</mark>
      }
      case LINK:
        return (
          <a
            href={getStringAttr(mark.attrs, 'href')}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            {acc}
          </a>
        )
      case TEXTSTYLE: {
        const a = (
          typeof mark.attrs === 'object' && mark.attrs !== null
            ? (mark.attrs as TextStyleMarkAttrs)
            : {}
        ) as TextStyleMarkAttrs

        const style: React.CSSProperties = {}
        if (a.color) style.color = a.color
        if (a.fontSize != null) style.fontSize = toCssSize(a.fontSize)
        if (a.fontFamily) style.fontFamily = a.fontFamily
        if (a.fontWeight) style.fontWeight = a.fontWeight as React.CSSProperties['fontWeight']
        if (a.fontStyle) style.fontStyle = a.fontStyle as React.CSSProperties['fontStyle']
        if (a.textDecoration) style.textDecoration = a.textDecoration
        if (a.backgroundColor) style.backgroundColor = a.backgroundColor

        return Object.keys(style).length ? <span style={style}>{acc}</span> : acc
      }
      case COLOR: {
        const c = getStringAttr(mark.attrs, 'color')
        return c ? <span style={{ color: c }}>{acc}</span> : acc
      }
      default:
        return acc
    }
  }, text)
}

/**
 * ノードの型ごとに再帰的に描画
 */
const renderNode = (node: JSONContent): React.ReactNode => {
  if (!node) return null

  switch (node.type) {
    case DOC: {
      return (
        <>
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child as JSONContent)}</React.Fragment>
          ))}
        </>
      )
    }

    case PARAGRAPH: {
      const style: React.CSSProperties = {}
      const ta = pickTextAlign(node.attrs)
      if (ta) style.textAlign = ta
      return (
        <p style={style}>
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child as JSONContent)}</React.Fragment>
          ))}
        </p>
      )
    }

    case HEADING: {
      const level = node.attrs?.level || 1
      const tagName = `h${level}` as keyof JSX.IntrinsicElements
      const style: React.CSSProperties = {}
      const ta = pickTextAlign(node.attrs)
      if (ta) style.textAlign = ta

      const children = node.content?.map((child, i) => (
        <React.Fragment key={i}>{renderNode(child as JSONContent)}</React.Fragment>
      ))
      return React.createElement(tagName, { style }, children)
    }

    case TEXT:
      return wrapMarks(node.text, node.marks)

    case IMAGE: {
      const raw = getStringAttr(node.attrs, 'src') ?? ''
      console.log('[RichTextViewer] imageノード src:', raw)
      return (
        <Base64Image
          fileName={raw}
          alt={getStringAttr(node.attrs, 'alt') ?? ''}
          loading="lazy"
          decoding="async"
          onError={e => {
            console.error('[RichTextViewer] 画像読み込みエラー:', { raw, event: e })
          }}
        />
      )
    }

    case YOUTUBE: {
      const srcOrId = getStringAttr(node.attrs, 'src') ?? getStringAttr(node.attrs, 'videoId')
      const start = getNumberAttr(node.attrs, 'start')
      const embed = toYouTubeEmbedSrc(srcOrId, start)
      if (!embed) return null

      const boxStyle: React.CSSProperties = {
        position: 'relative',
        paddingTop: '56.25%',
        margin: '12px 0',
        ...blockBoxStyle(node.attrs),
      }

      return (
        <div style={boxStyle}>
          <iframe
            src={embed}
            title={getStringAttr(node.attrs, 'title') ?? 'YouTube'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>
      )
    }

    case ORDEREDLIST: {
      const style: React.CSSProperties = {}
      const ta = pickTextAlign(node.attrs)
      if (ta) style.textAlign = ta
      return (
        <ol style={style}>
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child as JSONContent)}</React.Fragment>
          ))}
        </ol>
      )
    }

    case BULLETLIST: {
      const style: React.CSSProperties = {}
      const ta = pickTextAlign(node.attrs)
      if (ta) style.textAlign = ta
      return (
        <ul style={style}>
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child as JSONContent)}</React.Fragment>
          ))}
        </ul>
      )
    }

    case LISTITEM: {
      const style: React.CSSProperties = {}
      const ta = pickTextAlign(node.attrs)
      if (ta) style.textAlign = ta
      return (
        <li style={style}>
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child as JSONContent)}</React.Fragment>
          ))}
        </li>
      )
    }

    case BLOCKQUOTE: {
      const style: React.CSSProperties = {}
      const ta = pickTextAlign(node.attrs)
      if (ta) style.textAlign = ta
      return (
        <blockquote style={style}>
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child as JSONContent)}</React.Fragment>
          ))}
        </blockquote>
      )
    }

    case HORIZONTALRULE:
      return <hr />

    case CODEBLOCK: {
      const style: React.CSSProperties = {
        background: '#222',
        color: '#f8f8f2',
        padding: '1em',
        borderRadius: 6,
        overflowX: 'auto',
      }
      const ta = pickTextAlign(node.attrs)
      if (ta) style.textAlign = ta

      // 言語名を取得
      const language = node.attrs?.language || 'plaintext'
      // 子ノードからコードテキストを取得
      const codeText =
        node.content?.map(child => (typeof child.text === 'string' ? child.text : '')).join('') ??
        ''

      // lowlightでシンタックスハイライト
      const { children } = lowlight.highlight(language, codeText)

      return (
        <pre style={style}>
          <code className={`hljs language-${language}`}>{toReact(children)}</code>
        </pre>
      )
    }

    case HARDBREAK:
      return <br />

    case TABLE: {
      return (
        <table style={{ borderCollapse: 'collapse', width: '100%', margin: '1em 0' }}>
          <tbody>
            {node.content?.map((row, i) => (
              <React.Fragment key={i}>{renderNode(row as JSONContent)}</React.Fragment>
            ))}
          </tbody>
        </table>
      )
    }

    case TABLEROW: {
      return (
        <tr>
          {node.content?.map((cell, i) => (
            <React.Fragment key={i}>{renderNode(cell as JSONContent)}</React.Fragment>
          ))}
        </tr>
      )
    }

    case TABLECELL:
    case TABLEHEADER: {
      const CellTag = node.type === TABLEHEADER ? 'th' : 'td'
      const style: React.CSSProperties = {
        border: '1px solid #ddd',
        padding: 6,
        background: node.type === TABLEHEADER ? '#fafafc' : undefined,
      }
      const ta = pickTextAlign(node.attrs)
      if (ta) style.textAlign = ta

      return (
        <CellTag style={style}>
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child as JSONContent)}</React.Fragment>
          ))}
        </CellTag>
      )
    }

    default: {
      if (node.content) {
        const style: React.CSSProperties = {}
        const ta = pickTextAlign(node.attrs)
        if (ta) style.textAlign = ta

        return (
          <div style={style}>
            {node.content.map((child, i) => (
              <React.Fragment key={i}>{renderNode(child as JSONContent)}</React.Fragment>
            ))}
          </div>
        )
      }
      return null
    }
  }
}

/**
 * RichTextViewer本体
 * JSON or 文字列のtiptap内容を再帰的にReactで描画
 */
const RichTextViewer = (props: RichTextViewerProps) => {
  const { content } = props
  let doc: JSONContent
  if (typeof content === 'string') {
    try {
      doc = JSON.parse(content)
    } catch {
      doc = { type: 'doc', content: [] }
    }
  } else {
    doc = content
  }

  return <div className="tiptap-viewer">{renderNode(doc)}</div>
}

export default RichTextViewer
