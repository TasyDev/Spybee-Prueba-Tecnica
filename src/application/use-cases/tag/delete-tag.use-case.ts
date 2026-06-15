import { ITagRepository } from "@domain/ports/tag.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class DeleteTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(id: string): Promise<void> {
    const tag = await this.tagRepository.findById(id)
    if (!tag) {
      throw new NotFoundError("Tag", id)
    }
    await this.tagRepository.delete(id)
  }
}
