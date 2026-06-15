import { IUserRepository } from "@domain/ports/user.repository"
import { User } from "@domain/entities/user.entity"
import { CreateUserDto } from "@application/dto/user.dto"

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(dto: CreateUserDto): Promise<User> {
    const user = User.create({
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email,
      role: dto.role,
      avatarUrl: null,
    })
    return this.userRepository.save(user)
  }
}
