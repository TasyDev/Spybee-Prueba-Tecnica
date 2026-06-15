import { IProjectRepository } from "@domain/ports/project.repository"
import { Project } from "@domain/entities/project.entity"
import { NotFoundError } from "@domain/errors/domain.errors"

export class GetProjectByIdUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id)
    if (!project) {
      throw new NotFoundError("Project", id)
    }
    return project
  }
}
