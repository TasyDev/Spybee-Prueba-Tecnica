import { User } from "@domain/entities/user.entity"

export class UserMapper {
  static toDomain(row: any): User {
    return User.create({
      id: row.id,
      name: row.name,
      email: row.email,
      avatarUrl: row.avatarUrl,
    })
  }

  static toResponse(entity: User): any {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      avatarUrl: entity.avatarUrl,
    }
  }
}
