export interface CreateProjectDto {
  name: string
  description?: string
  location?: string
}

export interface PatchProjectDto {
  name?: string
  description?: string
  location?: string
}
