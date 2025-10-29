/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box, Button, Divider, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetMyContentsQuery } from '../../../api/hook/mypage'
import text from '../../../utils/text.json'
import { contentDetailPath, contentsEditPath } from '../../../utils/URL'
import ContentsWrapper from '../../common/contentsWrapper'
import MyPageMenu from '../common/MyPageMenu'

const DEFAULT_SORT: 'DESC' | 'ASC' = 'DESC'

const MyContents = () => {
  const { data, isLoading, isError } = useGetMyContentsQuery()
  const [order, setOrder] = useState<'DESC' | 'ASC'>(DEFAULT_SORT)
  const navigate = useNavigate()

  // ソート済みデータ
  const sortedContents = useMemo(() => {
    const contents = data?.myContents ?? []
    return [...contents].sort((a, b) => {
      const da = new Date(a.last_post_date || '').getTime()
      const db = new Date(b.last_post_date || '').getTime()
      return order === 'DESC' ? db - da : da - db
    })
  }, [data?.myContents, order])

  return (
    <ContentsWrapper>
      <Box css={styles.layout}>
        <MyPageMenu>
          {/* ヘッダー */}
          <Box>
            <Typography css={styles.title}>{text.myContents.title}</Typography>
            <Box display={'flex'} justifyContent={'right'} margin={'20px 0'}>
              <Select
                size="small"
                value={order}
                onChange={e => {
                  setOrder(e.target.value as 'DESC' | 'ASC')
                }}
                css={styles.select}
              >
                <MenuItem value="DESC">{text.myContents.DESC}</MenuItem>
                <MenuItem value="ASC">{text.myContents.ASC}</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* ローディング & エラー */}
          {isLoading && <Typography>{text.myContents.load}</Typography>}
          {isError && <Typography color="error">{text.myContents.miss}</Typography>}

          {/* 一覧（全件表示＋スクロール） */}
          <Box css={styles.scrollArea}>
            {!isLoading &&
              !isError &&
              sortedContents.map(item => {
                const date = item.last_post_date
                  ? new Date(item.last_post_date).toLocaleDateString('ja-JP')
                  : ''
                return (
                  <Box
                    key={item.content_id}
                    css={styles.card}
                    onClick={() => navigate(contentDetailPath(item.content_id))}
                  >
                    <Box css={styles.dateHeader}>{date}</Box>
                    <Box css={styles.body}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography css={styles.itemTitle}>{item.title}</Typography>
                        {/* 編集ボタン追加 */}
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={e => {
                            e.stopPropagation()
                            navigate(contentsEditPath(item.content_id))
                          }}
                          css={editButton}
                        >
                          {text.contentDetail.edit}
                        </Button>
                      </Box>
                      <Typography css={styles.summary}>{item.summary}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <ChatBubbleIcon color="success" fontSize="small" />
                          <Typography>{item.comment_count}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <FavoriteIcon color="error" fontSize="small" />
                          <Typography>{item.like_count}</Typography>
                        </Stack>
                        <Typography color="text.secondary">{item.category_name}</Typography>
                      </Stack>
                    </Box>
                  </Box>
                )
              })}
          </Box>
        </MyPageMenu>
      </Box>
    </ContentsWrapper>
  )
}

export default MyContents

const styles = {
  layout: css({ padding: 10, display: 'flex', gap: 110, justifyContent: 'center' }),
  title: css({
    paddingBottom: '10px',
    borderBottom: '1px solid',
    fontSize: '30px',
    fontFamily: '"Dela Gothic One", sans-serif',
  }),
  select: css({ minWidth: 120 }),
  scrollArea: css({
    maxHeight: '700px',
    overflowY: 'auto',
    paddingRight: '8px',
  }),
  card: css({
    border: '1px solid #eee',
    borderRadius: '4px',
    overflow: 'hidden',
    ':hover': { background: 'rgba(255, 200, 98, 0.25)' },
  }),
  dateHeader: css({
    backgroundColor: '#f8d7a4',
    padding: '6px 12px',
    fontWeight: 'bold',
  }),
  body: css({ padding: '12px' }),
  itemTitle: css({ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }),
  summary: css({ color: '#555', marginBottom: '8px' }),
}

const editButton = css({
  color: '#fff',
  backgroundColor: '#22C55E',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: 6,
})
