# Spybee

Sistema de gestión de incidencias para proyectos de construcción con mapas interactivos.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 |
| Estado | Zustand |
| API | Hono |
| Base de datos | PostgreSQL + Drizzle ORM (vía Supabase) |
| Mapas | Mapbox GL JS |
| Validación | Zod |
| UI Components | Storybook (local) |
| Estilos | SASS + Tailwind |

## Requisitos

- Node.js >= 18
- pnpm

## Instalación

```bash
pnpm install
```

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase (auth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `DATABASE_URL` | Connection string de PostgreSQL |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token de Mapbox |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm preview` | Vista previa del build |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Genera migraciones Drizzle |
| `pnpm db:migrate` | Aplica migraciones |
| `pnpm db:seed` | Pobla la base de datos con datos de prueba |
| `pnpm db:studio` | Abre Drizzle Studio |

## Estructura del proyecto

```
spybee/
├── data/                          # Datos de prueba (mock JSON)
├── technical-files/               # Documentación técnica
├── drizzle.config.ts              # Configuración Drizzle Kit
├── src/
│   ├── app/                       # Next.js App Router
│   ├── infrastructure/
│   │   ├── db/                    # Schema, client, seed
│   │   ├── repositories/          # Repositorios (futuro)
│   │   ├── mappers/               # Mappers DB → Dominio (futuro)
│   │   └── http/                  # Endpoints Hono (futuro)
│   ├── application/
│   │   └── use-cases/             # Casos de uso (futuro)
│   └── domain/
│       ├── entities/              # Entidades de dominio (futuro)
│       └── ports/                 # Puertos / interfaces (futuro)
└── ...
```

## Iteraciones

- **#1** ✅ Environment setup
- **#2** ✅ Base de datos + Schemas