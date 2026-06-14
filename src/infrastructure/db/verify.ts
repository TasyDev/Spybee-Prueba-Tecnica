import { db } from "./client"
import * as schema from "./schema"

async function verify() {
  console.log("🔍 Verificando base de datos...\n")

  const tables: [string, any][] = [
    ["users", schema.users],
    ["projects", schema.projects],
    ["incident_types", schema.incidentTypes],
    ["tags", schema.tags],
    ["incidents", schema.incidents],
    ["media", schema.media],
    ["incident_assignees", schema.incidentAssignees],
    ["incident_observers", schema.incidentObservers],
    ["incident_tags_mapping", schema.incidentTagsMapping],
  ]

  let total = 0

  for (const [name, table] of tables) {
    const count = await db.$count(table)
    total += count
    const status = count > 0 ? "✅" : "⚠️"
    console.log(`  ${status} ${name}: ${count} registros`)
  }

  console.log(`\n📊 Total: ${total} registros en ${tables.length} tablas\n`)

  // Verificar relaciones
  const sample = await db.query.incidents.findFirst({
    columns: { id: true, title: true, status: true, priority: true },
    with: {
      owner: { columns: { id: true, name: true, email: true } },
      type: { columns: { id: true, key: true, nameEs: true } },
      project: { columns: { id: true, name: true } },
    },
  })

  if (sample) {
    console.log("\n📋 Ejemplo de incidencia con relaciones:")
    console.log(JSON.stringify(sample, null, 2))
  }

  const incidentWithAssignees = await db.query.incidents.findFirst({
    columns: { id: true, title: true },
    with: { 
      assignees: { 
        with: { user: { columns: { id: true, name: true } } } 
      } 
    },
  })

  if (incidentWithAssignees) {
    console.log(`\n👥 Asignados en "${incidentWithAssignees.title}": ${incidentWithAssignees.assignees.length} usuario(s)`)
  }

  const tagCount = await db.$count(schema.incidentTagsMapping)
  console.log(`\n🏷️  Tags vinculados a incidentes: ${tagCount}`)

  console.log("\n🎉 Verificación completada!")
  process.exit(0)
}

verify().catch((err) => {
  console.error("❌ Verificación falló:", err)
  process.exit(1)
})
