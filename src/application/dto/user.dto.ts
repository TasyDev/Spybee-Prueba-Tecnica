export interface CreateUserDto {
  name: string
  email: string
  role: string
}

export interface PatchUserDto {
  name?: string
  email?: string
  role?: string
}
