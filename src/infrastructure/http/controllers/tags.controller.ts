import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { TagMapper } from "@mappers/tag.mapper"
import { createTagSchema } from "@schemas/tag-create.schema"
import { patchTagSchema } from "@schemas/tag-patch.schema"

export function createTagRouter(deps: {
  listTagsUseCase: any
  getTagByIdUseCase: any
  listIncidentsByTagUseCase: any
  createTagUseCase: any
  patchTagUseCase: any
  deleteTagUseCase: any
}) {
  const router = new Hono()

  router.get("/", async (c) => {
    const tags = await deps.listTagsUseCase.execute()
    return c.json(tags.map(TagMapper.toResponse))
  })

  router.get("/:id", async (c) => {
    const id = c.req.param("id")
    const tag = await deps.getTagByIdUseCase.execute(id)
    return c.json(TagMapper.toResponse(tag))
  })

  router.get("/:id/incidents", async (c) => {
    const id = c.req.param("id")
    const incidents = await deps.listIncidentsByTagUseCase.execute(id)
    return c.json({ data: incidents, total: incidents.length })
  })

  router.post("/", zValidator("json", createTagSchema), async (c) => {
    const body = c.req.valid("json")
    const tag = await deps.createTagUseCase.execute({
      name: body.name,
      color: body.color,
    })
    return c.json(TagMapper.toResponse(tag), 201)
  })

  router.patch("/:id", zValidator("json", patchTagSchema), async (c) => {
    const id = c.req.param("id")
    const body = c.req.valid("json")
    const tag = await deps.patchTagUseCase.execute(id, {
      name: body.name,
      color: body.color,
    })
    return c.json(TagMapper.toResponse(tag))
  })

  router.delete("/:id", async (c) => {
    const id = c.req.param("id")
    await deps.deleteTagUseCase.execute(id)
    return c.body(null, 204)
  })

  return router
}
