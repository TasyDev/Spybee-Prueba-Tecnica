const BASE_URL = "http://localhost:3000/api"

let passed = 0
let failed = 0

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn()
    console.log(`✅ ${name}`)
    passed++
  } catch (err: any) {
    console.log(`❌ ${name}: ${err.message}`)
    failed++
  }
}

async function get(path: string) {
  const res = await fetch(`${BASE_URL}${path}`)
  return { status: res.status, body: await res.json() }
}

async function post(path: string, data: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const body = res.status === 204 ? null : await res.json()
  return { status: res.status, body }
}

async function patch(path: string, data: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const body = res.status === 204 ? null : await res.json()
  return { status: res.status, body }
}

async function del(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE" })
  return { status: res.status, body: res.status === 204 ? null : await res.json() }
}

async function runTests() {
  console.log("🔍 Testing SpyBee API (Seed Data + New Fields)\n")

  let testIncidentId: string
  let testProjectId: string
  let testUserId: string
  let testTagId: string
  let testIncidentTypeId: string

  // ─── 1. Verify existing seeded data ───
  await test("GET /incidents - list all seeded incidents", async () => {
    const { status, body } = await get("/incidents")
    if (status !== 200) throw new Error(`Status ${status}`)
    if (!Array.isArray(body.data) || body.data.length === 0) {
      throw new Error("No incidents found")
    }
    console.log(`   📊 Found ${body.data.length} incidents`)
  })

  await test("GET /incidents/:id - verify seeded incident fields", async () => {
    const { body: list } = await get("/incidents")
    if (!list.data || list.data.length === 0) throw new Error("No incidents in list")
    const incident = list.data[0]
    const { status, body } = await get(`/incidents/${incident.id}`)
    if (status !== 200) throw new Error(`Status ${status}: ${JSON.stringify(body)}`)
    if (!body.title) throw new Error("Missing title")
    if (!body.description) throw new Error("Missing description")
    console.log(`   📄 Incident: ${body.title}`)
  })

  await test("GET /projects - list seeded projects", async () => {
    const { status, body } = await get("/projects")
    if (status !== 200) throw new Error(`Status ${status}`)
    if (!Array.isArray(body) || body.length === 0) throw new Error("No projects")
    testProjectId = body[0].id
    console.log(`   📊 Found ${body.length} projects`)
  })

  await test("GET /users - list seeded users", async () => {
    const { status, body } = await get("/users")
    if (status !== 200) throw new Error(`Status ${status}`)
    if (!Array.isArray(body) || body.length === 0) throw new Error("No users")
    testUserId = body[0].id
    console.log(`   📊 Found ${body.length} users`)
  })

  await test("GET /tags - list seeded tags", async () => {
    const { status, body } = await get("/tags")
    if (status !== 200) throw new Error(`Status ${status}`)
    if (!Array.isArray(body) || body.length === 0) throw new Error("No tags")
    testTagId = body[0].id
    console.log(`   📊 Found ${body.length} tags`)
  })

  await test("GET /incident-types - list seeded incident types", async () => {
    const { status, body } = await get("/incident-types")
    if (status !== 200) throw new Error(`Status ${status}`)
    if (!Array.isArray(body) || body.length === 0) throw new Error("No types")
    testIncidentTypeId = body[0].id
    console.log(`   📊 Found ${body.length} incident types`)
  })

  // ─── 2. Create new incident with ALL fixed fields ───
  await test("POST /incidents - create with new fields", async () => {
    const { status, body } = await post("/incidents", {
      title: "API Test - New Fields",
      description: "Testing locationDescription, dueDate, whatsappOwner",
      priority: "high",
      coordinates: { lat: 4.65, lng: -74.05 },
      locationDescription: "Nivel 5 - eje A1",
      dueDate: "2026-07-01T00:00:00.000Z",
      whatsappOwner: "+573001234567",
      projectId: testProjectId,
      incidentTypeId: testIncidentTypeId,
      reportedById: testUserId,
    })
    if (status !== 201) throw new Error(`Status ${status}: ${JSON.stringify(body)}`)
    testIncidentId = body.id
    console.log(`   🆕 Created incident: ${body.id}`)
  })

  // ─── 3. Verify new incident has all fields ───
  await test("GET /incidents/:id - verify new fields persisted", async () => {
    const { status, body } = await get(`/incidents/${testIncidentId}`)
    if (status !== 200) throw new Error(`Status ${status}`)
    if (body.locationDescription !== "Nivel 5 - eje A1") {
      throw new Error(`locationDescription mismatch: ${body.locationDescription}`)
    }
    if (body.whatsappOwner !== "+573001234567") {
      throw new Error(`whatsappOwner mismatch: ${body.whatsappOwner}`)
    }
    console.log(`   ✅ All new fields persisted correctly`)
  })

  // ─── 4. PATCH with new fields ───
  await test("PATCH /incidents/:id - update new fields", async () => {
    const { status, body } = await patch(`/incidents/${testIncidentId}`, {
      locationDescription: "Updated location - Nivel 10",
      dueDate: "2026-08-15T00:00:00.000Z",
      whatsappOwner: "+573009876543",
      approval: true,
    })
    if (status !== 200) throw new Error(`Status ${status}: ${JSON.stringify(body)}`)
    console.log(`   📝 Patched incident`)
  })

  await test("GET /incidents/:id - verify patched fields", async () => {
    const { status, body } = await get(`/incidents/${testIncidentId}`)
    if (status !== 200) throw new Error(`Status ${status}`)
    if (body.locationDescription !== "Updated location - Nivel 10") {
      throw new Error(`locationDescription not updated: ${body.locationDescription}`)
    }
    if (body.whatsappOwner !== "+573009876543") {
      throw new Error(`whatsappOwner not updated: ${body.whatsappOwner}`)
    }
    if (body.approval !== true) {
      throw new Error(`approval not updated: ${body.approval}`)
    }
    console.log(`   ✅ Patched fields verified`)
  })

  // ─── 5. Domain rules: Tags ───
  await test("POST /incidents/:id/tags - attach tag", async () => {
    const { status, body } = await post(`/incidents/${testIncidentId}/tags`, {
      tagId: testTagId,
    })
    if (status !== 201) throw new Error(`Status ${status}: ${JSON.stringify(body)}`)
    console.log(`   🏷️ Tag attached`)
  })

  await test("GET /incidents/:id - verify tag attached", async () => {
    const { status, body } = await get(`/incidents/${testIncidentId}`)
    if (status !== 200) throw new Error(`Status ${status}`)
    const tagIds = body.tagIds || []
    if (!tagIds.includes(testTagId)) {
      throw new Error(`Tag ${testTagId} not in tagIds: ${JSON.stringify(tagIds)}`)
    }
    console.log(`   ✅ Tag attached in domain`)
  })

  // ─── 6. Domain rules: Soft Delete ───
  await test("DELETE /incidents/:id - soft delete", async () => {
    const { status } = await del(`/incidents/${testIncidentId}`)
    if (status !== 204) throw new Error(`Status ${status}`)
    console.log(`   🗑️ Soft deleted`)
  })

  await test("GET /incidents/:id - verify deleted incident returns 404", async () => {
    const { status } = await get(`/incidents/${testIncidentId}`)
    if (status !== 404) throw new Error(`Expected 404, got ${status}`)
    console.log(`   ✅ Returns 404 as expected`)
  })

  await test("PATCH /incidents/:id/restore - restore incident", async () => {
    const { status, body } = await patch(`/incidents/${testIncidentId}/restore`, {})
    if (status !== 200) throw new Error(`Status ${status}: ${JSON.stringify(body)}`)
    console.log(`   🔄 Restored`)
  })

  await test("GET /incidents/:id - verify restored incident accessible", async () => {
    const { status, body } = await get(`/incidents/${testIncidentId}`)
    if (status !== 200) throw new Error(`Status ${status}`)
    if (body.deleted !== false) throw new Error("Incident still marked as deleted")
    console.log(`   ✅ Incident restored and accessible`)
  })

  // ─── 7. Domain rules: Status transitions ───
  await test("PATCH /incidents/:id - valid status transition (open -> in_progress)", async () => {
    const { status, body } = await patch(`/incidents/${testIncidentId}`, {
      status: "in_progress",
    })
    if (status !== 200) throw new Error(`Status ${status}: ${JSON.stringify(body)}`)
    console.log(`   ✅ Status transition accepted`)
  })

  await test("PATCH /incidents/:id - invalid status transition (open -> closed)", async () => {
    const { status, body } = await patch(`/incidents/${testIncidentId}`, {
      status: "closed",
    })
    if (status !== 409) throw new Error(`Expected 409, got ${status}: ${JSON.stringify(body)}`)
    console.log(`   ✅ Invalid transition rejected (409)`)
  })

  // ─── 8. Relations endpoints ───
  await test("GET /projects/:id/incidents - list incidents by project", async () => {
    const { status, body } = await get(`/projects/${testProjectId}/incidents`)
    if (status !== 200) throw new Error(`Status ${status}`)
    if (!Array.isArray(body.data)) throw new Error("No data array")
    console.log(`   📊 Found ${body.data.length} incidents for project`)
  })

  await test("GET /users/:id/incidents - list incidents by user", async () => {
    const { status, body } = await get(`/users/${testUserId}/incidents`)
    if (status !== 200) throw new Error(`Status ${status}`)
    if (!Array.isArray(body.data)) throw new Error("No data array")
    console.log(`   📊 Found ${body.data.length} incidents for user`)
  })

  await test("GET /tags/:id/incidents - list incidents by tag", async () => {
    const { status, body } = await get(`/tags/${testTagId}/incidents`)
    if (status !== 200) throw new Error(`Status ${status}`)
    if (!Array.isArray(body.data)) throw new Error("No data array")
    console.log(`   📊 Found ${body.data.length} incidents for tag`)
  })

  // ─── 9. Negative tests ───
  await test("GET /incidents/nonexistent - returns 404", async () => {
    const { status } = await get("/incidents/nonexistent-id-12345")
    if (status !== 404) throw new Error(`Expected 404, got ${status}`)
    console.log(`   ✅ 404 for non-existent`)
  })

  await test("POST /incidents - invalid body returns 400", async () => {
    const { status } = await post("/incidents", { title: "bad" })
    if (status !== 400) throw new Error(`Expected 400, got ${status}`)
    console.log(`   ✅ 400 for invalid body`)
  })

  // ─── Summary ───
  console.log("\n" + "=".repeat(50))
  console.log(`📊 Results: ${passed} passed, ${failed} failed`)
  console.log("=".repeat(50))

  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
