import { IProjectRepository } from "@domain/ports/project.repository"
import { Project } from "@domain/entities/project.entity"

export class ListProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  execute(): Promise<Project[]> {
    return this.projectRepository.findAll()
  }
}
