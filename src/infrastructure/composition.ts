import { getDb } from "@db/client"

import { DrizzleIncidentRepository } from "@repositories/drizzle-incident.repository"
import { DrizzleProjectRepository } from "@repositories/drizzle-project.repository"
import { DrizzleUserRepository } from "@repositories/drizzle-user.repository"
import { DrizzleTagRepository } from "@repositories/drizzle-tag.repository"
import { DrizzleIncidentTypeRepository } from "@repositories/drizzle-incident-type.repository"

import { ListIncidentsUseCase } from "@application/use-cases/incident/list-incidents.use-case"
import { GetIncidentByIdUseCase } from "@application/use-cases/incident/get-incident-by-id.use-case"
import { CreateIncidentUseCase } from "@application/use-cases/incident/create-incident.use-case"
import { PatchIncidentUseCase } from "@application/use-cases/incident/patch-incident.use-case"
import { DeleteIncidentUseCase } from "@application/use-cases/incident/delete-incident.use-case"
import { RestoreIncidentUseCase } from "@application/use-cases/incident/restore-incident.use-case"
import { AddAssigneeUseCase } from "@application/use-cases/incident/add-assignee.use-case"
import { RemoveAssigneeUseCase } from "@application/use-cases/incident/remove-assignee.use-case"
import { AddObserverUseCase } from "@application/use-cases/incident/add-observer.use-case"
import { RemoveObserverUseCase } from "@application/use-cases/incident/remove-observer.use-case"
import { AttachTagUseCase } from "@application/use-cases/incident/attach-tag.use-case"
import { DetachTagUseCase } from "@application/use-cases/incident/detach-tag.use-case"
import { UploadMediaUseCase } from "@application/use-cases/incident/upload-media.use-case"
import { UpdateMediaUseCase } from "@application/use-cases/incident/update-media.use-case"
import { DeleteMediaUseCase } from "@application/use-cases/incident/delete-media.use-case"
import { CancelDraftUseCase } from "@application/use-cases/incident/cancel-draft.use-case"
import { ListIncidentsByProjectUseCase } from "@application/use-cases/incident/list-incidents-by-project.use-case"
import { ListIncidentsByIncidentTypeUseCase } from "@application/use-cases/incident/list-incidents-by-incident-type.use-case"
import { ListIncidentsByUserUseCase } from "@application/use-cases/incident/list-incidents-by-user.use-case"
import { ListIncidentsByTagUseCase } from "@application/use-cases/incident/list-incidents-by-tag.use-case"

import { ListProjectsUseCase } from "@application/use-cases/project/list-projects.use-case"
import { GetProjectByIdUseCase } from "@application/use-cases/project/get-project-by-id.use-case"
import { CreateProjectUseCase } from "@application/use-cases/project/create-project.use-case"
import { PatchProjectUseCase } from "@application/use-cases/project/patch-project.use-case"
import { DeleteProjectUseCase } from "@application/use-cases/project/delete-project.use-case"

import { ListUsersUseCase } from "@application/use-cases/user/list-users.use-case"
import { GetUserByIdUseCase } from "@application/use-cases/user/get-user-by-id.use-case"
import { CreateUserUseCase } from "@application/use-cases/user/create-user.use-case"
import { PatchUserUseCase } from "@application/use-cases/user/patch-user.use-case"
import { DeleteUserUseCase } from "@application/use-cases/user/delete-user.use-case"

import { ListTagsUseCase } from "@application/use-cases/tag/list-tags.use-case"
import { GetTagByIdUseCase } from "@application/use-cases/tag/get-tag-by-id.use-case"
import { CreateTagUseCase } from "@application/use-cases/tag/create-tag.use-case"
import { PatchTagUseCase } from "@application/use-cases/tag/patch-tag.use-case"
import { DeleteTagUseCase } from "@application/use-cases/tag/delete-tag.use-case"

import { ListIncidentTypesUseCase } from "@application/use-cases/incident-type/list-incident-types.use-case"
import { GetIncidentTypeByIdUseCase } from "@application/use-cases/incident-type/get-incident-type-by-id.use-case"
import { CreateIncidentTypeUseCase } from "@application/use-cases/incident-type/create-incident-type.use-case"
import { PatchIncidentTypeUseCase } from "@application/use-cases/incident-type/patch-incident-type.use-case"
import { DeleteIncidentTypeUseCase } from "@application/use-cases/incident-type/delete-incident-type.use-case"

import { createIncidentRouter } from "@http/controllers/incidents.controller"
import { createProjectRouter } from "@http/controllers/projects.controller"
import { createUserRouter } from "@http/controllers/users.controller"
import { createTagRouter } from "@http/controllers/tags.controller"
import { createIncidentTypeRouter } from "@http/controllers/incident-types.controller"

import { createApp } from "@http/app"
import { SupabaseStorageService } from "@infrastructure/services/supabase-storage.service"

let composition: ReturnType<typeof buildComposition> | null = null

