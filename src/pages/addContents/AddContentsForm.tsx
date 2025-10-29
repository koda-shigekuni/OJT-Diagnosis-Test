/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Stack, Typography } from '@mui/material'
import type { JSONContent } from '@tiptap/core'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import type z from 'zod'
import type { RootState } from '../../redux/store'
import { useAppSelector } from '../../redux/store/hook'
import text from '../../utils/text.json'
import { contentsSchema } from '../../validation/contentsSchema'
import ContentsWrapper from '../common/contentsWrapper'
import AddContentsConfirm, { type ConfirmValues } from './AddContentsConfirm'
import CategorySelect from './components/CategorySelect'
import EditorWithPreview from './components/EditorWithPreview'
import SubmitActions from './components/SubmitActions'
import SummaryInput from './components/SummaryInput'
import TitleInput from './components/TitleInput'

type FormValues = z.infer<typeof contentsSchema>

type Props = {
  mode: 'create' | 'update'
  initialValues?: Omit<FormValues, 'image'> & { image?: string | null }
  /** 送信用の image は Base64/URL（string|null）で渡す */
  onSubmit: (
    values: Omit<FormValues, 'image'> & { image: string | null },
    displayFlag: number
  ) => Promise<void>
  isSubmitting?: boolean
}

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const AddContentsForm = ({ mode, initialValues, onSubmit, isSubmitting }: Props) => {
  const categories = useAppSelector((s: RootState) => s.category.items)

  /** プレビュー・送信用は string|null で統一 */
  const [imageBase64, setImageBase64] = useState<string | null>(
    typeof initialValues?.image === 'string' ? initialValues.image : null
  )

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmValues, setConfirmValues] = useState<ConfirmValues | null>(null)
  const submittingRef = useRef(false)

  // RHF: 画像フィールドは File/FileList/null/undefined（zodに準拠）
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contentsSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      summary: initialValues?.summary ?? '',
      content: initialValues?.content ?? { type: 'doc', content: [] },
      image: undefined, // ← string は入れない（File系だけ）
      categoryId: initialValues?.categoryId ? String(initialValues.categoryId) : '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  // 編集：API取得後に初期値を反映（RHFの image は常に undefined/null、プレビューは string を別管理）
  useEffect(() => {
    if (!initialValues) return
    reset({
      title: initialValues.title ?? '',
      summary: initialValues.summary ?? '',
      content: initialValues.content ?? { type: 'doc', content: [] },
      image: undefined,
      categoryId: initialValues.categoryId ? String(initialValues.categoryId) : '',
    })
    setImageBase64(typeof initialValues.image === 'string' ? initialValues.image : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues])

  // 確認ダイアログ表示用
  const openConfirm = (form: FormValues, displayFlag: number) => {
    const cid = Number(form.categoryId ?? '')
    const category = categories.find((c: { id: number; label?: string }) => c.id === cid)

    const values: ConfirmValues = {
      title: form.title,
      summary: form.summary,
      content: (form.content as JSONContent) ?? { type: 'doc', content: [] },
      imageBase64: imageBase64 && imageBase64.trim() !== '' ? imageBase64 : null,
      categoryName: category?.label ?? '',
      displayFlag: displayFlag === 1 ? 1 : 0,
      categoryId: cid,
    }
    setConfirmValues(values)
    setConfirmOpen(true)
  }

  const handleSubmitWithFlag = (displayFlag: number) =>
    handleSubmit(form => openConfirm(form, displayFlag))

  const onConfirmPost = async () => {
    if (!confirmValues) return
    if (submittingRef.current || isSubmitting) return
    submittingRef.current = true
    try {
      await onSubmit(
        {
          title: confirmValues.title,
          summary: confirmValues.summary,
          content: confirmValues.content,
          /** ← APIへ渡す image は string|null で統一 */
          image: imageBase64 && imageBase64.trim() !== '' ? imageBase64 : null,
          categoryId: String(confirmValues.categoryId),
        },
        confirmValues.displayFlag
      )
      setConfirmOpen(false)
      setConfirmValues(null)
      reset()
      setImageBase64('')
    } finally {
      submittingRef.current = false
    }
  }

  /** Enter送信時は公開（displayFlag=0）で確認ダイアログを開く */
  const onFormSubmit: SubmitHandler<FormValues> = form => openConfirm(form, 0)

  return (
    <ContentsWrapper>
      <form onSubmit={handleSubmit(onFormSubmit)} css={formWrapper}>
        <div css={headerArea}>
          <Typography css={titleTypo} variant="h5">
            {mode === 'create'
              ? text.postContents.title
              : text.postContents.editTitle || 'コンテンツ編集'}
          </Typography>
        </div>

        <Stack spacing={3}>
          <div css={section}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TitleInput
                  value={field.value}
                  onChange={v => field.onChange(v)}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
          </div>

          <div css={section}>
            <Controller
              name="summary"
              control={control}
              render={({ field }) => (
                <SummaryInput
                  summary={field.value}
                  onChange={v => field.onChange(v)}
                  error={!!errors.summary}
                  helperText={errors.summary?.message}
                />
              )}
            />
          </div>

          <Box css={categoryFooter}>
            <div css={categoryBoxNarrow}>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <CategorySelect
                    value={field.value ?? ''}
                    onChange={v => field.onChange(v == null ? '' : String(v))}
                    required
                    error={!!errors.categoryId}
                    helperText={errors.categoryId?.message}
                  />
                )}
              />
            </div>
          </Box>

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <EditorWithPreview
                content={field.value}
                onChange={v => field.onChange(v as JSONContent)}
                /** プレビューは string|null だけを渡す */
                image={imageBase64 || null}
                onImageChange={async file => {
                  // RHF側は File/FileList/null/undefined を保持（バリデーション用）
                  setValue('image', file ?? undefined, { shouldValidate: true })
                  if (!file) {
                    setImageBase64('')
                    return
                  }
                  const base64 = await fileToDataUrl(file)
                  setImageBase64(base64)
                }}
                errorMessage={
                  typeof errors.content?.message === 'string' ? errors.content.message : undefined
                }
                imageErrorMessage={errors.image?.message}
              />
            )}
          />

          <Box css={actionsRow}>
            <SubmitActions onSubmit={flag => handleSubmitWithFlag(flag)()} />
          </Box>
        </Stack>
      </form>

      <AddContentsConfirm
        open={confirmOpen}
        values={confirmValues}
        sending={!!isSubmitting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmPost}
      />
    </ContentsWrapper>
  )
}

export default AddContentsForm

const formWrapper = css({ padding: '32px', maxWidth: '950px', margin: '0 auto' })
const headerArea = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
  gap: 12,
})
const titleTypo = css({
  fontFamily: '"Dela Gothic One", sans-serif',
  fontSize: '1.5rem',
  flex: '1 1 auto',
  minWidth: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})
const section = css({ padding: 0, borderRadius: 6, boxShadow: 'none' })
const actionsRow = css({ display: 'flex', justifyContent: 'flex-end', gap: 8 })
const categoryFooter = css({ display: 'flex', justifyContent: 'flex-start', marginTop: 6 })
const categoryBoxNarrow = css({ width: 200 })
// eslint-disable-next-line react-refresh/only-export-components
export const errorTextOutside = css({
  marginBottom: 6,
  padding: '4px 6px',
  display: 'block',
  borderLeft: '3px solid #d32f2f',
  color: '#d32f2f',
  whiteSpace: 'nowrap',
})
