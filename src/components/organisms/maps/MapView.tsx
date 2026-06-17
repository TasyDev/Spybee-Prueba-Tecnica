'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Incident } from '@/store/types';
import { IncidentHoverCard } from '@/components/molecules/cards/IncidentHoverCard';
import { IncidentDetailPopup } from '@/components/molecules/cards/IncidentDetailPopup';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

function incidentsToGeoJSON(incidents: Incident[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: incidents
      .filter((i) => i.coordinates?.lat && i.coordinates?.lng)
      .map((i) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [i.coordinates.lng, i.coordinates.lat],
        },
        properties: {
          id: i.id,
          title: i.title,
          priority: i.priority,
          status: i.status,
          locationDescription: i.locationDescription,
          createdAt: i.createdAt,
        },
      })),
  };
}

function getIncidentBounds(incidents: Incident[]): mapboxgl.LngLatBoundsLike | null {
  const withCoords = incidents.filter((i) => i.coordinates?.lat && i.coordinates?.lng);
  if (withCoords.length === 0) return null;

  const bounds = new mapboxgl.LngLatBounds();
  withCoords.forEach((i) => bounds.extend([i.coordinates.lng, i.coordinates.lat]));
  return bounds;
}

export interface MapViewRef {
  zoomIn: () => void;
  zoomOut: () => void;
  fitBounds: () => void;
}

export interface MapViewProps {
  incidents: Incident[];
  selectedId?: string | null;
  onIncidentClick?: (id: string | null) => void;
  className?: string;
}

const tokenErrorStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  color: '#EBE1D1',
  fontSize: 14,
  fontFamily: 'monospace',
  textAlign: 'center',
  padding: 24,
};

