import { Context } from "hono"
import { NotFoundError } from "@domain/errors/domain.errors"
import {
  InvalidStatusTransitionError,
  IncidentAlreadyDeletedError,
  IncidentNotDeletedError,
  AssigneeAlreadyExistsError,
  AssigneeNotFoundError,
  ObserverAlreadyExistsError,
  ObserverNotFoundError,
} from "@domain/errors/incident.errors"

export function errorHandler(err: Error, c: Context) {
  if (err instanceof NotFoundError) {
    return c.json({ error: err.message }, 404)
  }

  if (
    err instanceof InvalidStatusTransitionError ||
    err instanceof IncidentAlreadyDeletedError ||
    err instanceof IncidentNotDeletedError ||
    err instanceof AssigneeAlreadyExistsError ||
    err instanceof AssigneeNotFoundError ||
    err instanceof ObserverAlreadyExistsError ||
    err instanceof ObserverNotFoundError
  ) {
    return c.json({ error: err.message }, 409)
  }

  if (err.name === "ZodError") {
    return c.json({ error: "Validation error", details: err.message }, 400)
  }

  console.error("Unhandled error:", err)
  return c.json({ error: "Internal server error" }, 500)
}
