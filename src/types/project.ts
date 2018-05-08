import React from 'react'
import { RxDocument } from 'rxdb'
import { Project } from './components'

export type ProjectDocument = RxDocument<Project>

export type AddProject = () => void

export type UpdateProject = (
  doc: ProjectDocument,
  data: Partial<Project>
) => void

export type RemoveProject = (
  doc: ProjectDocument
) => (event: React.SyntheticEvent<HTMLElement>) => void

export interface ProjectActions {
  addProject: AddProject
  updateProject: UpdateProject
  removeProject: RemoveProject
}
