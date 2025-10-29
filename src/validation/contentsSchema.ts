import type { JSONContent } from '@tiptap/react'
import { z } from 'zod'
import text from '../utils/text.json'

// ---- サムネイル画像定数---
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const

//  ---正規表現定数---
const FORBIDDEN_REGEX = /[\\/:*?"<>|,;#%&+$^~`]/

export const MAX_CONTENT_LENGTH = 20000

/**
 * TipTap JSON に「実テキスト」が含まれるかを判定
 * - 改行や空ノードのみは false
 */
const contentHasText = (doc: JSONContent | null | undefined): boolean => {
  if (!doc) return false
  const stack: JSONContent[] = [doc]
  while (stack.length) {
    const node = stack.pop()!
    if (node.type === 'text' && typeof node.text === 'string' && node.text.trim().length > 0)
      return true
    if (Array.isArray(node.content)) stack.push(...node.content)
  }
  return false
}

/**
 * TipTap JSON 内の image ノード数をカウント
 * - 「本文に挿入できる画像は3枚まで」バリデーションで利用
 */
const countImages = (doc: JSONContent | null | undefined): number => {
  if (!doc) return 0
  let count = 0
  const stack: JSONContent[] = [doc]
  while (stack.length) {
    const node = stack.pop()!
    if (node.type === 'image') count++
    if (Array.isArray(node.content)) stack.push(...node.content)
  }
  return count
}

/** 本文中の image ノードの src を収集 */
const collectImageSrcs = (doc: JSONContent | null | undefined): string[] => {
  if (!doc) return []
  const srcs: string[] = []
  const stack: JSONContent[] = [doc]
  while (stack.length) {
    const node = stack.pop()!
    if (node.type === 'image' && typeof node.attrs?.src === 'string') {
      srcs.push(node.attrs.src)
    }
    if (Array.isArray(node.content)) stack.push(...node.content)
  }
  return srcs
}

/** dataURL（data:...;base64,）の概算バイト数を算出 */
const approxBytesFromDataUrl = (src: string): number => {
  const b64 = src.split(',')[1] ?? ''
  // 4文字→3バイト換算。末尾 '=' はパディングとして除外
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0
  return Math.floor((b64.length * 3) / 4) - padding
}

// File / FileList から最初の File を取り出す
const firstFile = (v: unknown): File | undefined => {
  if (v instanceof File) return v
  if (v instanceof FileList) return v.length ? (v.item(0) ?? undefined) : undefined
  return undefined
}

/**
 * TipTap JSON 内の YouTube ノード数をカウント
 */
const countYoutubeNodes = (doc: JSONContent | null | undefined): number => {
  if (!doc) return 0
  let count = 0
  const stack: JSONContent[] = [doc]
  while (stack.length) {
    const node = stack.pop()!
    if (node.type === 'youtube') count++
    if (Array.isArray(node.content)) stack.push(...node.content)
  }
  return count
}

/**
 * YouTube URL の形式チェック
 */
const isValidYoutubeUrl = (url: string): boolean => {
  const YOUTUBE_REGEX =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}($|[?&])/
  return YOUTUBE_REGEX.test(url)
}

/**
 * サムネイル画像フィールド
 * - 仕様：画像の拡張子とファイルサイズのみバリデーション
 * - MAX_IMAGE_SIZE: 5MBまで許容
 * - ALLOWED_TYPES: png,jpeg,webp,gifを許容
 * - 受容型：File / FileList / null / undefined
 *
 */
export const imageOptional = z
  .union([z.instanceof(FileList), z.instanceof(File), z.null(), z.undefined()])
  .refine(
    v => {
      const f = firstFile(v)
      return !f || (ALLOWED_TYPES as readonly string[]).includes(f.type)
    },
    {
      message: text.validation.postContents['image.type'],
    }
  )
  .refine(
    v => {
      const f = firstFile(v)
      return !f || f.size <= MAX_IMAGE_SIZE
    },
    { message: text.validation.postContents['image.size'] }
  )

/**
 * 投稿コンテンツのバリデーション
 * - title / summary：必須＋最大長（禁止文字チェック含む）
 * - content：テキスト必須／本文内画像は「最大3枚」＋「dataURLのみ 5MB 以下」 + 60KBまで
 * - image：拡張子、ファイルサイズのバリデーションを実施
 * - youtube：1つまでに制限＋URL形式チェック
 */
export const contentsSchema = z.object({
  image: imageOptional,
  title: z
    .string()
    .trim()
    .min(1, { message: text.validation.postContents['title.isEmpty'] })
    .refine(v => !FORBIDDEN_REGEX.test(v), {
      message: text.validation.postContents.regex,
    }),
  summary: z
    .string()
    .trim()
    .min(1, { message: text.validation.postContents['summary.isEmpty'] })
    .refine(v => !FORBIDDEN_REGEX.test(v), {
      message: text.validation.postContents.regex,
    }),
  categoryId: z.string().min(1, { message: text.validation.postContents['category.isEmpty'] }),
  content: z
    .custom<JSONContent>()
    // テキスト必須
    .refine(v => contentHasText(v as JSONContent), {
      message: text.validation.postContents['content.isEmpty'],
    })
    // 画像は3枚まで
    .refine(v => countImages(v as JSONContent) <= 3, {
      message: text.validation.postContents['content.permission'],
    })
    // 画像サイズバリデーション
    .refine(
      v => {
        const srcs = collectImageSrcs(v as JSONContent).filter(src => src.startsWith('data:'))
        return srcs.every(src => approxBytesFromDataUrl(src) <= MAX_IMAGE_SIZE)
      },
      {
        message: text.validation.postContents['image.size'],
      }
    )
    // YouTube動画は1つまで
    .refine(v => countYoutubeNodes(v as JSONContent) <= 1, {
      message: text.validation.postContents['youtube.limit'],
    })
    //YouTube URL形式チェック
    .refine(
      v => {
        const stack: JSONContent[] = [v as JSONContent]
        while (stack.length) {
          const node = stack.pop()!
          if (node.type === 'youtube') {
            const src = node.attrs?.src
            if (typeof src !== 'string' || !isValidYoutubeUrl(src)) {
              return false
            }
          }
          if (Array.isArray(node.content)) stack.push(...node.content)
        }
        return true
      },
      {
        message: text.validation.postContents['youtube.invalid'],
      }
    ),
})

// 型エクスポート
export type ContentsSchemaType = z.infer<typeof contentsSchema>
