import { z } from "zod"

export const uploadMediaSchema = z.object({
  url: z.string().url(),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().min(0),
})

export type UploadMediaSchema = z.infer<typeof uploadMediaSchema>
