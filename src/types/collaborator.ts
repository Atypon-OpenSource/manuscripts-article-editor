import { RxDocument } from 'rxdb'
import { Collaborator } from './components'

export type AddCollaborator = (
  data: Partial<Collaborator>
) => Promise<RxDocument<Collaborator>>

export type UpdateCollaborator = (
  doc: RxDocument<Collaborator>,
  data: Partial<Collaborator>
) => Promise<Partial<Collaborator>>

export type RemoveCollaborator = (
  doc: RxDocument<Collaborator>
) => Promise<boolean>

export interface CollaboratorActions {
  addCollaborator: AddCollaborator
  updateCollaborator: UpdateCollaborator
  removeCollaborator: RemoveCollaborator
}
