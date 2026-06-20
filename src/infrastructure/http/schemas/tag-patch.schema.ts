import { z } from "zod"

export const patchTagSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})

export type PatchTagSchema = z.infer<typeof patchTagSchema>
