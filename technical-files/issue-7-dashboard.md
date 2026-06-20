# Iteración 6: Dashboard y gestión

Como supervisor de obra, quiero un dashboard visual con métricas clave (estado, calidad/riesgo, tendencias y carga personal) para tomar decisiones sin revisar incidencias una por una.

---

## Resumen de cambios

- **Infraestructura analítica:** nuevo puerto `IncidentAnalyticsRepository` con implementación Drizzle que ejecuta consultas agregadas (COUNT, AVG, GROUP BY, CASE WHEN) directamente sobre PostgreSQL — sin capa de caché intermedia.
- **API:** único endpoint `GET /api/dashboard?projectId=X` que devuelve un JSON con 4 secciones tipadas (`DashboardDto`), validado con Zod.
- **Frontend:** 4 secciones visuales dentro de `DashboardLayout`:
  - **Estado General:** barras por status/prioridad, matriz prioridad×estado, métricas de vencidos.
  - **Riesgo/Calidad:** tiempo de resolución promedio, % aprobación por tipo, % vencidos por tipo, comparación por proyecto.
  - **Tendencia:** línea mensual de incidentes, top tags (barras), tags×prioridad.
  - **Personal:** tablas de carga por responsable/asignado, promedio de asignados por prioridad.
- **Sidebar:** se hizo `position: sticky; top: 0` para que el menú lateral acompañe el scroll en páginas largas (como el dashboard).
- **Mapa:** ajuste de zoom de capas heatmap (17→18) y círculos (11→15) para mejor visualización en escritorio.

---

## Decisiones de diseño

### 1. Endpoint único de dashboard vs. múltiples endpoints específicos

**Elegido:** un solo `GET /dashboard` que devuelve el agregado completo.

**Alternativa descartada:** 15 endpoints individuales (uno por métrica: `/status-breakdown`, `/approval-rate`, `/owner-workload`, etc.).

**Razón:** el dashboard se renderiza como una unidad — si una métrica falla, todo el dashboard se considera no disponible y se muestra el estado de error. Esto evita carga parcial inconsistente y simplifica el manejo de estados (loading/error/data) en el frontend. Además, el dashboard se consulta con poca frecuencia (al cargar la página o al cambiar de proyecto), no hay necesidad de granularidad. Si en el futuro alguna métrica es crítica y requiere disponibilidad independiente, se puede dividir sin romper el contrato actual.

### 2. Recharts vs. otras librerías de gráficos

**Elegido:** Recharts.

**Alternativas descartadas:**
- **Chart.js (react-chartjs-2):** buena performance con datasets grandes, pero API imperativa (canvas) y personalización limitada con CSS Modules.
- **Nivo:** muy completo, pero bundle pesado (~80 KB gzip) y curva de aprendizaje alta.
- **D3.js:** máximo control, pero demasiado verboso para gráficos simples de barras y líneas; no es declarativo.

**Razón:** Recharts es declarativo (componentes React puros: `<BarChart>`, `<YAxis>`, `<Tooltip>`), se integra nativamente con el sistema de props del ecosistema React, pesa ~35 KB gzip, y permite estilizar ejes/tooltips inline sin depender de un theme global.

### 3. Una sola query SQL por sección vs. varias queries atómicas

**Elegido:** consultas SQL independientes dentro de cada método del repositorio (una para status, otra para priority, otra para overdue, etc.), todas ejecutadas secuencialmente en el caso de uso `GetDashboardUseCase`.

**Alternativa descartada:** una sola query monolítica con múltiples CTEs y subqueries que devuelva todo el payload en una llamada.

**Razón:** aunque una query grande sería más eficiente en latencia de red, las queries individuales son más legibles, mantenibles y testeables. Cada método del repositorio tiene una responsabilidad única y puede optimizarse de forma independiente. La penalización en round-trips es mínima porque PostgreSQL está en la misma región y las queries son livianas (sub-segundo).

### 4. Filtro por proyecto en el endpoint vs. post-filtro en cliente

**Elegido:** el proyecto se pasa como query param `?projectId=...` y las consultas SQL filtran directamente en la base de datos.

**Alternativa descartada:** cargar todos los proyectos en el frontend y filtrar las métricas en cliente con JavaScript.

**Razón:** las métricas involucran agregaciones (COUNT, AVG, SUM) que PostgreSQL resuelve eficientemente. Traer todos los datos sin filtrar para agregar en cliente sería costoso en ancho de banda y memoria, especialmente a medida que crece el volumen de incidencias. El filtro en la BD además permite índices y caching de query planner.

---

## Estructura resultante

```
src/
├── domain/ports/
│   └── incident-analytics.repository.ts
├── application/
│   ├── dto/
│   │   └── dashboard.dto.ts
│   └── use-cases/dashboard/
│       ├── get-status-breakdown.use-case.ts
│       ├── get-priority-breakdown.use-case.ts
│       ├── get-priority-x-status.use-case.ts
│       ├── get-overdue-rate.use-case.ts
│       ├── get-overdue-severity-days.use-case.ts
│       ├── get-resolution-time.use-case.ts
│       ├── get-approval-rate-by-type.use-case.ts
│       ├── get-overdue-rate-by-type.use-case.ts
│       ├── get-project-comparison.use-case.ts
│       ├── get-monthly-trend.use-case.ts
│       ├── get-top-tags.use-case.ts
│       ├── get-tags-x-priority.use-case.ts
│       ├── get-owner-workload.use-case.ts
│       ├── get-assignee-workload.use-case.ts
│       └── get-avg-assignees-by-priority.use-case.ts
├── infrastructure/
│   ├── repositories/
│   │   └── drizzle-incident-analytics.repository.ts
│   └── http/
│       ├── controllers/
│       │   └── dashboard.controller.ts
│       └── schemas/
│           └── dashboard-query.schema.ts
├── services/
│   └── dashboard.api.ts
├── hooks/
│   └── useDashboard.ts
└── app/(protected)/dashboard/
    ├── page.tsx
    ├── components/
    │   ├── DashboardLayout.tsx
    │   ├── ProjectFilter.tsx
    │   ├── IncidentMap.tsx
    │   ├── SkeletonLoader.tsx
    │   ├── MetricCard.tsx
    │   ├── EstadoGeneralSection.tsx
    │   ├── RiesgoCalidadSection.tsx
    │   ├── TendenciaSection.tsx
    │   └── PersonalSection.tsx
    └── lib/
        └── i18n.ts
```

---

## Retos técnicos y soluciones

### Bug 1: Etiquetas del eje Y omitidas en gráficos verticales

**Problema:** Recharts omite automáticamente etiquetas del eje Y en `BarChart` con `layout="vertical"` cuando detecta poco espacio, mostrando solo texto en algunas barras.

**Solución:** añadir `interval={0}` al `<YAxis>` para forzar renderizado de todas las etiquetas. Ajustar `width` del eje para evitar truncamiento.

---

## Lo que queda

- **Responsive:** el dashboard está optimizado para escritorio (grid 2 columnas). En móvil las secciones se apilan pero no se probó exhaustivamente.
- **Caché:** las consultas se ejecutan cada vez que se carga la página o cambia de proyecto. No hay capa de caché (SWR, React Query o Redis).
- **Exportación:** no hay botón para exportar gráficos a imagen o descargar datos como CSV.
