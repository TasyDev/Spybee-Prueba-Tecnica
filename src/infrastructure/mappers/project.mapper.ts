import { Project } from "@domain/entities/project.entity"

export class ProjectMapper {
  static toDomain(row: any): Project {
    return Project.create({
      id: row.id,
      name: row.name,
    })
  }

  static toResponse(entity: Project): any {
    return {
      id: entity.id,
      name: entity.name,
    }
  }
}