function buildComposition() {
  const db = getDb()
  
  // Storage service
  const storageService = new SupabaseStorageService()
  
  // Repositories
  const incidentRepository = new DrizzleIncidentRepository(db)
  const projectRepository = new DrizzleProjectRepository(db)
  const userRepository = new DrizzleUserRepository(db)
  const tagRepository = new DrizzleTagRepository(db)
  const incidentTypeRepository = new DrizzleIncidentTypeRepository(db)

  // Incident use cases
  const listIncidentsUseCase = new ListIncidentsUseCase(incidentRepository)
  const getIncidentByIdUseCase = new GetIncidentByIdUseCase(incidentRepository)
  const createIncidentUseCase = new CreateIncidentUseCase(incidentRepository)
  const patchIncidentUseCase = new PatchIncidentUseCase(incidentRepository)
  const deleteIncidentUseCase = new DeleteIncidentUseCase(incidentRepository)
  const restoreIncidentUseCase = new RestoreIncidentUseCase(incidentRepository)
  const addAssigneeUseCase = new AddAssigneeUseCase(incidentRepository, userRepository)
  const removeAssigneeUseCase = new RemoveAssigneeUseCase(incidentRepository)
  const addObserverUseCase = new AddObserverUseCase(incidentRepository, userRepository)
  const removeObserverUseCase = new RemoveObserverUseCase(incidentRepository)
  const attachTagUseCase = new AttachTagUseCase(incidentRepository, tagRepository)
  const detachTagUseCase = new DetachTagUseCase(incidentRepository, tagRepository)
  const uploadMediaUseCase = new UploadMediaUseCase(incidentRepository, storageService)
  const updateMediaUseCase = new UpdateMediaUseCase(incidentRepository)
  const deleteMediaUseCase = new DeleteMediaUseCase(incidentRepository, storageService)
  const cancelDraftUseCase = new CancelDraftUseCase(incidentRepository, storageService)
  const listIncidentsByProjectUseCase = new ListIncidentsByProjectUseCase(incidentRepository)
  const listIncidentsByIncidentTypeUseCase = new ListIncidentsByIncidentTypeUseCase(incidentRepository)
  const listIncidentsByUserUseCase = new ListIncidentsByUserUseCase(incidentRepository)
  const listIncidentsByTagUseCase = new ListIncidentsByTagUseCase(incidentRepository)

  // Project use cases
  const listProjectsUseCase = new ListProjectsUseCase(projectRepository)
  const getProjectByIdUseCase = new GetProjectByIdUseCase(projectRepository)
  const createProjectUseCase = new CreateProjectUseCase(projectRepository)
  const patchProjectUseCase = new PatchProjectUseCase(projectRepository)
  const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository)

  // User use cases
  const listUsersUseCase = new ListUsersUseCase(userRepository)
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
  const createUserUseCase = new CreateUserUseCase(userRepository)
  const patchUserUseCase = new PatchUserUseCase(userRepository)
  const deleteUserUseCase = new DeleteUserUseCase(userRepository)

  // Tag use cases
  const listTagsUseCase = new ListTagsUseCase(tagRepository)
  const getTagByIdUseCase = new GetTagByIdUseCase(tagRepository)
  const createTagUseCase = new CreateTagUseCase(tagRepository)
  const patchTagUseCase = new PatchTagUseCase(tagRepository)
  const deleteTagUseCase = new DeleteTagUseCase(tagRepository)

  // Incident type use cases
  const listIncidentTypesUseCase = new ListIncidentTypesUseCase(incidentTypeRepository)
  const getIncidentTypeByIdUseCase = new GetIncidentTypeByIdUseCase(incidentTypeRepository)
  const createIncidentTypeUseCase = new CreateIncidentTypeUseCase(incidentTypeRepository)
  const patchIncidentTypeUseCase = new PatchIncidentTypeUseCase(incidentTypeRepository)
  const deleteIncidentTypeUseCase = new DeleteIncidentTypeUseCase(incidentTypeRepository)

  // Routers
  const incidentRouter = createIncidentRouter({
    listIncidentsUseCase,
    getIncidentByIdUseCase,
    createIncidentUseCase,
    patchIncidentUseCase,
    deleteIncidentUseCase,
    restoreIncidentUseCase,
    addAssigneeUseCase,
    removeAssigneeUseCase,
    addObserverUseCase,
    removeObserverUseCase,
    attachTagUseCase,
    detachTagUseCase,
    uploadMediaUseCase,
    updateMediaUseCase,
    deleteMediaUseCase,
    cancelDraftUseCase,
  })

  const projectRouter = createProjectRouter({
    listProjectsUseCase,
    getProjectByIdUseCase,
    listIncidentsByProjectUseCase,
    createProjectUseCase,
    patchProjectUseCase,
    deleteProjectUseCase,
  })

  const userRouter = createUserRouter({
    listUsersUseCase,
    getUserByIdUseCase,
    listIncidentsByUserUseCase,
    createUserUseCase,
    patchUserUseCase,
    deleteUserUseCase,
  })

  const tagRouter = createTagRouter({
    listTagsUseCase,
    getTagByIdUseCase,
    listIncidentsByTagUseCase,
    createTagUseCase,
    patchTagUseCase,
    deleteTagUseCase,
  })

  const incidentTypeRouter = createIncidentTypeRouter({
    listIncidentTypesUseCase,
    getIncidentTypeByIdUseCase,
    listIncidentsByIncidentTypeUseCase,
    createIncidentTypeUseCase,
    patchIncidentTypeUseCase,
    deleteIncidentTypeUseCase,
  })

  // App
  const app = createApp({
    incidentRouter,
    projectRouter,
    userRouter,
    tagRouter,
    incidentTypeRouter,
  })

  return { app }
}

export function getApp() {
  if (!composition) {
    composition = buildComposition()
  }
  return composition.app
}
