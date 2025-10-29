import { z } from 'zod'

export const loginSchema = z.object({
  id: z.string().min(1, '社員ID は必須です'),
  pass: z.string().min(1, 'パスワードは必須です'),
})

export type LoginSchemaType = z.infer<typeof loginSchema>
