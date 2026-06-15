import { z } from "zod"

export const patchProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
})

export type PatchProjectSchema = z.infer<typeof patchProjectSchema>
