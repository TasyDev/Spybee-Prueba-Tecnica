import { z } from "zod"

export const patchUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
})

export type PatchUserSchema = z.infer<typeof patchUserSchema>
