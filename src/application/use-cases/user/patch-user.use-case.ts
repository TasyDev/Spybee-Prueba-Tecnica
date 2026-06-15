import { IUserRepository } from "@domain/ports/user.repository"
import { User } from "@domain/entities/user.entity"
import { NotFoundError } from "@domain/errors/domain.errors"
import { PatchUserDto } from "@application/dto/user.dto"

export class PatchUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: PatchUserDto): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundError("User", id)
    }
    if (dto.name) {
      user.updateName(dto.name)
    }
    if (dto.email) {
      user.updateEmail(dto.email)
    }
    return this.userRepository.update(user)
  }
}
