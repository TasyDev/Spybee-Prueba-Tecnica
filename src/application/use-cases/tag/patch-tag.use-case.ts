import { ITagRepository } from "@domain/ports/tag.repository"
import { Tag } from "@domain/entities/tag.entity"
import { NotFoundError } from "@domain/errors/domain.errors"
import { PatchTagDto } from "@application/dto/tag.dto"

export class PatchTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(id: string, dto: PatchTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findById(id)
    if (!tag) {
      throw new NotFoundError("Tag", id)
    }
    if (dto.name) {
      tag.updateName(dto.name)
    }
    if (dto.color) {
      tag.updateColorHex(dto.color)
    }
    return this.tagRepository.update(tag)
  }
}
