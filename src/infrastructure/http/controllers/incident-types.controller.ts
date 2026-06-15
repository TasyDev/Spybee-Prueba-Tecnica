import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { IncidentTypeMapper } from "@mappers/incident-type.mapper"
import { createIncidentTypeSchema } from "@schemas/incident-type-create.schema"
import { patchIncidentTypeSchema } from "@schemas/incident-type-patch.schema"

export function createIncidentTypeRouter(deps: {
  listIncidentTypesUseCase: any
  getIncidentTypeByIdUseCase: any
  listIncidentsByIncidentTypeUseCase: any
  createIncidentTypeUseCase: any
  patchIncidentTypeUseCase: any
  deleteIncidentTypeUseCase: any
}) {
  const router = new Hono()

  router.get("/", async (c) => {
    const types = await deps.listIncidentTypesUseCase.execute()
    return c.json(types.map(IncidentTypeMapper.toResponse))
  })

  router.get("/:id", async (c) => {
    const id = c.req.param("id")
    const type = await deps.getIncidentTypeByIdUseCase.execute(id)
    return c.json(IncidentTypeMapper.toResponse(type))
  })

  router.get("/:id/incidents", async (c) => {
    const id = c.req.param("id")
    const incidents = await deps.listIncidentsByIncidentTypeUseCase.execute(id)
    return c.json({ data: incidents, total: incidents.length })
  })

  router.post("/", zValidator("json", createIncidentTypeSchema), async (c) => {
    const body = c.req.valid("json")
    const type = await deps.createIncidentTypeUseCase.execute({ name: body.name })
    return c.json(IncidentTypeMapper.toResponse(type), 201)
  })

  router.patch("/:id", zValidator("json", patchIncidentTypeSchema), async (c) => {
    const id = c.req.param("id")
    const body = c.req.valid("json")
    const type = await deps.patchIncidentTypeUseCase.execute(id, { name: body.name })
    return c.json(IncidentTypeMapper.toResponse(type))
  })

  router.delete("/:id", async (c) => {
    const id = c.req.param("id")
    await deps.deleteIncidentTypeUseCase.execute(id)
    return c.body(null, 204)
  })

  return router
}
