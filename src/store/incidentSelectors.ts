import { useIncidentStore } from './incidentStore';

export function useFilteredIncidents() {
  const incidents = useIncidentStore((state) => state.incidents);
  const filters = useIncidentStore((state) => state.filters);

  const { status, priority, type, search, project, assignee, observer, owner } = filters;
  const normalizedSearch = search.trim().toLowerCase();
  const hasActiveFilters =
    status.length > 0 ||
    priority.length > 0 ||
    type.length > 0 ||
    project.length > 0 ||
    assignee.length > 0 ||
    observer.length > 0 ||
    owner.length > 0 ||
    normalizedSearch.length > 0;

  if (!hasActiveFilters) return incidents;

  return incidents.filter((incident) => {
    if (status.length > 0 && !status.includes(incident.status)) return false;
    if (priority.length > 0 && !priority.includes(incident.priority)) return false;
    if (type.length > 0 && !type.includes(incident.type?.id ?? '')) return false;
    if (project.length > 0 && !project.includes(incident.project?.id ?? '')) return false;
    if (assignee.length > 0 && !assignee.some((id) => incident.assignees.some((a) => a.id === id))) return false;
    if (observer.length > 0 && !observer.some((id) => incident.observers.some((o) => o.id === id))) return false;
    if (owner.length > 0 && !owner.includes(incident.owner?.id ?? '')) return false;
    if (normalizedSearch.length > 0) {
      const text = `${incident.title} ${incident.description} ${incident.locationDescription} ${incident.project?.name ?? ''} ${incident.owner?.name ?? ''} ${incident.assignees.map((a) => a.name).join(' ')} ${incident.observers.map((o) => o.name).join(' ')}`.toLowerCase();
      if (!text.includes(normalizedSearch)) return false;
    }
    return true;
  });
}

export function useSelectedIncident() {
  return useIncidentStore((state) => {
    if (!state.selectedId) return null;
    return state.incidents.find((i) => i.id === state.selectedId) ?? null;
  });
}

export function useIncidentStats() {
  const incidents = useIncidentStore((state) => state.incidents);

  const total = incidents.length;
  const open = incidents.filter((i) => i.status === 'open').length;
  const high = incidents.filter((i) => i.priority === 'high').length;

  return { total, open, high };
}
