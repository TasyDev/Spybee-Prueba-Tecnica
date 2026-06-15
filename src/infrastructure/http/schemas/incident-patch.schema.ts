import { z } from "zod"

export const patchIncidentSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  status: z.enum(["open", "in_progress", "resolved", "closed", "rejected"]).optional(),
  incidentTypeId: z.string().optional(),
  locationDescription: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  whatsappOwner: z.string().optional(),
  approval: z.boolean().optional(),
})

export type PatchIncidentSchema = z.infer<typeof patchIncidentSchema>
