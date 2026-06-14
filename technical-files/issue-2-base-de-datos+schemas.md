# Itreacion 1: base de datos + shemas 
Como sistema, quiero persistir datos en una base de datos relacional, para que la información sobreviva a reinicios del servidor.

## **API REST - Sistema de Gestión de Incidencias**

Basado estrictamente en las entidades del mock JSON: **Incidencias**, **Proyectos**, **Tipos de Incidencia**, **Usuarios** y **Tags**.

### **1. Incidencias**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/incidents` | Listar incidencias (con filtros, paginación, ordenamiento) |
| `GET` | `/incidents/{id}` | Obtener incidencia por ID |
| `POST` | `/incidents` | Crear nueva incidencia |
| `PUT` | `/incidents/{id}` | Reemplazar incidencia completa |
| `PATCH` | `/incidents/{id}` | Actualizar parcialmente (status, priority, approval, dueDate, whatsappOwner, etc.) |
| `DELETE` | `/incidents/{id}` | Soft-delete (marcar `deleted: true`) |
| `PATCH` | `/incidents/{id}/restore` | Restaurar incidencia eliminada |

---

### **2. Proyectos**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/projects` | Listar proyectos |
| `GET` | `/projects/{id}` | Obtener proyecto por ID |
| `GET` | `/projects/{id}/incidents` | Incidencias de un proyecto |
| `POST` | `/projects` | Crear proyecto |
| `PUT` | `/projects/{id}` | Reemplazar proyecto completo |
| `PATCH` | `/projects/{id}` | Actualizar nombre u otros campos |
| `DELETE` | `/projects/{id}` | Eliminar proyecto |

---

### **3. Tipos de Incidencia**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/incident-types` | Listar tipos (plumbing, structural, electrical, etc.) |
| `GET` | `/incident-types/{id}` | Obtener tipo por ID |
| `GET` | `/incident-types/{id}/incidents` | Incidencias de ese tipo |
| `POST` | `/incident-types` | Crear nuevo tipo |
| `PUT` | `/incident-types/{id}` | Reemplazar tipo completo |
| `PATCH` | `/incident-types/{id}` | Actualizar nombre, key o name_en |
| `DELETE` | `/incident-types/{id}` | Eliminar tipo |

---

### **4. Usuarios**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/users` | Listar equipo |
| `GET` | `/users/{id}` | Obtener usuario por ID |
| `GET` | `/users/{id}/incidents` | Incidencias donde participa (owner, assignee u observer) |
| `POST` | `/users` | Crear usuario |
| `PUT` | `/users/{id}` | Reemplazar usuario completo |
| `PATCH` | `/users/{id}` | Actualizar nombre, email o avatar |
| `DELETE` | `/users/{id}` | Eliminar usuario |

---

### **5. Tags**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/tags` | Listar etiquetas |
| `GET` | `/tags/{id}` | Obtener tag por ID |
| `GET` | `/tags/{id}/incidents` | Incidencias con esa etiqueta |
| `POST` | `/tags` | Crear etiqueta |
| `PUT` | `/tags/{id}` | Reemplazar etiqueta completa |
| `PATCH` | `/tags/{id}` | Actualizar nombre o color |
| `DELETE` | `/tags/{id}` | Eliminar etiqueta |

---

### **6. Sub-recursos de Incidencia**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/incidents/{id}/assignees` | Agregar asignado |
| `DELETE` | `/incidents/{id}/assignees/{userId}` | Quitar asignado |
| `POST` | `/incidents/{id}/observers` | Agregar observador |
| `DELETE` | `/incidents/{id}/observers/{userId}` | Quitar observador |
| `POST` | `/incidents/{id}/tags` | Agregar etiqueta a incidencia |
| `DELETE` | `/incidents/{id}/tags/{tagId}` | Quitar etiqueta de incidencia |
| `POST` | `/incidents/{id}/media` | Subir archivo de evidencia |
| `PATCH` | `/incidents/{id}/media/{mediaId}` | Actualizar archivo (nombre, status) |
| `DELETE` | `/incidents/{id}/media/{mediaId}` | Eliminar archivo de evidencia |

---

### **Resumen por Método HTTP**

