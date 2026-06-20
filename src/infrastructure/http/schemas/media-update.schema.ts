import { z } from "zod"

export const updateMediaSchema = z.object({
  status: z.enum(["uploaded", "processing", "failed"]),
})

export type UpdateMediaSchema = z.infer<typeof updateMediaSchema>
