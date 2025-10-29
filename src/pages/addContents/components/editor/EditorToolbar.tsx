/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  ArrowDropDown as ArrowDropDownIcon,
  Code as CodeIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignJustify as FormatAlignJustifyIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignRight as FormatAlignRightIcon,
  FormatBold as FormatBoldIcon,
  FormatColorText as FormatColorTextIcon,
  FormatItalic as FormatItalicIcon,
  FormatSize as FormatSizeIcon,
  FormatStrikethrough as FormatStrikethroughIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import ImageIcon from '@mui/icons-material/Image'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import YouTubeIcon from '@mui/icons-material/YouTube'

import { Box, IconButton, Menu, MenuItem, Popover, Select, Tooltip } from '@mui/material'
import type { Editor } from '@tiptap/core'
import { useMemo, useState } from 'react'
import { ChromePicker } from 'react-color'
import text from '../../../../utils/text.json'
import { useSmartToolbarBehavior } from './ext/useSmartToolbarBehavior'
import { HeadingPicker } from './HeadingPicker'
import { isCodeBlockActiveStrict, isMarkActiveStrict } from './isActiveStrict'

// エディターツールバーで受け取るプロパティ
type editorToolProps = {
  editor: Editor
  selectedLang: string
  setSelectedLang: (v: string) => void
  scrollTarget?: HTMLElement | Window
}

// マーク（装飾）の種類
type MarkKey = 'bold' | 'italic' | 'underline' | 'strike'
// テキスト揃えの種類
type Align = 'left' | 'center' | 'right' | 'justify'

/**
 * 共通で利用するポップオーバー付きセレクトボックス
 * - フォントサイズ選択などに利用
 */
