import { Tag } from "@entities/tag.entity"

export interface ITagRepository {
  findAll(): Promise<Tag[]>
  findById(id: string): Promise<Tag | null>
  save(tag: Tag): Promise<Tag>
  update(tag: Tag): Promise<Tag>
  delete(id: string): Promise<void>
}
