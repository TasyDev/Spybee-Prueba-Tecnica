import { User } from "@entities/user.entity"

export interface IUserRepository {
  findAll(): Promise<User[]>
  findById(id: string): Promise<User | null>
  save(user: User): Promise<User>
  update(user: User): Promise<User>
  delete(id: string): Promise<void>
}
