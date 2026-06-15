import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { ProjectMapper } from "@mappers/project.mapper"
import { createProjectSchema } from "@schemas/project-create.schema"
import { patchProjectSchema } from "@schemas/project-patch.schema"

export function createProjectRouter(deps: {
  listProjectsUseCase: any
  getProjectByIdUseCase: any
  listIncidentsByProjectUseCase: any
  createProjectUseCase: any
  patchProjectUseCase: any
  deleteProjectUseCase: any
}) {
  const router = new Hono()

  router.get("/", async (c) => {
    const projects = await deps.listProjectsUseCase.execute()
    return c.json(projects.map(ProjectMapper.toResponse))
  })

  router.get("/:id", async (c) => {
    const id = c.req.param("id")
    const project = await deps.getProjectByIdUseCase.execute(id)
    return c.json(ProjectMapper.toResponse(project))
  })

  router.get("/:id/incidents", async (c) => {
    const id = c.req.param("id")
    const incidents = await deps.listIncidentsByProjectUseCase.execute(id)
    return c.json({ data: incidents, total: incidents.length })
  })

  router.post("/", zValidator("json", createProjectSchema), async (c) => {
    const body = c.req.valid("json")
    const project = await deps.createProjectUseCase.execute({ name: body.name })
    return c.json(ProjectMapper.toResponse(project), 201)
  })

  router.patch("/:id", zValidator("json", patchProjectSchema), async (c) => {
    const id = c.req.param("id")
    const body = c.req.valid("json")
    const project = await deps.patchProjectUseCase.execute(id, { name: body.name })
    return c.json(ProjectMapper.toResponse(project))
  })

  router.delete("/:id", async (c) => {
    const id = c.req.param("id")
    await deps.deleteProjectUseCase.execute(id)
    return c.body(null, 204)
  })

  return router
}
