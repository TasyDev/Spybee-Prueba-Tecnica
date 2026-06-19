import { z } from "zod"

export const createIncidentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  projectId: z.string().optional(),
  incidentTypeId: z.string().optional(),
  reportedById: z.string().optional(),
  locationDescription: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  whatsappOwner: z.string().optional(),
  assigneeIds: z.array(z.string()).optional(),
  observerIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["open", "draft"]).optional(),
})

export type CreateIncidentSchema = z.infer<typeof createIncidentSchema>
