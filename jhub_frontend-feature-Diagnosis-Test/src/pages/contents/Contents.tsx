/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import FlightIcon from '@mui/icons-material/Flight'
import TuneIcon from '@mui/icons-material/Tune'
import { Dialog, DialogContent, IconButton, Tooltip } from '@mui/material'
import { motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetContentsQuery } from '../../api/hook/contents'
import type { GetContentsItem } from '../../api/type/response/contents'
import type { SortKey } from '../../api/type/sortKey'
import text from '../../utils/text.json'
import { contentDetailPath } from '../../utils/URL'
import ContentsWrapper from '../common/contentsWrapper'
import SideMenu from '../common/SideMenu'
import ContentListItems from './components/ContentListItems'
import ContentOverview from './components/ContentOverView'
import ContentPagination from './components/ContentPagination'
import ContentResultBar from './components/ContentResultBar'
import ContentSearchBox from './components/ContentSearchBox'
import ContentSkeletonItem from './components/ContentSkeletonItem'
const LIMIT = 20
const SCROLL_THRESHOLD = 100 // スクロールボタン表示位置

/**
 * コンテンツ一覧ページのメインコンポーネント
 * 検索・カテゴリ絞り込み・ソート・ページネーション機能を提供
 */
const ContentsList = () => {
  // URLSearchParams の取得・更新用
  const [searchParams, setSearchParams] = useSearchParams()
  // 画面遷移用
  const navigate = useNavigate()
  // 入力中の検索キーワード（APIには直接渡さない）
  const [keyword, setKeyword] = useState(searchParams.get('keys') ?? '')
  // 実際にAPIに渡す検索キーワード（検索実行時のみ更新）
  const [searchWord, setSearchWord] = useState(searchParams.get('keys') ?? '')
  // ステート：現在のページ番号
  const [page, setPage] = useState(Number(searchParams.get('page_no')) || 1)
  // ステート：絞り込みカテゴリ（文字列）
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  // ステート：ソートキー（new, old, like, comment）
  const [sort, setSort] = useState<SortKey>('new')

  // モーダル（フィルター画面）の開閉制御
  const [modalOpen, setModalOpen] = useState(false)
  const handleOpenFilter = () => setModalOpen(true)
  const handleCloseFilter = () => setModalOpen(false)

  /**
   * リロード時は検索条件を破棄しsort=new&page_no=1で表示
   * 初回マウント時にパラメータリセット
   */
  useEffect(() => {
    setSearchParams({ sort: 'new', page_no: '1' })
    // eslint-disable-next-line
  }, [])

  /**
   * URL のクエリパラメータが変わったときにステートを同期
   */
  useEffect(() => {
    setKeyword(searchParams.get('keys') ?? '')
    setSearchWord(searchParams.get('keys') ?? '')
    setPage(Number(searchParams.get('page_no')) || 1)
    setCategory(searchParams.get('category') ?? '')
    setSort((searchParams.get('sort') as SortKey) ?? 'new')
  }, [searchParams])

  // categoryId は undefined も許容
  const categoryId = category ? Number(category) : undefined

  // API呼び出し：検索語は searchWord だけがトリガーになる
  const { data, isLoading } = useGetContentsQuery(searchWord, page, categoryId, sort)

  /**
   * URLSearchParams を更新するためのクエリ文字列組み立てヘルパー
   * overrides で指定したキーだけ上書き、空文字は自動で除去
   */
  const buildQuery = useCallback(
    (overrides: Record<string, string | number>) => {
      const merged: Record<string, string> = {
        keys: searchWord.trim(),
        page_no: String(page),
        category: category,
        sort: sort,
        ...overrides,
      }
      // 空文字または null のパラメータは削除
      Object.entries(merged).forEach(([k, v]) => {
        if (v === '' || v === null) delete merged[k]
      })
      return merged as Record<string, string>
    },
    [searchWord, page, category, sort]
  )

  // API から返されたアイテム配列と総件数
  const items: GetContentsItem[] = data?.items ?? []
  const totalCount = data?.totalCount ?? 0

  // ページネーション表示用数値計算
  const startNum = totalCount === 0 ? 0 : (page - 1) * LIMIT + 1
  const endNum = Math.min(page * LIMIT, totalCount)
  const pageCount = Math.ceil(totalCount / LIMIT)

  /**
   * 検索フォーム送信時のハンドラ
   * ページ番号は必ず1にリセット
   * ※この時だけsearchWordを更新→APIコール
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setSearchWord(keyword.trim())
    const params = buildQuery({ keys: keyword.trim(), page_no: '1' })
    setSearchParams(params)
  }

  /**
   * カテゴリ切り替え時のハンドラ
   * ページ番号は1にリセット、既存クエリはマージ
   */
  const handleCategory = (newCategory: string) => {
    setCategory(newCategory)
    setPage(1)
    setSearchParams(prev => {
      const sp = new URLSearchParams(prev)
      sp.set('category', newCategory)
      sp.set('page_no', '1')
      return sp
    })
  }

  /**
   * ソート切り替え時のハンドラ
   * ページ番号は1にリセット、既存クエリはマージ
   */
  const handleSort = (newSort: SortKey) => {
    setSort(newSort)
    setPage(1)
    setSearchParams(prev => {
      const sp = new URLSearchParams(prev)
      sp.set('sort', newSort)
      sp.set('page_no', '1')
      return sp
    })
  }

  /**
   * ページ変更時のハンドラ
   * 指定されたページ番号をセットし、クエリを更新
   */
  const handlePage = (newPage: number) => {
    setPage(newPage)
    const params = buildQuery({ page_no: String(newPage) })
    setSearchParams(params)
  }

  /**
   * リストアイテムクリック時の遷移処理
   * 詳細ページへ
   */
  const handleItemClick = (id: number) => {
    navigate(contentDetailPath(id))
  }

  // --- スクロールトップボタン制御 ---
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_THRESHOLD)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初期状態反映

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div css={bgWrap}>
      {/* 検索ボックスエリア */}
      <div css={searchArea}>
        <ContentSearchBox keyword={keyword} setKeyword={setKeyword} onSearch={handleSearch} />
      </div>

      {/* コンテンツ全体ラッパー */}
      <ContentsWrapper disableWrapperPadding>
        {/* サイドメニュー */}
        <SideMenu />

        <div css={contentCard}>
          {/* 検索結果バー（件数表示＆フィルターアイコン） */}
          <ContentResultBar totalCount={totalCount} startNum={startNum} endNum={endNum}>
            <IconButton css={tuneButtonStyle} onClick={handleOpenFilter}>
              <TuneIcon css={tuneIconStyle} />
            </IconButton>
          </ContentResultBar>

          {/* フィルターモーダル */}
          <Dialog
            open={modalOpen}
            onClose={(_e, reason) => {
              if (reason === 'backdropClick') handleCloseFilter()
            }}
            maxWidth={false}
            slotProps={{ paper: { sx: dialogPaperStyle } }}
          >
            <DialogContent css={dialogContentStyle}>
              <ContentOverview
                category={category}
                setCategory={handleCategory}
                sort={sort}
                setSort={handleSort}
                onClose={handleCloseFilter}
              />
            </DialogContent>
          </Dialog>

          {/* コンテンツ一覧 またはローディングスケルトン または0件時のテキスト */}
          <div css={listWrap}>
            {isLoading ? (
              Array.from({ length: LIMIT }).map((_, i) => <ContentSkeletonItem key={i} />)
            ) : totalCount === 0 ? (
              <div css={noResultStyle}>
                <p>
                  {searchWord === '' && category === ''
                    ? text.contentResult['content.noContents']
                    : text.contentResult['content.isEmpty']}{' '}
                </p>
              </div>
            ) : (
              <ContentListItems items={items} onItemClick={handleItemClick} />
            )}
          </div>

          {/* ページネーション */}
          <ContentPagination page={page} setPage={handlePage} pageCount={pageCount} />
        </div>
      </ContentsWrapper>

      {/* スクロールトップボタン*/}
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 64 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 64 }}
          css={scrollTopFixedWrap}
        >
          <Tooltip title="トップへ戻る" placement="left">
            <IconButton
              css={scrollTopIconBtn}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="トップへ戻る"
              size="large"
            >
              <FlightIcon css={scrollTopIcon} />
            </IconButton>
          </Tooltip>
        </motion.div>
      )}
    </div>
  )
}

