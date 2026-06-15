import { IProjectRepository } from "@domain/ports/project.repository"
import { Project } from "@domain/entities/project.entity"
import { NotFoundError } from "@domain/errors/domain.errors"
import { PatchProjectDto } from "@application/dto/project.dto"

export class PatchProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string, dto: PatchProjectDto): Promise<Project> {
    const project = await this.projectRepository.findById(id)
    if (!project) {
      throw new NotFoundError("Project", id)
    }
    if (dto.name) {
      project.updateName(dto.name)
    }
    return this.projectRepository.update(project)
  }
}