const PopoverSelect = ({
  anchorEl,
  onClose,
  value,
  onChange,
  items,
  displayEmpty,
  emptyLabel,
  size = 'small',
}: {
  anchorEl: HTMLElement | null
  onClose: () => void
  value: string
  onChange: (v: string) => void
  items: { value: string; label: string }[]
  displayEmpty?: boolean
  emptyLabel?: string
  size?: 'small' | 'medium'
}) => (
  <Popover
    open={!!anchorEl}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  >
    <Box css={popoverBoxStyle}>
      <Select
        value={value}
        onChange={e => onChange(e.target.value as string)}
        size={size}
        displayEmpty={displayEmpty}
      >
        {displayEmpty && (
          <MenuItem value="">
            <em>{emptyLabel}</em>
          </MenuItem>
        )}
        {items.map(it => (
          <MenuItem key={it.value} value={it.value}>
            {it.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  </Popover>
)

/**
 * エディターツールバーコンポーネント
 * - 太字 / 斜体 / 下線 / 打消し線
 * - フォントサイズ / テキストカラー
 * - 見出し / テキスト揃え
 * - コードブロック + 言語選択
 * - その他: 水平線 / リンク / 画像 / YouTube
 */
export const EditorToolbar = ({
  editor,
  selectedLang,
  setSelectedLang,
  scrollTarget,
}: editorToolProps) => {
  // ===== state管理 =====
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null) // カラーピッカーのアンカー
  const [currentColor, setCurrentColor] = useState('#000000') // 選択中のテキストカラー
  const [fontSizeAnchor, setFontSizeAnchor] = useState<HTMLElement | null>(null) // フォントサイズ選択ポップオーバー
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null) // その他メニュー
  const [langMenuAnchor, setLangMenuAnchor] = useState<HTMLElement | null>(null) // コード言語選択メニュー
  const [highlightAnchor, setHighlightAnchor] = useState<null | HTMLElement>(null)
  // ===== 定数 =====
  const fontSizes = useMemo(
    () => ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '64px'],
    []
  )
  // スクロールに応じてツールバーの表示非表示を制御
  const { hidden } = useSmartToolbarBehavior({
    scrollTarget,
    revealThreshold: 12,
    alwaysShowOnScrollDown: true,
    pinAtY: 300,
  })

  // チェイン実行用の共通関数
  const exec = (
    command: (chain: ReturnType<typeof editor.chain>) => ReturnType<typeof editor.chain>
  ) => {
    command(editor.chain().focus()).run()
  }

  // 状態判定
  const isCodeBlockActive = isCodeBlockActiveStrict(editor)
  const textStyleAttrs = editor.getAttributes('textStyle') as { fontSize?: unknown } | undefined
  const currentFontSize =
    typeof textStyleAttrs?.fontSize === 'string' ? textStyleAttrs.fontSize : ''

  // ===== ボタン定義 =====
  const markButtons: { key: MarkKey; title: string; Icon: React.ElementType }[] = [
    { key: 'bold', title: '太字', Icon: FormatBoldIcon },
    { key: 'italic', title: '斜体', Icon: FormatItalicIcon },
    { key: 'underline', title: '下線', Icon: FormatUnderlinedIcon },
    { key: 'strike', title: '取り消し線', Icon: FormatStrikethroughIcon },
  ]

  const alignmentButtons: { Icon: React.ElementType; align: Align; title: string }[] = [
    { Icon: FormatAlignLeftIcon, align: 'left', title: '左揃え' },
    { Icon: FormatAlignCenterIcon, align: 'center', title: '中央揃え' },
    { Icon: FormatAlignRightIcon, align: 'right', title: '右揃え' },
    { Icon: FormatAlignJustifyIcon, align: 'justify', title: '両端揃え' },
  ]

  // コードブロックの言語候補
  const languages = [
    { value: 'Java', label: text.editor?.['code.java'] ?? 'Java' },
    { value: 'python', label: text.editor?.['code.python'] ?? 'Python' },
    { value: 'php', label: text.editor?.['code.php'] ?? 'PHP' },
    { value: 'C#', label: text.editor?.['code.C#'] ?? 'C#' },
    { value: 'R', label: text.editor?.['code.R'] ?? 'R' },
    { value: 'typescript', label: text.editor?.['code.typescript'] ?? 'TypeScript' },
    { value: 'swift', label: text.editor?.['code.swift'] ?? 'Swift' },
  ]

  const highlightColors = [
    { value: '#ffe066', label: '黄' },
    { value: '#ffd6e0', label: 'ピンク' },
    { value: '#d0f4de', label: '緑' },
    { value: '#a3c9f9', label: '青' },
    { value: '#f9c784', label: 'オレンジ' },
  ]

  /** ===== マーク操作（太字・斜体など） ===== */
  const toggleMark = (mark: MarkKey, active: boolean) => {
    exec(chain => {
      switch (mark) {
        case 'bold':
          return active ? chain.unsetBold() : chain.setBold()
        case 'italic':
          return active ? chain.unsetItalic() : chain.setItalic()
        case 'underline':
          return active ? chain.unsetUnderline() : chain.setUnderline()
        case 'strike':
          return active ? chain.unsetStrike() : chain.setStrike()
      }
    })
  }

  return (
    <Box css={toolbarStyle(hidden)} aria-hidden={hidden}>
      {/* ===== マーク系ボタン（太字・斜体・下線・取り消し線） ===== */}
      {markButtons.map(({ key, title, Icon }) => {
        const isActive = isMarkActiveStrict(editor, key)
        return (
          <Tooltip key={key} title={title}>
            <IconButton
              size="small"
              onClick={() => toggleMark(key, isActive)}
              css={toolbarButtonStyle(isActive)}
              disabled={isCodeBlockActive}
            >
              <Icon />
            </IconButton>
          </Tooltip>
        )
      })}

      {/* ===== フォントサイズ ===== */}
      <Tooltip title={`フォントサイズ：${currentFontSize || text.editor['fontSize.default']}`}>
        <IconButton
          size="small"
          onClick={e => setFontSizeAnchor(e.currentTarget)}
          css={toolbarButtonStyle(false)}
          disabled={isCodeBlockActive}
          aria-label="フォントサイズ"
        >
          <Box css={fontSizeBtnInner}>
            <FormatSizeIcon />
            <span className="size">
              {(currentFontSize || text.editor['fontSize.default']).replace('px', '')}
            </span>
          </Box>
        </IconButton>
      </Tooltip>
      <Tooltip title="ハイライト">
        <IconButton
          size="small"
          onClick={e => setHighlightAnchor(e.currentTarget)}
          disabled={isCodeBlockActive}
          css={toolbarButtonStyle(false)}
        >
          <BorderColorIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={!!highlightAnchor}
        anchorEl={highlightAnchor}
        onClose={() => setHighlightAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box css={popoverBoxStyle} sx={{ display: 'flex', gap: 1 }}>
          {highlightColors.map(({ value, label }) => (
            <Tooltip key={value} title={label}>
              <IconButton
                size="small"
                onClick={() => {
                  exec(chain => (chain as any).toggleHighlight({ color: value }))
                  setHighlightAnchor(null)
                }}
                style={{ backgroundColor: value, border: '1px solid #ccc', width: 30, height: 30 }}
              />
            </Tooltip>
          ))}
          {/* ハイライト解除ボタン */}
          <Tooltip title="ハイライト解除">
            <IconButton
              size="small"
              onClick={() => {
                if (editor.isActive('highlight')) {
                  exec(chain => (chain as any).unsetHighlight())
                }
                setHighlightAnchor(null)
              }}
              style={{ border: '1px solid #ccc', width: 30, height: 30 }}
            >
              {text.common?.Cross || '×'}
            </IconButton>
          </Tooltip>
        </Box>
      </Popover>
      {/* フォントサイズ選択ポップオーバー */}
      <PopoverSelect
        anchorEl={fontSizeAnchor}
        onClose={() => setFontSizeAnchor(null)}
        value={currentFontSize || ''}
        onChange={v => exec(chain => chain.setFontSize(v || '16px'))}
        items={fontSizes.map(s => ({ value: s, label: s }))}
        displayEmpty
        emptyLabel={text.editor['fontSize.default']}
      />

      {/* ===== テキストカラー ===== */}
      <Tooltip title="テキストカラー">
        <IconButton
          size="small"
          onClick={e => setColorAnchor(e.currentTarget)}
          disabled={isCodeBlockActive}
          css={toolbarButtonStyle(false)}
        >
          <FormatColorTextIcon
            css={css`
              color: ${currentColor};
            `}
          />
        </IconButton>
      </Tooltip>
      <Popover
        open={!!colorAnchor}
        anchorEl={colorAnchor}
        onClose={() => setColorAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box css={popoverBoxStyle}>
          <ChromePicker
            color={currentColor}
            disableAlpha
            onChangeComplete={c => {
              setCurrentColor(c.hex)
              exec(chain => chain.setColor(c.hex))
            }}
          />
        </Box>
      </Popover>

      {/* ===== 見出しピッカー ===== */}
      <HeadingPicker editor={editor} />

      {/* ===== 揃え系ボタン ===== */}
      {alignmentButtons.map(({ Icon, align, title }) => (
        <Tooltip key={align} title={title}>
          <IconButton
            size="small"
            onClick={() => exec(chain => chain.setTextAlign(align))}
            css={toolbarButtonStyle(editor.isActive({ textAlign: align }))}
            disabled={isCodeBlockActive}
          >
            <Icon />
          </IconButton>
        </Tooltip>
      ))}

      {/* ===== コードブロック + 言語選択 ===== */}
      <Box css={splitBtn}>
        <Tooltip title={isCodeBlockActive ? 'コードブロック解除' : 'コードブロック'}>
          <IconButton
            size="small"
            onClick={() =>
              exec(chain =>
                isCodeBlockActive
                  ? chain.setParagraph()
                  : chain.toggleCodeBlock({ language: selectedLang })
              )
            }
            css={toolbarButtonStyle(isCodeBlockActive)}
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={`言語：${selectedLang}`}>
          <IconButton
            size="small"
            onClick={e => setLangMenuAnchor(e.currentTarget)}
            css={toolbarButtonStyle(false)}
          >
            <ArrowDropDownIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={langMenuAnchor}
          open={!!langMenuAnchor}
          onClose={() => setLangMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          {languages.map(({ value, label }) => (
            <MenuItem
              key={value}
              selected={value === selectedLang}
              onClick={() => {
                setSelectedLang(value)
                if (editor.isActive('codeBlock')) {
                  exec(chain => chain.setCodeBlock({ language: value }))
                }
                setLangMenuAnchor(null)
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* ===== その他（水平線・リンク・画像・YouTube） ===== */}
      <Tooltip title="その他">
        <IconButton
          size="small"
          onClick={e => setMoreAnchor(e.currentTarget)}
          css={toolbarButtonStyle(false)}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>

      {/* その他メニュー */}
      <Popover
        open={!!moreAnchor}
        anchorEl={moreAnchor}
        onClose={() => setMoreAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { elevation: 3 } }}
      >
        <Box css={otherPopover} role="toolbar" aria-label="その他ツール">
          {/* 水平線 */}
          <Tooltip title="水平線">
            <span>
              <IconButton
                size="small"
                onClick={() => {
                  exec(chain => chain.setHorizontalRule())
                  setMoreAnchor(null)
                }}
                disabled={isCodeBlockActive}
              >
                <HorizontalRuleIcon />
              </IconButton>
            </span>
          </Tooltip>

          {/* リンク挿入 */}
          <Tooltip title="リンク挿入">
            <span>
              <IconButton
                size="small"
                onClick={() => {
                  const url = window.prompt('リンクのURLを入力してください')
                  if (!url) return
                  if (editor.state.selection.empty) {
                    // 選択範囲がない場合はURL文字列を挿入
                    exec(chain =>
                      chain.insertContent([
                        {
                          type: 'text',
                          text: url,
                          marks: [{ type: 'link', attrs: { href: url } }],
                        },
                      ])
                    )
                  } else {
                    // 選択範囲がある場合はリンク化
                    exec(chain => chain.setLink({ href: url }))
                  }
                  setMoreAnchor(null)
                }}
                disabled={isCodeBlockActive}
              >
                <InsertLinkIcon />
              </IconButton>
            </span>
          </Tooltip>

          {/* 画像挿入 */}
          <Tooltip title="画像挿入">
            <span>
              <IconButton
                size="small"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = e => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      exec(chain => chain.setImage({ src: reader.result as string }))
                    }
                    reader.readAsDataURL(file)
                  }
                  input.click()
                  setMoreAnchor(null)
                }}
                disabled={isCodeBlockActive}
              >
                <ImageIcon />
              </IconButton>
            </span>
          </Tooltip>

          {/* YouTube 挿入 */}
          <Tooltip title="Youtube">
            <span>
              <IconButton
                size="small"
                onClick={() => {
                  const url = window.prompt('Youtubeリンクを貼り付けてください')
                  if (!url) return
                  exec(chain => chain.setYoutubeVideo({ src: url }))
                  setMoreAnchor(null)
                }}
                disabled={isCodeBlockActive}
              >
                <YouTubeIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Popover>
    </Box>
  )
}

/* ===== スタイル定義 ===== */
const toolbarStyle = (hidden: boolean) =>
  css({
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    padding: 6,
    backgroundColor: 'rgba(250, 250, 250)',
    transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
    opacity: hidden ? 0 : 1,
    transition: 'transform 180ms ease, opacity 180ms ease',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  })

const toolbarButtonStyle = (active: boolean) =>
  css({
    color: active ? '#1976d2' : 'inherit',
    padding: 6,
    minWidth: 30,
    minHeight: 30,
    '& .MuiSvgIcon-root': { fontSize: 22 },
  })

// コードブロック用の2分割ボタン
const splitBtn = css({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: 2,
  borderRadius: 6,
  border: '1px solid #ddd',
  overflow: 'hidden',
  '& > button': {
    borderRadius: 0,
  },
})

const popoverBoxStyle = css({ padding: 8 })

const otherPopover = css({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: 6,
  maxWidth: 360,
  overflowX: 'auto',
})

const fontSizeBtnInner = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  '& .size': {
    fontSize: 11,
    lineHeight: 1,
    padding: '1px 5px',
    borderRadius: 4,
    border: '1px solid #ddd',
    transform: 'translateY(-1px)',
    backgroundColor: '#fff',
  },
})
