'use client';

import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { z } from 'zod';
import { useIncidentStore } from '@/store/incidentStore';
import { useIncidentCreationStore } from '@/store/incidentCreationStore';
import { useFilteredIncidents } from '@/store/incidentSelectors';
import type { Priority, Project, Status } from '@/store/types';
import { Icon } from '@/components/atoms/icons/Icon';
import { MapSearchNavbar } from '@/components/molecules/navigation/MapSearchNavbar';
import { MapControlGroup } from '@/components/molecules/navigation/MapControlGroup';
import { MapLegend } from '@/components/molecules/cards/MapLegend';
import { MapSkeleton } from '@/components/organisms/maps/MapSkeleton';
import { IncidentCreationModal } from '@/components/organisms/modals/IncidentCreationModal';
import { IncidentDetailModal } from '@/components/organisms/modals/IncidentDetailModal';
import type { MapViewRef } from '@/components/organisms/maps/MapView';
import styles from './map-client.module.scss';

const MapView = dynamic(
  () => import('@/components/organisms/maps/MapView').then((m) => ({ default: m.MapView })),
  { ssr: false },
);

const step1Schema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
});

export function MapClient() {
  const fetchIncidents = useIncidentStore((s) => s.fetchIncidents);
  const fetchIncidentTypes = useIncidentStore((s) => s.fetchIncidentTypes);
  const fetchUsers = useIncidentStore((s) => s.fetchUsers);
  const fetchTags = useIncidentStore((s) => s.fetchTags);
  const fetchProjects = useIncidentStore((s) => s.fetchProjects);
  const incidentTypes = useIncidentStore((s) => s.incidentTypes);
  const users = useIncidentStore((s) => s.users);
  const tags = useIncidentStore((s) => s.tags);
  const projects = useIncidentStore((s) => s.projects);
  const loading = useIncidentStore((s) => s.loading);
  const setSelected = useIncidentStore((s) => s.setSelected);
  const selectedId = useIncidentStore((s) => s.selectedId);
  const filters = useIncidentStore((s) => s.filters);
  const setFilter = useIncidentStore((s) => s.setFilter);
  const setSearch = useIncidentStore((s) => s.setSearch);
  const clearFilters = useIncidentStore((s) => s.clearFilters);
  const incidents = useFilteredIncidents();

  const creationStore = useIncidentCreationStore();
  const isOpen = useIncidentCreationStore((s) => s.isOpen);
  const step = useIncidentCreationStore((s) => s.step);
  const draft = useIncidentCreationStore((s) => s.draft);
  const assigneeIds = useIncidentCreationStore((s) => s.assigneeIds);
  const observerIds = useIncidentCreationStore((s) => s.observerIds);
  const selectedTagIds = useIncidentCreationStore((s) => s.selectedTagIds);
  const pendingTags = useIncidentCreationStore((s) => s.pendingTags);
  const pendingFiles = useIncidentCreationStore((s) => s.pendingFiles);
  const isSubmitting = useIncidentCreationStore((s) => s.isSubmitting);
  const creationErrors = useIncidentCreationStore((s) => s.errors);
  const draftId = useIncidentCreationStore((s) => s.draftId);
  const isCreatingDraft = useIncidentCreationStore((s) => s.isCreatingDraft);

  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isCreationMode, setIsCreationMode] = useState(false);
  const [detailIncidentId, setDetailIncidentId] = useState<string | null>(null);
  const mapViewRef = useRef<MapViewRef>(null);

  useEffect(() => {
    fetchIncidents();
    fetchIncidentTypes();
    fetchUsers();
    fetchTags();
    fetchProjects();
  }, [fetchIncidents, fetchIncidentTypes, fetchUsers, fetchTags, fetchProjects]);

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

  const handleProjectChange = useCallback((projectId: string) => {
    const current = filters.project;
    const next = current.includes(projectId)
      ? current.filter((p) => p !== projectId)
      : [...current, projectId];
    setFilter('project', next);
  }, [filters.project, setFilter]);

  const handleAssigneeChange = useCallback((userId: string) => {
    const current = filters.assignee;
    const next = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    setFilter('assignee', next);
  }, [filters.assignee, setFilter]);

  const handleObserverChange = useCallback((userId: string) => {
    const current = filters.observer;
    const next = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    setFilter('observer', next);
  }, [filters.observer, setFilter]);

  const handleOwnerChange = useCallback((userId: string) => {
    const current = filters.owner;
    const next = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    setFilter('owner', next);
  }, [filters.owner, setFilter]);

  const typeOptions = useMemo(() => {
    return incidentTypes.map((type) => ({ id: type.id, name: type.name }));
  }, [incidentTypes]);

  const projectOptions = useMemo(() => {
    return projects.map((project) => ({ id: project.id, name: project.name }));
  }, [projects]);

  const userOptions = useMemo(() => {
    return users.map((user) => ({ id: user.id, name: user.name }));
  }, [users]);

  const tagOptions = useMemo(() => {
    return tags.map((tag) => ({ id: tag.id, name: tag.name, color: tag.color }));
  }, [tags]);

  const legendItems = useMemo(() => {
    const high = incidents.filter((i) => i.priority === 'high').length;
    const medium = incidents.filter((i) => i.priority === 'medium').length;
    const low = incidents.filter((i) => i.priority === 'low').length;
    return [
      { variant: 'critical' as const, label: `Prioridad alta (${high})` },
      { variant: 'watchlist' as const, label: `Prioridad media (${medium})` },
      { variant: 'logged' as const, label: `Prioridad baja (${low})` },
    ];
  }, [incidents]);

  // Creation mode
  const handleCreateClick = useCallback(() => {
    setIsCreationMode(true);
  }, []);

  const handleMapClick = useCallback((coordinates: { lat: number; lng: number }) => {
    creationStore.updateDraft('coordinates', coordinates);
    creationStore.open();
    setIsCreationMode(false);
  }, [creationStore]);

  const handleCloseModal = useCallback(() => {
    if (draftId) {
      creationStore.cancelDraft();
    } else {
      creationStore.close();
      creationStore.reset();
    }
    setStepErrors({});
  }, [creationStore, draftId]);

  const handleStepChange = useCallback((nextStep: 1 | 2 | 3) => {
    if (step === 1 && nextStep === 2) {
      const result = step1Schema.safeParse({
        title: draft.title,
        description: draft.description,
        coordinates: draft.coordinates,
      });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const key = String(issue.path[0]);
          errors[key] = issue.message;
        });
        setStepErrors(errors);
        return;
      }
      setStepErrors({});
    }
    creationStore.setStep(nextStep);
  }, [step, draft, creationStore]);

  const handleSubmit = useCallback(async () => {
    setStepErrors({});
    creationStore.clearErrors();
    await creationStore.submit();
  }, [creationStore]);

  const handleCancel = useCallback(() => {
    creationStore.cancelDraft();
    setStepErrors({});
  }, [creationStore]);

  const handleProjectCreated = useCallback((project: Project) => {
    useIncidentStore.setState((state) => ({
      projects: [...state.projects, project],
    }));
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    setDetailIncidentId(id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailIncidentId(null);
  }, []);

  const detailIncident = useMemo(() => {
    if (!detailIncidentId) return null;
    return incidents.find((i) => i.id === detailIncidentId) ?? null;
  }, [detailIncidentId, incidents]);

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
        projectFilter={filters.project}
        projectOptions={projectOptions}
        onProjectChange={handleProjectChange}
        assigneeFilter={filters.assignee}
        assigneeOptions={userOptions}
        onAssigneeChange={handleAssigneeChange}
        observerFilter={filters.observer}
        observerOptions={userOptions}
        onObserverChange={handleObserverChange}
        ownerFilter={filters.owner}
        ownerOptions={userOptions}
        onOwnerChange={handleOwnerChange}
        onRecenter={handleRecenter}
        onCreateClick={handleCreateClick}
        className={styles.mapClient__navbar}
      />

      <div className={styles.mapClient__mapArea}>
        <MapView
          ref={mapViewRef}
          incidents={incidents}
          selectedId={selectedId}
          onIncidentClick={handleMarkerClick}
          isCreationMode={isCreationMode}
          onMapClick={handleMapClick}
          onViewDetails={handleViewDetails}
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
        <MapLegend title="LEYENDA" items={legendItems} />
      </div>

      {showEmptyState && (
        <div className={styles.mapClient__empty}>
          <Icon name="map" size={32} color="#9A9078" />
          <p>Ninguna incidencia coincide con los filtros actuales.</p>
          <button
            type="button"
            onClick={clearFilters}
            className={styles.mapClient__clearBtn}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <IncidentCreationModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        step={step}
        onStepChange={handleStepChange}
        draft={draft}
        onDraftChange={(field, value) => creationStore.updateDraft(field, value)}
        assigneeIds={assigneeIds}
        observerIds={observerIds}
        selectedTagIds={selectedTagIds}
        pendingTags={pendingTags}
        onToggleAssignee={(userId) => creationStore.toggleAssignee(userId)}
        onToggleObserver={(userId) => creationStore.toggleObserver(userId)}
        onToggleTag={(tagId) => creationStore.toggleTag(tagId)}
        onAddPendingTag={(name, color) => creationStore.addPendingTag(name, color)}
        onRemovePendingTag={(index) => creationStore.removePendingTag(index)}
        pendingFiles={pendingFiles}
        onFilesAdded={(files) => creationStore.addFiles(files)}
        onFileRemoved={(index) => creationStore.removeFile(index)}
        onRetryUpload={(index) => creationStore.retryUpload(index)}
        isCreatingDraft={isCreatingDraft}
        incidentTypes={typeOptions}
        projects={projectOptions}
        users={users}
        existingTags={tagOptions}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onProjectCreated={handleProjectCreated}
        isSubmitting={isSubmitting}
        errors={{ ...stepErrors, ...creationErrors }}
        draftId={draftId}
      />

      {detailIncident && (
        <IncidentDetailModal
          incident={detailIncident}
          incidentTypes={typeOptions}
          projects={projectOptions}
          users={users}
          existingTags={tagOptions}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
