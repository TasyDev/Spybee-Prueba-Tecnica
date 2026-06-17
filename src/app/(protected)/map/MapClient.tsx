'use client';

import { useEffect, useCallback, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useIncidentStore } from '@/store/incidentStore';
import { useFilteredIncidents } from '@/store/incidentSelectors';
import type { Priority, Status } from '@/store/types';
import { Icon } from '@/components/atoms/icons/Icon';
import { MapSearchNavbar } from '@/components/molecules/navigation/MapSearchNavbar';
import { MapControlGroup } from '@/components/molecules/navigation/MapControlGroup';
import { MapLegend } from '@/components/molecules/cards/MapLegend';
import { MapSkeleton } from '@/components/organisms/maps/MapSkeleton';
import type { MapViewRef } from '@/components/organisms/maps/MapView';
import styles from './map-client.module.scss';

const MapView = dynamic(
  () => import('@/components/organisms/maps/MapView').then((m) => ({ default: m.MapView })),
  { ssr: false },
);

export function MapClient() {
  const fetchIncidents = useIncidentStore((s) => s.fetchIncidents);
  const fetchIncidentTypes = useIncidentStore((s) => s.fetchIncidentTypes);
  const incidentTypes = useIncidentStore((s) => s.incidentTypes);
  const loading = useIncidentStore((s) => s.loading);
  const setSelected = useIncidentStore((s) => s.setSelected);
  const selectedId = useIncidentStore((s) => s.selectedId);
  const filters = useIncidentStore((s) => s.filters);
  const setFilter = useIncidentStore((s) => s.setFilter);
  const setSearch = useIncidentStore((s) => s.setSearch);
  const clearFilters = useIncidentStore((s) => s.clearFilters);
  const incidents = useFilteredIncidents();
  const mapViewRef = useRef<MapViewRef>(null);

  useEffect(() => {
    fetchIncidents();
    fetchIncidentTypes();
  }, [fetchIncidents, fetchIncidentTypes]);

  const handleMarkerClick = useCallback(
    (id: string | null) => setSelected(id),
    [setSelected],
  );

  const handleZoomIn = useCallback(() => {
    mapViewRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapViewRef.current?.zoomOut();
  }, []);

  const handleRecenter = useCallback(() => {
    mapViewRef.current?.fitBounds();
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, [setSearch]);

  const handleNavbarPriorityChange = useCallback((priority: Priority) => {
    const current = filters.priority;
    const next = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    setFilter('priority', next);
  }, [filters.priority, setFilter]);

  const handleStatusChange = useCallback((status: Status) => {
    const current = filters.status;
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    setFilter('status', next);
  }, [filters.status, setFilter]);

  const handleTypeChange = useCallback((typeId: string) => {
    const current = filters.type;
    const next = current.includes(typeId)
      ? current.filter((t) => t !== typeId)
      : [...current, typeId];
    setFilter('type', next);
  }, [filters.type, setFilter]);

  const typeOptions = useMemo(() => {
    return incidentTypes.map((type) => ({ id: type.id, name: type.name }));
  }, [incidentTypes]);

  const legendItems = useMemo(() => {
    const high = incidents.filter((i) => i.priority === 'high').length;
    const medium = incidents.filter((i) => i.priority === 'medium').length;
    const low = incidents.filter((i) => i.priority === 'low').length;
    return [
      { variant: 'critical' as const, label: `High Priority (${high})` },
      { variant: 'watchlist' as const, label: `Medium Priority (${medium})` },
      { variant: 'logged' as const, label: `Low Priority (${low})` },
    ];
  }, [incidents]);

  if (loading && incidents.length === 0) {
    return <MapSkeleton />;
  }

  const showEmptyState = !loading && incidents.length === 0;

  return (
    <div className={styles.mapClient}>
      <MapSearchNavbar
        search={filters.search}
        onSearchChange={handleSearchChange}
        priorityFilter={filters.priority}
        onPriorityChange={handleNavbarPriorityChange}
        statusFilter={filters.status}
        onStatusChange={handleStatusChange}
        typeFilter={filters.type}
        typeOptions={typeOptions}
        onTypeChange={handleTypeChange}
        onRecenter={handleRecenter}
        className={styles.mapClient__navbar}
      />

      <div className={styles.mapClient__mapArea}>
        <MapView
          ref={mapViewRef}
          incidents={incidents}
          selectedId={selectedId}
          onIncidentClick={handleMarkerClick}
        />
      </div>

      <div className={styles.mapClient__controls}>
        <MapControlGroup
          groups={[
            [
              { id: 'zoom-in', icon: <Icon name="plus" size={14} color="#EBE1D1" />, onClick: handleZoomIn },
              { id: 'zoom-out', icon: <Icon name="minus" size={14} color="#EBE1D1" />, onClick: handleZoomOut },
            ],
          ]}
        />
      </div>

      <div className={styles.mapClient__legend}>
        <MapLegend title="MAP LEGEND" items={legendItems} />
      </div>

      {showEmptyState && (
        <div className={styles.mapClient__empty}>
          <Icon name="map" size={32} color="#9A9078" />
          <p>No incidents match the current filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className={styles.mapClient__clearBtn}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
