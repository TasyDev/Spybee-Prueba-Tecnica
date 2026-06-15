export enum IncidentStatus {
  open = "open",
  in_progress = "in_progress",
  resolved = "resolved",
  closed = "closed",
  rejected = "rejected",
}

export const VALID_STATUS_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  [IncidentStatus.open]: [IncidentStatus.in_progress, IncidentStatus.resolved, IncidentStatus.rejected],
  [IncidentStatus.in_progress]: [IncidentStatus.resolved, IncidentStatus.open],
  [IncidentStatus.resolved]: [IncidentStatus.closed, IncidentStatus.open],
  [IncidentStatus.closed]: [],
  [IncidentStatus.rejected]: [IncidentStatus.open],
};
