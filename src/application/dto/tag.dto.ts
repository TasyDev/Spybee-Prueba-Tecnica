export interface CreateTagDto {
  name: string
  color?: string
}

export interface PatchTagDto {
  name?: string
  color?: string
}
