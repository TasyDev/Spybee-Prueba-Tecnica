# Issue #1 — Environment Setup

## Requerimiento

El entorno de desarrollo y producción debe estar operativo y desplegado, permitiendo al equipo iniciar la construcción de funcionalidades sobre una base estable y reproducible.

## Diseño

### Stack y herramientas

| Herramienta | Categoría | Justificación |
|---|---|---|
| Next.js | Framework | Obligatorio por la prueba técnica |
| SASS | Estilos | Obligatorio por la prueba técnica |
| Mapbox | Mapas | Obligatorio por la prueba técnica |
| Zustand | Estado global | Obligatorio por la prueba técnica |
| Drizzle ORM | Acceso a datos | Tipado y consistencia en capa de datos |
| Hono | Backend | Corre dentro de Next.js para compatibilidad con Vercel |
| Storybook | UI | Aislamiento y validación visual de componentes — solo local, sin build ni deploy |
| Zod | Validación | Integridad de datos en entrada y salida |

### Configuración general

- **Gestor de paquetes:** `pnpm` — Razón: Es más rápido
- **Scripts en `package.json`:** `dev`, `build`, `preview`
- **Paths absolutos:** alias `@/` apuntando a `src/` — configurado en `tsconfig.json`

### Variables de entorno

- `.env.local` — local, ignorado en git
- `.env.example` — documentado en repo con keys vacías: Supabase URL, Supabase anon key, Mapbox token

### Estructura de carpetas

Scaffold default de Next.js con App Router bajo `src/app/`

### Deploy

- Plataforma: Vercel conectado al repo de GitHub
- Sin `vercel.json` — usa preset automático de Next.js
- Build command: `next build` únicamente
- Storybook excluido del build de Vercel — no se instala ni ejecuta en CI

### `.gitignore`

- Incluye `storybook-static/` — output de build de Storybook ignorado
- Archivos de configuración de Storybook (`.storybook/`) permanecen en el repo

### Estrategia de ramas

- `main` — producción
- `develop` — integración pre-producción
- Sin push directo a ninguna rama — todo por Pull Request
- `main` solo recibe PR desde `develop`
- `develop` solo recibe PR desde ramas de trabajo
- Convención de ramas: `tipo/nombre-del-feature-#numero`

### CI/CD

- Merge a `main` dispara deploy de producción en Vercel
- Merge a `develop` dispara preview de integración en Vercel

### Desarrollo asistido con IA

- Herramienta: `autoskills` instalada vía `npx autoskills`
- Actualiza el `README.md` con lo que se hizo en este build
- Crea un nuevo archivo en technical-files relacionado al issue #2 llamado: `issue-2-db-relations-and-api-contracts.md`
