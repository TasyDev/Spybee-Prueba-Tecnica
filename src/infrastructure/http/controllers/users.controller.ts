import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { UserMapper } from "@mappers/user.mapper"
import { createUserSchema } from "@schemas/user-create.schema"
import { patchUserSchema } from "@schemas/user-patch.schema"

export function createUserRouter(deps: {
  listUsersUseCase: any
  getUserByIdUseCase: any
  listIncidentsByUserUseCase: any
  createUserUseCase: any
  patchUserUseCase: any
  deleteUserUseCase: any
}) {
  const router = new Hono()

  router.get("/", async (c) => {
    const users = await deps.listUsersUseCase.execute()
    return c.json(users.map(UserMapper.toResponse))
  })

  router.get("/:id", async (c) => {
    const id = c.req.param("id")
    const user = await deps.getUserByIdUseCase.execute(id)
    return c.json(UserMapper.toResponse(user))
  })

  router.get("/:id/incidents", async (c) => {
    const id = c.req.param("id")
    const incidents = await deps.listIncidentsByUserUseCase.execute(id)
    return c.json({ data: incidents, total: incidents.length })
  })

  router.post("/", zValidator("json", createUserSchema), async (c) => {
    const body = c.req.valid("json")
    const user = await deps.createUserUseCase.execute({
      name: body.name,
      email: body.email,
    })
    return c.json(UserMapper.toResponse(user), 201)
  })

  router.patch("/:id", zValidator("json", patchUserSchema), async (c) => {
    const id = c.req.param("id")
    const body = c.req.valid("json")
    const user = await deps.patchUserUseCase.execute(id, {
      name: body.name,
      email: body.email,
    })
    return c.json(UserMapper.toResponse(user))
  })

  router.delete("/:id", async (c) => {
    const id = c.req.param("id")
    await deps.deleteUserUseCase.execute(id)
    return c.body(null, 204)
  })

  return router
}
