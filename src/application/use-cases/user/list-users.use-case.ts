import { IUserRepository } from "@domain/ports/user.repository"
import { User } from "@domain/entities/user.entity"

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}
