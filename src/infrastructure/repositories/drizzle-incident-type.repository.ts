import { eq } from "drizzle-orm"
import { IIncidentTypeRepository } from "@domain/ports/incident-type.repository"
import { IncidentType } from "@domain/entities/incident-type.entity"
import { incidentTypes } from "@db/schema"
import { IncidentTypeMapper } from "@mappers/incident-type.mapper"

export class DrizzleIncidentTypeRepository implements IIncidentTypeRepository {
  constructor(private db: any) {}

  async findAll(): Promise<IncidentType[]> {
    const rows = await this.db.select().from(incidentTypes)
    return rows.map((row: any) => IncidentTypeMapper.toDomain(row))
  }

  async findById(id: string): Promise<IncidentType | null> {
    const row = await this.db.query.incidentTypes.findFirst({
      where: eq(incidentTypes.id, id),
    })
    if (!row) return null
    return IncidentTypeMapper.toDomain(row)
  }

  async save(type: IncidentType): Promise<IncidentType> {
    const props = type.toProps()
    await this.db.insert(incidentTypes).values({
      id: props.id,
      key: props.key,
      nameEs: props.nameEs,
      nameEn: props.nameEn,
    })
    return this.findById(props.id) as Promise<IncidentType>
  }

  async update(type: IncidentType): Promise<IncidentType> {
    const props = type.toProps()
    await this.db.update(incidentTypes).set({
      key: props.key,
      nameEs: props.nameEs,
      nameEn: props.nameEn,
    }).where(eq(incidentTypes.id, props.id))
    return this.findById(props.id) as Promise<IncidentType>
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(incidentTypes).where(eq(incidentTypes.id, id))
  }
}
