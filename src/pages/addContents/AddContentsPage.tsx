/** @jsxImportSource @emotion/react */
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { usePostContentsMutate } from '../../api/hook/contents'
import { CONTENTS_URL } from '../../utils/URL'
import AddContentsForm from './AddContentsForm'
import ProgressSnackbar from './components/ProgressSnackbar'

const AddContentsPage = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { mutateAsync: postContentsMutate, isPending } = usePostContentsMutate()

  return (
    <AddContentsForm
      mode="create"
      isSubmitting={isPending}
      onSubmit={async (values, displayFlag) => {
        try {
          await postContentsMutate({
            action: 'create',
            title: values.title,
            summary: values.summary,
            content: values.content,
            categoryId: Number(values.categoryId),
            displayFlag,
            image: values.image,
          })

          // 投稿成功 → カスタムスナックバー
          const key = enqueueSnackbar('', {
            persist: true, // 自動で消えないようにする
            content: () => (
              <ProgressSnackbar
                message="投稿が完了しました"
                duration={2500}
                onClose={() => closeSnackbar(key)}
              />
            ),
          })

          // 一定時間後にリダイレクト
          setTimeout(() => {
            navigate(CONTENTS_URL, { replace: true })
          }, 1000)
        } catch (err) {
          console.error('[AddContentsPage] 投稿失敗:', err)
          enqueueSnackbar('投稿に失敗しました', {
            variant: 'error',
            autoHideDuration: 3000,
          })
        }
      }}
    />
  )
}

export default AddContentsPage
