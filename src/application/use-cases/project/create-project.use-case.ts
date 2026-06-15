import { IProjectRepository } from "@domain/ports/project.repository"
import { Project } from "@domain/entities/project.entity"
import { CreateProjectDto } from "@application/dto/project.dto"

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  execute(dto: CreateProjectDto): Promise<Project> {
    const project = Project.create({
      id: crypto.randomUUID(),
      name: dto.name,
      description: dto.description ?? null,
      location: dto.location ?? null,
    })
    return this.projectRepository.save(project)
  }
}
