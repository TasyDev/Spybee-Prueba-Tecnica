import { IUserRepository } from "@domain/ports/user.repository"
import { User } from "@domain/entities/user.entity"
import { NotFoundError } from "@domain/errors/domain.errors"

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundError("User", id)
    }
    return user
  }
}
