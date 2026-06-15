import { ITagRepository } from "@domain/ports/tag.repository"
import { Tag } from "@domain/entities/tag.entity"
import { CreateTagDto } from "@application/dto/tag.dto"

export class CreateTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  execute(dto: CreateTagDto): Promise<Tag> {
    const tag = Tag.create({
      id: crypto.randomUUID(),
      name: dto.name,
      colorHex: dto.color ?? "#000000",
    })
    return this.tagRepository.save(tag)
  }
}
