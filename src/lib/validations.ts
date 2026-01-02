import { z } from 'zod'

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(200, 'タイトルは200文字以内で入力してください'),
  content: z
    .string()
    .min(1, '本文は必須です')
    .max(10000, '本文は10000文字以内で入力してください'),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