export const MapView = forwardRef<MapViewRef, MapViewProps>(
  function MapView({ incidents, selectedId, onIncidentClick, className }: MapViewProps, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const incidentsRef = useRef(incidents);
    const initializedRef = useRef(false);
    const [tokenError, setTokenError] = useState(false);

    const [hoverIncident, setHoverIncident] = useState<Incident | null>(null);
    const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
    const [detailIncident, setDetailIncident] = useState<Incident | null>(null);
    const [detailPos, setDetailPos] = useState<{ x: number; y: number } | null>(null);

    incidentsRef.current = incidents;

    const fitBounds = useCallback(() => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) return;

      const bounds = getIncidentBounds(incidents);
      if (bounds) {
        map.fitBounds(bounds, { padding: 80, maxZoom: 16, duration: 900 });
      }
    }, [incidents]);

    useImperativeHandle(ref, () => ({
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),
      fitBounds,
    }));

    useEffect(() => {
      function handleDocClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target.closest('.incident-detail-popup')) {
          setDetailIncident(null);
          setDetailPos(null);
          onIncidentClick?.(null);
        }
      }
      if (detailIncident) {
        document.addEventListener('mousedown', handleDocClick);
      }
      return () => document.removeEventListener('mousedown', handleDocClick);
    }, [detailIncident, onIncidentClick]);

    useEffect(() => {
      if (detailIncident && !incidents.find((i) => i.id === detailIncident.id)) {
        setDetailIncident(null);
        setDetailPos(null);
        onIncidentClick?.(null);
      }
    }, [incidents, detailIncident, onIncidentClick]);

    useEffect(() => {
      if (!containerRef.current || initializedRef.current) return;

      if (!MAPBOX_TOKEN) {
        setTokenError(true);
        return;
      }

      if (MAPBOX_TOKEN.startsWith('sk.')) {
        console.error(
          'Mapbox secret token (sk.*) detected. Use a public token (pk.*) from https://account.mapbox.com/access-tokens/',
        );
        setTokenError(true);
        return;
      }

      initializedRef.current = true;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: [-74.057, 4.651],
        zoom: 13,
      });

      function findIncidentById(id: string): Incident | undefined {
        return incidentsRef.current.find((i) => i.id === id);
      }

      map.on('load', () => {
        const currentIncidents = incidentsRef.current;

        map.addSource('incidents', {
          type: 'geojson',
          data: incidentsToGeoJSON(currentIncidents),
        });

        map.addLayer({
          id: 'incidents-heat',
          type: 'heatmap',
          source: 'incidents',
          maxzoom: 17,
          paint: {
            'heatmap-weight': ['match', ['get', 'priority'], 'high', 1, 'medium', 0.6, 0.3],
            'heatmap-intensity': 1,
            'heatmap-radius': 25,
            'heatmap-opacity': 0.7,
          },
        });

        map.addLayer({
          id: 'incidents-circle',
          type: 'circle',
          source: 'incidents',
          minzoom: 11,
          paint: {
            'circle-radius': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              ['match', ['get', 'priority'], 'high', 18, 'medium', 15, 12],
              ['match', ['get', 'priority'], 'high', 12, 'medium', 10, 8],
            ],
            'circle-color': ['match', ['get', 'priority'], 'high', '#EF4444', 'medium', '#F59E0B', '#6B7280'],
            'circle-stroke-width': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              4,
              2,
            ],
            'circle-stroke-color': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              '#FFE5A0',
              '#ffffff',
            ],
            'circle-opacity': 0.9,
          },
        });

        map.on('click', 'incidents-circle', (e) => {
          const id = e.features?.[0]?.properties?.id as string | undefined;
          if (!id) return;
          const incident = findIncidentById(id);
          if (!incident) return;

          const point = map.project([incident.coordinates.lng, incident.coordinates.lat]);
          setDetailIncident(incident);
          setDetailPos({ x: point.x, y: point.y });
          setHoverIncident(null);
          onIncidentClick?.(id);
        });

        map.on('mouseenter', 'incidents-circle', (e) => {
          const id = e.features?.[0]?.properties?.id as string | undefined;
          if (!id) return;
          const incident = findIncidentById(id);
          if (!incident) return;

          map.getCanvas().style.cursor = 'pointer';
          setHoverIncident(incident);
          setHoverPos({ x: e.point.x, y: e.point.y });
        });

        map.on('mousemove', 'incidents-circle', (e) => {
          setHoverPos({ x: e.point.x, y: e.point.y });
        });

        map.on('mouseleave', 'incidents-circle', () => {
          map.getCanvas().style.cursor = '';
          setHoverIncident(null);
          setHoverPos(null);
        });

        if (currentIncidents.length > 0) {
          const bounds = getIncidentBounds(currentIncidents);
          if (bounds) {
            map.fitBounds(bounds, { padding: 80, maxZoom: 16, duration: 900 });
          }
        }
      });

      mapRef.current = map;

      return () => {
        map.remove();
        initializedRef.current = false;
      };
    }, [onIncidentClick]);

    useEffect(() => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) return;

      const source = map.getSource('incidents') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(incidentsToGeoJSON(incidents));
      }
    }, [incidents]);

    useEffect(() => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) return;

      const features = map.querySourceFeatures('incidents');
      features.forEach((feature) => {
        const id = feature.properties?.id as string | undefined;
        if (!id) return;
        map.setFeatureState(
          { source: 'incidents', id },
          { selected: id === selectedId },
        );
      });
    }, [selectedId]);

    if (tokenError) {
      return (
        <div style={tokenErrorStyle}>
          Mapbox token no válido. Usa un token público (pk.*) en NEXT_PUBLIC_MAPBOX_TOKEN.
        </div>
      );
    }

    return (
      <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
        {hoverIncident && !detailIncident && hoverPos && (
          <div
            style={{
              position: 'absolute',
              left: hoverPos.x + 16,
              top: hoverPos.y - 16,
              zIndex: 300,
              pointerEvents: 'none',
            }}
          >
            <IncidentHoverCard incident={hoverIncident} />
          </div>
        )}
        {detailIncident && detailPos && (
          <div
            className="incident-detail-popup"
            style={{
              position: 'absolute',
              left: Math.min(detailPos.x + 16, (containerRef.current?.clientWidth ?? 800) - 340),
              top: Math.min(detailPos.y - 16, (containerRef.current?.clientHeight ?? 600) - 420),
              zIndex: 400,
            }}
          >
            <IncidentDetailPopup
              incident={detailIncident}
              onClose={() => {
                setDetailIncident(null);
                setDetailPos(null);
                onIncidentClick?.(null);
              }}
            />
          </div>
        )}
      </div>
    );
  },
);
