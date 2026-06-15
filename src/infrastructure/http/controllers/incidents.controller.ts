import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { Location } from "@domain/value-objects/location.vo"
import { IncidentMapper } from "@mappers/incident.mapper"
import { MediaMapper } from "@mappers/media.mapper"
import { createIncidentSchema } from "@schemas/incident-create.schema"
import { patchIncidentSchema } from "@schemas/incident-patch.schema"
import { uploadMediaSchema } from "@schemas/media-upload.schema"
import { updateMediaSchema } from "@schemas/media-update.schema"

export function createIncidentRouter(deps: {
  listIncidentsUseCase: any
  getIncidentByIdUseCase: any
  createIncidentUseCase: any
  patchIncidentUseCase: any
  deleteIncidentUseCase: any
  restoreIncidentUseCase: any
  addAssigneeUseCase: any
  removeAssigneeUseCase: any
  addObserverUseCase: any
  removeObserverUseCase: any
  attachTagUseCase: any
  detachTagUseCase: any
  uploadMediaUseCase: any
  updateMediaUseCase: any
  deleteMediaUseCase: any
}) {
  const router = new Hono()

  router.get("/", async (c) => {
    const query = c.req.query()
    const filters = {
      projectId: query.project,
      status: query.status,
      priority: query.priority,
      incidentTypeId: query.type,
      ownerId: query.owner,
      assigneeId: query.assignee,
      tagId: query.tag,
      deletedOnly: query.deleted === "true",
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      orderBy: query.sort as any,
      orderDir: query.order as any,
    }
    const incidents = await deps.listIncidentsUseCase.execute(filters)
    return c.json({
      data: incidents.map(IncidentMapper.toResponse),
      total: incidents.length,
    })
  })

  router.get("/:id", async (c) => {
    const id = c.req.param("id")
    const incident = await deps.getIncidentByIdUseCase.execute(id)
    return c.json(IncidentMapper.toResponse(incident))
  })

  router.post("/", zValidator("json", createIncidentSchema), async (c) => {
    const body = c.req.valid("json")
    const incident = await deps.createIncidentUseCase.execute({
      title: body.title,
      description: body.description,
      priority: body.priority,
      location: Location.create(body.coordinates.lat, body.coordinates.lng),
      projectId: body.projectId,
      incidentTypeId: body.incidentTypeId,
      reportedById: body.reportedById,
      locationDescription: body.locationDescription,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      whatsappOwner: body.whatsappOwner ?? undefined,
    })
    return c.json(IncidentMapper.toResponse(incident), 201)
  })

  router.patch("/:id", zValidator("json", patchIncidentSchema), async (c) => {
    const id = c.req.param("id")
    const body = c.req.valid("json")
    const incident = await deps.patchIncidentUseCase.execute(id, {
      title: body.title,
      description: body.description,
      priority: body.priority,
      location: body.coordinates
        ? Location.create(body.coordinates.lat, body.coordinates.lng)
        : undefined,
      status: body.status,
      incidentTypeId: body.incidentTypeId,
      locationDescription: body.locationDescription,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      whatsappOwner: body.whatsappOwner,
      approval: body.approval,
    })
    return c.json(IncidentMapper.toResponse(incident))
  })

  router.delete("/:id", async (c) => {
    const id = c.req.param("id")
    await deps.deleteIncidentUseCase.execute(id)
    return c.body(null, 204)
  })

  router.patch("/:id/restore", async (c) => {
    const id = c.req.param("id")
    await deps.restoreIncidentUseCase.execute(id)
    return c.json({ success: true })
  })

  router.post("/:id/assignees", async (c) => {
    const incidentId = c.req.param("id")
    const { userId } = await c.req.json()
    await deps.addAssigneeUseCase.execute(incidentId, userId)
    return c.json({ success: true }, 201)
  })

  router.delete("/:id/assignees/:userId", async (c) => {
    const incidentId = c.req.param("id")
    const userId = c.req.param("userId")
    await deps.removeAssigneeUseCase.execute(incidentId, userId)
    return c.body(null, 204)
  })

  router.post("/:id/observers", async (c) => {
    const incidentId = c.req.param("id")
    const { userId } = await c.req.json()
    await deps.addObserverUseCase.execute(incidentId, userId)
    return c.json({ success: true }, 201)
  })

  router.delete("/:id/observers/:userId", async (c) => {
    const incidentId = c.req.param("id")
    const userId = c.req.param("userId")
    await deps.removeObserverUseCase.execute(incidentId, userId)
    return c.body(null, 204)
  })

  router.post("/:id/tags", async (c) => {
    const incidentId = c.req.param("id")
    const { tagId } = await c.req.json()
    await deps.attachTagUseCase.execute(incidentId, tagId)
    return c.json({ success: true }, 201)
  })

  router.delete("/:id/tags/:tagId", async (c) => {
    const incidentId = c.req.param("id")
    const tagId = c.req.param("tagId")
    await deps.detachTagUseCase.execute(incidentId, tagId)
    return c.body(null, 204)
  })

  router.post("/:id/media", async (c) => {
    const incidentId = c.req.param("id")
    const body = await c.req.parseBody()
    const file = body.file as File
    
    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400)
    }
    
    const buffer = Buffer.from(await file.arrayBuffer())
    const media = await deps.uploadMediaUseCase.execute(incidentId, {
      file: buffer,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    })
    return c.json(MediaMapper.toResponse(media), 201)
  })

  router.patch("/:id/media/:mediaId", zValidator("json", updateMediaSchema), async (c) => {
    const mediaId = c.req.param("mediaId")
    const body = c.req.valid("json")
    const media = await deps.updateMediaUseCase.execute(mediaId, {
      status: body.status,
    })
    return c.json(MediaMapper.toResponse(media))
  })

  router.delete("/:id/media/:mediaId", async (c) => {
    const mediaId = c.req.param("mediaId")
    await deps.deleteMediaUseCase.execute(mediaId)
    return c.body(null, 204)
  })

  return router
}
