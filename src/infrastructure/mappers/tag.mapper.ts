import { Tag } from "@domain/entities/tag.entity"

export class TagMapper {
  static toDomain(row: any): Tag {
    return Tag.create({
      id: row.id,
      name: row.name,
      colorHex: row.colorHex,
    })
  }

  static toResponse(entity: Tag): any {
    return {
      id: entity.id,
      name: entity.name,
      color: entity.colorHex,
    }
  }
}
