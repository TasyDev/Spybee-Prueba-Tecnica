# Iteración 4: Ver incidencias en mapa

Como supervisor de obra, quiero visualizar las incidencias sobre un mapa interactivo para entender su distribución geográfica y filtrar por prioridad, estado y tipo.

---

## Resumen de cambios

- **Store:** se agregaron `Filters.search`, `fetchIncidentTypes`, `incidentTypes[]` y `setSearch` a `useIncidentStore`. El selector `useFilteredIncidents` ahora soporta búsqueda textual sobre título, descripción y ubicación.
- **API de tipos:** nuevo `incidentTypeApi` que obtiene `GET /incident-types` y se carga en `MapClient` al montar la página.
- **Filtros:** se reemplazaron los chips desordenados por tres `FilterDropdown` compactos (Prioridad, Estado, Tipo) en `MapSearchNavbar`. `BottomFilterBar` se simplificó a solo prioridades.
- **Mapa interactivo (`MapView`):** mapa Mapbox con capa de heatmap y círculos por prioridad, poblado desde el store via GeoJSON source. Hover muestra `IncidentHoverCard` siguiendo el cursor; click abre `IncidentDetailPopup` con toda la información de la incidencia.
- **UI components nuevos:** `FilterDropdown`, `IncidentHoverCard`, `IncidentDetailPopup`, iconos search/x/crosshair.
- **Corrección de bugs:** datos que llegaban antes que el estilo del mapa, categorías vacías, popup que dejaba de funcionar al filtrar, "spinner de loading" al cambiar filtros.
- **Empty state:** overlay informativo cuando ningún incidente coincide con los filtros activos.

---

## Decisiones de diseño

### 1. Filtros en cliente, no en servidor

Los incidentes se cargan una sola vez desde el store y los filtros (prioridad, estado, tipo, búsqueda) operan completamente en cliente mediante `useFilteredIncidents`.

**Alternativa descartada:** enviar cada cambio de filtro como query param a la API.

**Razón:** para un conjunto de datos que cabe en memoria (~cientos de incidencias), filtrar en cliente es instantáneo y evita latencia de red, spinners y complejidad de paginación. La API está disponible para cuando el volumen crezca, pero la experiencia de filtrado inmediato pesa más en una SPA.

### 2. Dropdowns compactos en vez de chips

Los filtros de prioridad, estado y tipo viven en dropdowns con checkboxes, badge contador y botón de limpiar. El `BottomFilterBar` solo muestra prioridades con resaltado visual.

**Alternativa descartada:** chips expandidos en fila horizontal (estilo original).

**Razón:** con ~15 tipos de incidencia, los chips se desbordaban visualmente. Los dropdowns compactos ocupan menos espacio vertical, se agrupan lógicamente y permiten selección múltiple sin saturar la interfaz.

### 3. Popup React en vez de popup de Mapbox

`IncidentDetailPopup` es un componente React posicionado sobre el mapa mediante `map.project()`, en lugar del `Popup` nativo de Mapbox GL.

**Razón:** el popup de Mapbox tiene limitaciones de estilo (no acepta componentes React arbitrarios si se quiere usar el design system del proyecto). Un componente React posicionado manualmente permite usar tokens SCSS, animaciones, y lógica de estado compleja (counts de assignees, fechas) sin workarounds.

### 4. Re-center solo en botón explícito

`fitBounds` se ejecuta únicamente dentro de `map.on('load')` (carga inicial) y al presionar "Recenter". No se dispara cuando cambian los filtros.

**Alternativa descartada:** re-center cada vez que `incidents` cambia.

**Razón:** re-centrar automáticamente al cambiar filtros provocaba un "spinner/loading" percibido (el mapa se movía, se veía vacío un instante, luego se reposicionaba). El usuario pierde contexto visual. Con el botón "Recenter", el usuario decide cuándo volver a encuadrar.

---

## Retos técnicos y soluciones

### Bug 1: Source GeoJSON vacío al cargar

**Problema:** los incidentes se cargaban antes de que Mapbox terminara de cargar el estilo. Al intentar `map.addSource('incidents', { data: geojson })`, el source se inicializaba vacío y los marcadores no aparecían.

