export interface CreateUserDto {
  name: string
  email: string
}

export interface PatchUserDto {
  name?: string
  email?: string
}