export default ContentsList

// --- Emotionスタイル ---
// 背景全体ラッパー
const bgWrap = css({
  minHeight: '100vh',
  background: '#ffc862',
  padding: '0 0 40px 0',
  width: '100%',
})

// 検索エリア
const searchArea = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: '40px',
  padding: '20px 0 28px 0',
})

// コンテンツカード
const contentCard = css({
  width: 926,
  minHeight: 832,
  background: '#fff',
  borderRadius: 14,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  margin: '0 auto',
  marginTop: '-90px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

// 一覧アイテムラップ
const listWrap = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  padding: '0 0 12px 0',
})

// フィルターボタンアイコン
const tuneIconStyle = css({
  color: '#07913B',
  fontSize: '32px',
})

// フィルターボタン（丸アイコン）のスタイル
const tuneButtonStyle = css({
  marginLeft: '24px',
  padding: '8px',
  borderRadius: '50%',
})

// モーダルダイアログの Paper 部分
const dialogPaperStyle = css({
  width: 745,
  height: 490,
  maxWidth: 745,
  maxHeight: 490,
  borderRadius: 40,
  overflow: 'hidden',
  margin: 0,
  padding: 0,
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  display: 'flex',
  flexDirection: 'column',
})

// モーダルダイアログのコンテンツラップ
const dialogContentStyle = css({
  padding: 0,
  margin: 0,
  width: '100%',
  height: 490,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  background: '#fff',
})

// 検索結果0件時の表示スタイル
const noResultStyle = css({
  width: '100%',
  minHeight: 180,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#888',
  fontSize: '1.2rem',
  fontWeight: 500,
})

// --- スクロールトップボタン用スタイル ---
const scrollTopFixedWrap = css({
  position: 'fixed',
  right: 32, // ← 標準的な余白に修正
  bottom: 32, // ← 標準的な余白に修正
  zIndex: 3000,
})

// ボタン（アイコンサイズ大・影/hover効果つき）
const scrollTopIconBtn = css({
  background: '#fff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'background 0.18s, box-shadow 0.18s, transform 0.18s',
  padding: 10,
  borderRadius: '50%',
  '&:hover': {
    background: '#f0fff5',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.12)', // rotateを削除
  },
  '&:active': {
    background: '#d7f7e3',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
    transform: 'scale(0.95)', // 押し込み感を追加
  },
})

// アイコンそのもの（大きさや色のみ）
const scrollTopIcon = css({
  color: '#1bbf46', // 少し落ち着いた緑
  fontSize: '2.2rem',
})