**Solución:** toda la configuración de sources y layers se movió dentro de `map.on('load')`. Además, se usa una ref (`incidentsRef`) para que el callback de `load` siempre tenga acceso a los datos actuales, incluso si el evento se dispara después de varios renders:

```ts
const incidentsRef = useRef(incidents);
incidentsRef.current = incidents;

map.on('load', () => {
  const src = map.getSource('incidents') as GeoJSONSource;
  if (!src) {
    map.addSource('incidents', { type: 'geojson', data: buildGeoJSON(incidentsRef.current) });
    // ... layers
  } else {
    src.setData(buildGeoJSON(incidentsRef.current));
  }
});
```

### Bug 2: Categorías vacías en filtro de tipo

**Problema:** la API devolvía `type: { id: string }` sin `name`. El dropdown de tipos mostraba "Sin tipo" o items sin label.

**Solución:** se creó un endpoint separado `GET /incident-types` y se cargó en el store al montar `MapClient`. Los nombres se mapean por `id`:

```ts
// store
incidentTypes: await incidentTypeApi.getAll(),
// selector
typeName: incidentTypes.find(t => t.id === inc.type?.id)?.name ?? 'Desconocido'
```

### Bug 3: Click dejaba de funcionar después de filtrar

**Problema:** el popup de detalle se controlaba con un `useEffect` que escuchaba cambios en `selectedId`. Al cambiar filtros, el array `incidents` se recomputaba, el efecto se re-ejecutaba y cerraba el popup.

**Solución:** se movió el estado del popup a `MapView` con `useState` local, desacoplándolo del store:

```ts
const [popupIncident, setPopupIncident] = useState<Incident | null>(null);

// al hacer click:
if (feature) setPopupIncident(feature.properties as Incident);

// al cerrar:
setPopupIncident(null);

// efecto que limpia si el incidente sale del filtro:
useEffect(() => {
  if (popupIncident && !incidents.find(i => i.id === popupIncident.id)) {
    setPopupIncident(null);
  }
}, [incidents, popupIncident]);
```

El popup se mantiene abierto incluso si el usuario cambia filtros, a menos que el incidente seleccionado desaparezca del conjunto visible.

### Bug 4: Re-center automático causaba "spinner"

**Problema:** el efecto `useEffect(() => { fitBounds(...) }, [incidents])` movía el mapa cada vez que cambiaban los filtros, y durante el movimiento el área visible quedaba vacía por un instante.

**Solución:** se eliminó el `fitBounds` del efecto y se expuso como función pública via `ref`:

```ts
// en MapView:
useImperativeHandle(ref, () => ({ fitBounds: () => { ... } }));

// desde MapClient:
ref.current?.fitBounds();
```

Esto además da control explícito al usuario mediante el botón "Recenter".

---

## Estructura resultante

```
src/
├── store/
│   ├── types.ts               # Filters.search, IncidentType
│   ├── incidentStore.ts       # fetchIncidentTypes, setSearch
│   └── incidentSelectors.ts   # useFilteredIncidents con búsqueda
├── services/
│   └── incidentTypeApi.ts     # GET /incident-types
├── components/
│   ├── molecules/
│   │   ├── navigation/
│   │   │   ├── FilterDropdown.tsx
│   │   │   ├── MapSearchNavbar.tsx
│   │   │   ├── BottomFilterBar.tsx
│   │   │   └── *.module.scss
│   │   └── cards/
│   │       ├── IncidentHoverCard.tsx
│   │       ├── IncidentDetailPopup.tsx
│   │       └── *.module.scss
│   └── organisms/
│       ├── maps/
│       │   ├── MapView.tsx
│       │   └── *.module.scss
│       └── navigation/
│           ├── MapDashboard.tsx
│           └── *.module.scss
└── app/(protected)/map/
    ├── MapClient.tsx
    ├── map-client.module.scss
    └── page.tsx
```

## Lo que queda

- **Color de marcadores:** decidir si el círculo en el mapa refleja prioridad, estado o ambos (actualmente usa prioridad). Pendiente de resolución con el usuario.
- **Responsive:** hover/click en dispositivos táctiles no está verificado.
