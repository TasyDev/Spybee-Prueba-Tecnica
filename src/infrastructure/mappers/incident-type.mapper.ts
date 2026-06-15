import { IncidentType } from "@domain/entities/incident-type.entity"

export class IncidentTypeMapper {
  static toDomain(row: any): IncidentType {
    return IncidentType.create({
      id: row.id,
      key: row.key,
      nameEs: row.nameEs,
      nameEn: row.nameEn,
    })
  }

  static toResponse(entity: IncidentType): any {
    return {
      id: entity.id,
      key: entity.key,
      name: entity.nameEs,
      name_en: entity.nameEn,
    }
  }
}
