import { RxDocument } from 'rxdb'
import { Collaborator } from './components'

export type CollaboratorDocument = RxDocument<Collaborator>

export type AddCollaborator = (
  data: Partial<Collaborator>
) => Promise<CollaboratorDocument>

export type UpdateCollaborator = (
  doc: CollaboratorDocument,
  data: Partial<Collaborator>
) => Promise<Partial<Collaborator>>

export type RemoveCollaborator = (doc: CollaboratorDocument) => Promise<boolean>

export interface CollaboratorActions {
  addCollaborator: AddCollaborator
  updateCollaborator: UpdateCollaborator
  removeCollaborator: RemoveCollaborator
}
