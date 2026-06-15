import { eq } from "drizzle-orm"
import { IUserRepository } from "@domain/ports/user.repository"
import { User } from "@domain/entities/user.entity"
import { users } from "@db/schema"
import { UserMapper } from "@mappers/user.mapper"

export class DrizzleUserRepository implements IUserRepository {
  constructor(private db: any) {}

  async findAll(): Promise<User[]> {
    const rows = await this.db.select().from(users)
    return rows.map((row: any) => UserMapper.toDomain(row))
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    })
    if (!row) return null
    return UserMapper.toDomain(row)
  }

  async save(user: User): Promise<User> {
    const props = user.toProps()
    await this.db.insert(users).values({
      id: props.id,
      name: props.name,
      email: props.email,
      avatarUrl: props.avatarUrl,
    })
    return this.findById(props.id) as Promise<User>
  }

  async update(user: User): Promise<User> {
    const props = user.toProps()
    await this.db.update(users).set({
      name: props.name,
      email: props.email,
      avatarUrl: props.avatarUrl,
    }).where(eq(users.id, props.id))
    return this.findById(props.id) as Promise<User>
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id))
  }
}
