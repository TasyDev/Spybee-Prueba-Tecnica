export class InvalidStatusTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Invalid status transition from "${from}" to "${to}"`)
    this.name = "InvalidStatusTransitionError"
  }
}

export class IncidentAlreadyDeletedError extends Error {
  constructor(id: string) {
    super(`Incident with id ${id} is already deleted`)
    this.name = "IncidentAlreadyDeletedError"
  }
}

export class IncidentNotDeletedError extends Error {
  constructor(id: string) {
    super(`Incident with id ${id} is not deleted`)
    this.name = "IncidentNotDeletedError"
  }
}

export class AssigneeAlreadyExistsError extends Error {
  constructor(incidentId: string, userId: string) {
    super(`Assignee ${userId} already exists in incident ${incidentId}`)
    this.name = "AssigneeAlreadyExistsError"
  }
}

export class AssigneeNotFoundError extends Error {
  constructor(incidentId: string, userId: string) {
    super(`Assignee ${userId} not found in incident ${incidentId}`)
    this.name = "AssigneeNotFoundError"
  }
}

export class ObserverAlreadyExistsError extends Error {
  constructor(incidentId: string, userId: string) {
    super(`Observer ${userId} already exists in incident ${incidentId}`)
    this.name = "ObserverAlreadyExistsError"
  }
}

export class ObserverNotFoundError extends Error {
  constructor(incidentId: string, userId: string) {
    super(`Observer ${userId} not found in incident ${incidentId}`)
    this.name = "ObserverNotFoundError"
  }
}
