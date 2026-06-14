import {
  pgTable,
  text,
  integer,
  boolean,
  doublePrecision,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  avatarUrl: text("avatar_url"),
})

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
})

export const incidentTypes = pgTable("incident_types", {
  id: text("id").primaryKey(),
  key: text("key").unique().notNull(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
})

export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
  colorHex: text("color_hex").notNull(),
})

export const incidents = pgTable(
  "incidents",
  {
    id: text("id").primaryKey(),
    sequenceId: text("sequence_id").notNull(),
    orderId: integer("order_id").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    priority: text("priority").notNull(),
    status: text("status").notNull(),
    approval: boolean("approval").notNull().default(false),
    deleted: boolean("deleted").default(null),
    projectId: text("project_id").references(() => projects.id),
    typeId: text("type_id").references(() => incidentTypes.id),
    ownerId: text("owner_id").references(() => users.id),
    whatsappOwner: text("whatsapp_owner"),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    locationDescription: text("location_description").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    dueDate: timestamp("due_date"),
    closingDate: timestamp("closing_date"),
  },
  (table) => ({
    projectIdIdx: index("incidents_project_id_idx").on(table.projectId),
    statusIdx: index("incidents_status_idx").on(table.status),
    latitudeIdx: index("incidents_latitude_idx").on(table.latitude),
    longitudeIdx: index("incidents_longitude_idx").on(table.longitude),
  })
)

export const media = pgTable("media", {
  id: text("id").primaryKey(),
  incidentId: text("incident_id").references(() => incidents.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  format: text("format").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  status: text("status").notNull().default("uploaded"),
  url: text("url").notNull(),
})

export const incidentAssignees = pgTable(
  "incident_assignees",
  {
    incidentId: text("incident_id").references(() => incidents.id),
    userId: text("user_id").references(() => users.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.incidentId, table.userId] }),
  })
)

export const incidentObservers = pgTable(
  "incident_observers",
  {
    incidentId: text("incident_id").references(() => incidents.id),
    userId: text("user_id").references(() => users.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.incidentId, table.userId] }),
  })
)

export const incidentTagsMapping = pgTable(
  "incident_tags_mapping",
  {
    incidentId: text("incident_id").references(() => incidents.id),
    tagId: text("tag_id").references(() => tags.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.incidentId, table.tagId] }),
  })
)

// Relations

export const usersRelations = relations(users, ({ many }) => ({
  ownedIncidents: many(incidents),
  incidentAssignees: many(incidentAssignees),
  incidentObservers: many(incidentObservers),
}))

export const projectsRelations = relations(projects, ({ many }) => ({
  incidents: many(incidents),
}))

export const incidentTypesRelations = relations(incidentTypes, ({ many }) => ({
  incidents: many(incidents),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  incidentTagsMapping: many(incidentTagsMapping),
}))

export const incidentsRelations = relations(incidents, ({ one, many }) => ({
  owner: one(users, { fields: [incidents.ownerId], references: [users.id] }),
  project: one(projects, { fields: [incidents.projectId], references: [projects.id] }),
  type: one(incidentTypes, { fields: [incidents.typeId], references: [incidentTypes.id] }),
  media: many(media),
  assignees: many(incidentAssignees),
  observers: many(incidentObservers),
  tagsMapping: many(incidentTagsMapping),
}))

export const mediaRelations = relations(media, ({ one }) => ({
  incident: one(incidents, { fields: [media.incidentId], references: [incidents.id] }),
}))

export const incidentAssigneesRelations = relations(incidentAssignees, ({ one }) => ({
  incident: one(incidents, { fields: [incidentAssignees.incidentId], references: [incidents.id] }),
  user: one(users, { fields: [incidentAssignees.userId], references: [users.id] }),
}))

export const incidentObserversRelations = relations(incidentObservers, ({ one }) => ({
  incident: one(incidents, { fields: [incidentObservers.incidentId], references: [incidents.id] }),
  user: one(users, { fields: [incidentObservers.userId], references: [users.id] }),
}))

export const incidentTagsMappingRelations = relations(incidentTagsMapping, ({ one }) => ({
  incident: one(incidents, { fields: [incidentTagsMapping.incidentId], references: [incidents.id] }),
  tag: one(tags, { fields: [incidentTagsMapping.tagId], references: [tags.id] }),
}))
