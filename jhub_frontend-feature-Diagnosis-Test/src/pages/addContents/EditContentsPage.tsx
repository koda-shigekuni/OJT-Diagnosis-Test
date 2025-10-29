/** @jsxImportSource @emotion/react */
import { useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { Suspense } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetContentDetailQuery, usePostContentsMutate } from '../../api/hook/contents'
import text from '../../utils/text.json'
import { CONTENTS_URL } from '../../utils/URL'
import AddContentsForm from './AddContentsForm'
import ProgressSnackbar from './components/ProgressSnackbar'

/**
 * 編集ページの「本体」部分
 * - 詳細データの取得
 * - 共通フォームへの初期値セット
 * - 編集ミューテーション（API送信）
 *
 * Suspense で親からラップされている前提で、`data` 取得完了後のみ描画
 */
const EditContentsCore = () => {
  // URLのcontentIdを取得（/contents/:contentId/edit）
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const contentsId = Number(id)
  const { data } = useGetContentDetailQuery(contentsId)
  const { mutateAsync: postContentsMutate, isPending } = usePostContentsMutate()

  if (!contentsId || isNaN(Number(contentsId))) {
    return <div>{text.editContents['data.isEmpty']}</div>
  }
  if (!data) return <div>{text.editContents.getData}</div>

  const initialValues = {
    title: data.title,
    summary: data.summary,
    content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
    categoryId: String(data.categoryId),
    image: data.image ?? null,
  }

  return (
    <AddContentsForm
      mode="update"
      isSubmitting={isPending}
      initialValues={initialValues}
      onSubmit={async (values, displayFlag) => {
        try {
          await postContentsMutate({
            action: 'update',
            contentsId: id,
            title: values.title,
            summary: values.summary,
            content: values.content,
            categoryId: Number(values.categoryId),
            displayFlag,
            image: values.image,
          })

          // 成功 → キャッシュクリア
          await Promise.all([
            qc.invalidateQueries({ queryKey: ['contentDetail', id] }),
            qc.invalidateQueries({ queryKey: ['contents'] }),
          ])

          // 成功 → プログレス付きスナックバー
          const key = enqueueSnackbar('', {
            persist: true,
            content: () => (
              <ProgressSnackbar
                message="編集が完了しました"
                duration={2500}
                onClose={() => closeSnackbar(key)}
              />
            ),
          })

          // スナックバーが閉じるタイミングで遷移
          setTimeout(() => {
            navigate(CONTENTS_URL, { replace: true })
          }, 1000)
        } catch (err) {
          console.error('[EditContentsPage] 編集失敗:', err)
          enqueueSnackbar('編集に失敗しました', {
            variant: 'error',
            autoHideDuration: 3000,
          })
        }
      }}
    />
  )
}

/**
 * 親でSuspenseラップ
 */
const EditContentsPage = () => (
  <Suspense fallback={<div>{text.editContents.getData}</div>}>
    <EditContentsCore />
  </Suspense>
)

export default EditContentsPage
