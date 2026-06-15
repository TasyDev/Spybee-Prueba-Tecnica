import { eq } from "drizzle-orm"
import { ITagRepository } from "@domain/ports/tag.repository"
import { Tag } from "@domain/entities/tag.entity"
import { tags } from "@db/schema"
import { TagMapper } from "@mappers/tag.mapper"

export class DrizzleTagRepository implements ITagRepository {
  constructor(private db: any) {}

  async findAll(): Promise<Tag[]> {
    const rows = await this.db.select().from(tags)
    return rows.map((row: any) => TagMapper.toDomain(row))
  }

  async findById(id: string): Promise<Tag | null> {
    const row = await this.db.query.tags.findFirst({
      where: eq(tags.id, id),
    })
    if (!row) return null
    return TagMapper.toDomain(row)
  }

  async save(tag: Tag): Promise<Tag> {
    const props = tag.toProps()
    await this.db.insert(tags).values({
      id: props.id,
      name: props.name,
      colorHex: props.colorHex,
    })
    return this.findById(props.id) as Promise<Tag>
  }

  async update(tag: Tag): Promise<Tag> {
    const props = tag.toProps()
    await this.db.update(tags).set({
      name: props.name,
      colorHex: props.colorHex,
    }).where(eq(tags.id, props.id))
    return this.findById(props.id) as Promise<Tag>
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(tags).where(eq(tags.id, id))
  }
}
