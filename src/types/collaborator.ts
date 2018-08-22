import React from 'react'
import { RxDocument } from 'rxdb'
import { AnyComponent, Contributor } from './components'

export type ManuscriptDocument = RxDocument<Contributor>

export type AddCollaborator = (userID: string, role: string) => Promise<void>

export type HandleAddCollaborator = () => void

export type ImportCollaborator = (components: AnyComponent[]) => Promise<void>

export type UpdateCollaborator = (userID: string, role: string) => Promise<void>

export type RemoveCollaborator = (
  manuscriptID: string
) => (event: React.SyntheticEvent<HTMLElement>) => Promise<void>

export interface CollaboratorActions {
  handleAddCollaborator: HandleAddCollaborator
}