| Método | Endpoints | Uso |
|--------|-----------|-----|
| `GET` | 14 | Consultar, listar, filtrar |
| `POST` | 9 | Crear recursos y relaciones |
| `PUT` | 5 | Reemplazo completo |
| `PATCH` | 8 | Actualización parcial, acciones (restore, media) |
| `DELETE` | 10 | Eliminación y quitar relaciones |

**Total: 46 endpoints**

---

### **Query Params para `GET /incidents`**

| Parámetro | Ejemplo | Descripción |
|-----------|---------|-------------|
| `project` | `?project=51ae14076884e5134d3afcde` | Filtrar por proyecto |
| `status` | `?status=open` | open, closed, on_pause |
| `priority` | `?priority=high` | high, medium, low |
| `type` | `?type=structural` | Por key de tipo |
| `owner` | `?owner=f38568a94102bc8cfb5ccdee` | Por ID de responsable |
| `assignee` | `?assignee=c41906bebfbda5a420d7f972` | Por ID de asignado |
| `tag` | `?tag=4bf3f690ae021229ec15f203` | Por ID de etiqueta |
| `deleted` | `?deleted=true` | Incluir eliminadas |
| `search` | `?search=fuga` | Búsqueda en título/descripción |
| `page` | `?page=1&limit=20` | Paginación |
| `sort` | `?sort=createdAt&order=desc` | Ordenamiento |

---

### **Campos Internos (gestionados vía PATCH en incidencia)**

| Campo | Ejemplo de uso |
|-------|----------------|
| `whatsappOwner` | `"whatsappOwner": "+573001234567"` |
| `coordinates` | `"coordinates": {"lat": 4.652022, "lng": -74.05772}` |
| `locationDescription` | `"locationDescription": "Nivel 5 - eje C1"` |
| `dueDate` | `"dueDate": "2026-05-20T22:05:50.768Z"` |
| `closingDate` | Se setea automático al cerrar |
| `approval` | `"approval": true` |
| `deleted` | Soft-delete / restore |

## Decisión técnica: persistencia de datos

### Contexto

Se necesitaba definir cómo estructurar la capa de base de datos dentro de una arquitectura hexagonal usando Drizzle ORM + Supabase (PostgreSQL).

### Decisiones tomadas

#### 1. `db/` vive dentro del hexágono en `src/infrastructure/db/`

**Alternativa descartada:** colocar `db/` en la raíz del proyecto como módulo independiente.

**Razón:** `schema.ts` es código propio, no una librería externa. Moverlo fuera del hexágono rompe la contención arquitectural — si cambia el motor de base de datos, el cambio debería estar contenido en `infrastructure/`. Afuera, obliga a tocar dos lugares distintos.

La conveniencia de correr `seed.ts` sin levantar el server se resuelve con un script en `package.json`, no moviendo la capa de persistencia fuera del hexágono.

#### 2. Repositorios como adaptadores de salida

Los repositorios viven en `src/infrastructure/repositories/` y son los únicos que importan de `db/schema` y `db/client`. El dominio nunca toca Drizzle directamente.

#### 3. Mappers para aislar el dominio

Los mappers traducen filas de DB (snake_case, objetos `Date`) a entidades de dominio (camelCase, strings ISO). Esto aísla el dominio de cambios en la estructura de la base de datos.

#### 4. Zod en el adaptador HTTP, no en el dominio

Zod valida datos en runtime en la frontera de entrada (`src/infrastructure/http/schemas/`). No va en el dominio porque el dominio no debe saber que existe HTTP ni ningún protocolo de transporte.

#### 5. RLS sin roles

Un solo tenant, auth por email vía Supabase Auth. La política es uniforme: usuario autenticado tiene acceso total a todas las tablas.

#### 6. Trigger de sync auth → users

Supabase gestiona autenticación en `auth.users`. Un trigger en PostgreSQL copia automáticamente cada nuevo usuario a `public.users` al momento del registro, manteniendo el perfil público sincronizado sin lógica en la aplicación.

### Estructura resultante

```
src/infrastructure/
├── db/
│   ├── schema.ts       # definición de tablas
│   ├── client.ts       # instancia Drizzle
│   └── seed.ts         # datos de prueba
├── repositories/       # adaptadores de salida
├── mappers/            # traducción DB ↔ dominio
└── http/
    └── schemas/        # validación Zod (entrada)
```