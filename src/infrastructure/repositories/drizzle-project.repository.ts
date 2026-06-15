import { eq } from "drizzle-orm"
import { IProjectRepository } from "@domain/ports/project.repository"
import { Project } from "@domain/entities/project.entity"
import { projects } from "@db/schema"
import { ProjectMapper } from "@mappers/project.mapper"

export class DrizzleProjectRepository implements IProjectRepository {
  constructor(private db: any) {}

  async findAll(): Promise<Project[]> {
    const rows = await this.db.select().from(projects)
    return rows.map((row: any) => ProjectMapper.toDomain(row))
  }

  async findById(id: string): Promise<Project | null> {
    const row = await this.db.query.projects.findFirst({
      where: eq(projects.id, id),
    })
    if (!row) return null
    return ProjectMapper.toDomain(row)
  }

  async save(project: Project): Promise<Project> {
    const now = new Date()
    const props = project.toProps()
    await this.db.insert(projects).values({
      id: props.id,
      name: props.name,
    })
    return this.findById(props.id) as Promise<Project>
  }

  async update(project: Project): Promise<Project> {
    const props = project.toProps()
    await this.db.update(projects).set({
      name: props.name,
    }).where(eq(projects.id, props.id))
    return this.findById(props.id) as Promise<Project>
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(projects).where(eq(projects.id, id))
  }
}
