// src/schema/commentSchema.ts
import { z } from 'zod'
import text from '../utils/text.json'

export const commentSchema = z.object({
  commentBody: z.string().min(1, text.comment['comment.isEmpty']),
})

export type CommentFormInput = z.infer<typeof commentSchema>
