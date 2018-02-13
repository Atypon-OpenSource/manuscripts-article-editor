import { RxDocument } from 'rxdb'
import { Person } from './person'

export type CollaboratorInterface = Person

export type AddCollaborator = (
  data: Partial<CollaboratorInterface>
) => Promise<RxDocument<CollaboratorInterface>>

export type UpdateCollaborator = (
  doc: RxDocument<CollaboratorInterface>,
  data: Partial<CollaboratorInterface>
) => Promise<Partial<CollaboratorInterface>>

export type RemoveCollaborator = (
  doc: RxDocument<CollaboratorInterface>
) => Promise<boolean>

export interface CollaboratorActions {
  addCollaborator: AddCollaborator
  updateCollaborator: UpdateCollaborator
  removeCollaborator: RemoveCollaborator
}
