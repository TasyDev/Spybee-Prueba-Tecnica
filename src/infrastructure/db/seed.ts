import "dotenv/config"
import { getDb } from "./client"
import {
  users,
  projects,
  incidentTypes,
  tags,
  incidents,
  media,
  incidentAssignees,
  incidentObservers,
  incidentTagsMapping,
} from "./schema"
import mockData from "@root/data/incidents.mock.json"

async function seed() {
  const db = getDb()
  console.log("🌱 Starting seed...")

  // Extract unique entities from mock data
  const uniqueUsers = new Map()
  const uniqueProjects = new Map()
  const uniqueTypes = new Map()
  const uniqueTags = new Map()

  for (const item of mockData) {
    // Users: owner
    if (item.owner && !uniqueUsers.has(item.owner.id)) {
      uniqueUsers.set(item.owner.id, item.owner)
    }
    // Users: assignees
    for (const assignee of item.assignees || []) {
      if (!uniqueUsers.has(assignee.id)) {
        uniqueUsers.set(assignee.id, assignee)
      }
    }
    // Users: observers
    for (const observer of item.observers || []) {
      if (!uniqueUsers.has(observer.id)) {
        uniqueUsers.set(observer.id, observer)
      }
    }

    // Projects
    if (item.project && !uniqueProjects.has(item.project.id)) {
      uniqueProjects.set(item.project.id, item.project)
    }

    // Incident types
    if (item.type && !uniqueTypes.has(item.type.id)) {
      uniqueTypes.set(item.type.id, item.type)
    }

    // Tags
    for (const tag of item.tags || []) {
      if (!uniqueTags.has(tag.id)) {
        uniqueTags.set(tag.id, tag)
      }
    }
  }

  // Insert users
  if (uniqueUsers.size > 0) {
    const usersData = Array.from(uniqueUsers.values()).map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
    }))
    await db.insert(users).values(usersData).onConflictDoNothing()
    console.log(`✅ Inserted ${usersData.length} users`)
  }

  // Insert projects
  if (uniqueProjects.size > 0) {
    const projectsData = Array.from(uniqueProjects.values()).map((p: any) => ({
      id: p.id,
      name: p.name,
    }))
    await db.insert(projects).values(projectsData).onConflictDoNothing()
    console.log(`✅ Inserted ${projectsData.length} projects`)
  }

  // Insert incident types
  if (uniqueTypes.size > 0) {
    const typesData = Array.from(uniqueTypes.values()).map((t: any) => ({
      id: t.id,
      key: t.key,
      nameEs: t.name,
      nameEn: t.name_en,
    }))
    await db.insert(incidentTypes).values(typesData).onConflictDoNothing()
    console.log(`✅ Inserted ${typesData.length} incident types`)
  }

  // Insert tags
  if (uniqueTags.size > 0) {
    const tagsData = Array.from(uniqueTags.values()).map((t: any) => ({
      id: t.id,
      name: t.name,
      colorHex: t.color,
    }))
    await db.insert(tags).values(tagsData).onConflictDoNothing()
    console.log(`✅ Inserted ${tagsData.length} tags`)
  }

  // Insert incidents
  const incidentsData = mockData.map((item: any) => ({
    id: item.id,
    sequenceId: item.sequenceId,
    orderId: item.order,
    title: item.title,
    description: item.description,
    priority: item.priority,
    status: item.status,
    approval: item.approval,
    deleted: item.deleted,
    projectId: item.project?.id || null,
    typeId: item.type?.id || null,
    ownerId: item.owner?.id || null,
    whatsappOwner: item.whatsappOwner,
    latitude: item.coordinates?.lat,
    longitude: item.coordinates?.lng,
    locationDescription: item.locationDescription,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    dueDate: item.dueDate ? new Date(item.dueDate) : null,
    closingDate: item.closingDate ? new Date(item.closingDate) : null,
  }))

  await db.insert(incidents).values(incidentsData).onConflictDoNothing()
  console.log(`✅ Inserted ${incidentsData.length} incidents`)

  // Insert media
  const mediaData: any[] = []
  for (const item of mockData) {
    for (const m of item.media || []) {
      mediaData.push({
        id: m.id,
        incidentId: item.id,
        name: m.name,
        type: m.type,
        format: m.format,
        sizeBytes: m.size,
        status: m.status,
        url: m.url,
      })
    }
  }

  if (mediaData.length > 0) {
    await db.insert(media).values(mediaData).onConflictDoNothing()
    console.log(`✅ Inserted ${mediaData.length} media items`)
  }

  // Insert incident assignees
  const assigneesData: any[] = []
  for (const item of mockData) {
    for (const assignee of item.assignees || []) {
      assigneesData.push({
        incidentId: item.id,
        userId: assignee.id,
      })
    }
  }

  if (assigneesData.length > 0) {
    await db.insert(incidentAssignees).values(assigneesData).onConflictDoNothing()
    console.log(`✅ Inserted ${assigneesData.length} incident assignees`)
  }

  // Insert incident observers
  const observersData: any[] = []
  for (const item of mockData) {
    for (const observer of item.observers || []) {
      observersData.push({
        incidentId: item.id,
        userId: observer.id,
      })
    }
  }

  if (observersData.length > 0) {
    await db.insert(incidentObservers).values(observersData).onConflictDoNothing()
    console.log(`✅ Inserted ${observersData.length} incident observers`)
  }

  // Insert incident tags mapping
  const tagsMappingData: any[] = []
  for (const item of mockData) {
    for (const tag of item.tags || []) {
      tagsMappingData.push({
        incidentId: item.id,
        tagId: tag.id,
      })
    }
  }

  if (tagsMappingData.length > 0) {
    await db.insert(incidentTagsMapping).values(tagsMappingData).onConflictDoNothing()
    console.log(`✅ Inserted ${tagsMappingData.length} incident tags mappings`)
  }

  console.log("🎉 Seed completed successfully!")
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
