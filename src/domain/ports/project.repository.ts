import { Project } from "@entities/project.entity"

export interface IProjectRepository {
  findAll(): Promise<Project[]>
  findById(id: string): Promise<Project | null>
  save(project: Project): Promise<Project>
  update(project: Project): Promise<Project>
  delete(id: string): Promise<void>
}
