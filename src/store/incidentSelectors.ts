import { useIncidentStore } from './incidentStore';

export function useFilteredIncidents() {
  const incidents = useIncidentStore((state) => state.incidents);
  const filters = useIncidentStore((state) => state.filters);

  const { status, priority, type, search } = filters;
  const normalizedSearch = search.trim().toLowerCase();
  const hasActiveFilters =
    status.length > 0 ||
    priority.length > 0 ||
    type.length > 0 ||
    normalizedSearch.length > 0;

  if (!hasActiveFilters) return incidents;

  return incidents.filter((incident) => {
    if (status.length > 0 && !status.includes(incident.status)) return false;
    if (priority.length > 0 && !priority.includes(incident.priority)) return false;
    if (type.length > 0 && !type.includes(incident.type?.id ?? '')) return false;
    if (normalizedSearch.length > 0) {
      const text = `${incident.title} ${incident.description} ${incident.locationDescription}`.toLowerCase();
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
