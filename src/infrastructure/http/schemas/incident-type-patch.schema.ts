import { z } from "zod"

export const patchIncidentTypeSchema = z.object({
  name: z.string().min(1).max(255).optional(),
})

export type PatchIncidentTypeSchema = z.infer<typeof patchIncidentTypeSchema>
