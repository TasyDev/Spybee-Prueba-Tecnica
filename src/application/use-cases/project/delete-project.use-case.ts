import { IProjectRepository } from "@domain/ports/project.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    const project = await this.projectRepository.findById(id)
    if (!project) {
      throw new NotFoundError("Project", id)
    }
    await this.projectRepository.delete(id)
  }
}
