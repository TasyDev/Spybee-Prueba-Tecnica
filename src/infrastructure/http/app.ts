import { Hono } from "hono"
import { errorHandler } from "@middleware/error-handler"

export function createApp(deps: {
  incidentRouter: Hono
  projectRouter: Hono
  userRouter: Hono
  tagRouter: Hono
  incidentTypeRouter: Hono
}) {
  const app = new Hono().basePath("/api")

  app.onError(errorHandler)

  app.route("/incidents", deps.incidentRouter)
  app.route("/projects", deps.projectRouter)
  app.route("/users", deps.userRouter)
  app.route("/tags", deps.tagRouter)
  app.route("/incident-types", deps.incidentTypeRouter)

  return app
}
