import { IUserRepository } from "@domain/ports/user.repository"
import { NotFoundError } from "@domain/errors/domain.errors"

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundError("User", id)
    }
    await this.userRepository.delete(id)
  }
}
