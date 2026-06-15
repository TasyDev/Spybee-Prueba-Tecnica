import { Tag } from "@entities/tag.entity"

export interface ITagRepository {
  findById(id: string): Promise<Tag | null>
  findAll(): Promise<Tag[]>
  save(tag: Tag): Promise<void>
  update(tag: Tag): Promise<void>
  delete(id: string): Promise<void>
}
