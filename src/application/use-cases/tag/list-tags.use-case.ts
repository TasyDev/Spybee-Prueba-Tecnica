import { ITagRepository } from "@domain/ports/tag.repository"
import { Tag } from "@domain/entities/tag.entity"

export class ListTagsUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  execute(): Promise<Tag[]> {
    return this.tagRepository.findAll()
  }
}
