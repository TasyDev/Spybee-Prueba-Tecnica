import { z } from "zod"

export const createTagSchema = z.object({
  name: z.string().min(1).max(255),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})

export type CreateTagSchema = z.infer<typeof createTagSchema>
