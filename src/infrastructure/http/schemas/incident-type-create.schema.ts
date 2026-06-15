import { z } from "zod"

export const createIncidentTypeSchema = z.object({
  name: z.string().min(1).max(255),
})

export type CreateIncidentTypeSchema = z.infer<typeof createIncidentTypeSchema>
