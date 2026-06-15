import { ITagRepository } from "@domain/ports/tag.repository"
import { Tag } from "@domain/entities/tag.entity"
import { NotFoundError } from "@domain/errors/domain.errors"

export class GetTagByIdUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findById(id)
    if (!tag) {
      throw new NotFoundError("Tag", id)
    }
    return tag
  }
}
