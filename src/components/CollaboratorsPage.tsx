import * as React from 'react'
import { RxDocument } from 'rxdb'
import {
  CollaboratorActions,
  CollaboratorInterface,
} from '../types/collaborator'
import { Authors } from './Authors'
import { ActionButton } from './Button'
import { PageHeading } from './PageHeading'
import { Search } from './Search'

interface CollaboratorsPageProps {
  collaborators: Array<RxDocument<CollaboratorInterface>>
}

const CollaboratorsPage: React.SFC<
  CollaboratorsPageProps & CollaboratorActions
> = ({ collaborators, addCollaborator }) => (
  <React.Fragment>
    <PageHeading
      title={'Collaborators'}
      action={
        <ActionButton onClick={() => addCollaborator({ name: 'Unnamed' })}>
          +
        </ActionButton>
      }
    />
    <Search />
    <Authors authors={collaborators} />
  </React.Fragment>
)

export default CollaboratorsPage
