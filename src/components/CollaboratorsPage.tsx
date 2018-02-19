import * as React from 'react'
import { RxDocument } from 'rxdb'
import Add from '../icons/add'
import {
  CollaboratorActions,
  CollaboratorInterface,
} from '../types/collaborator'
import { Authors } from './Authors'
import { ActionButton } from './Button'
import { PageHeading } from './PageHeading'

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
          <Add size={15} />
        </ActionButton>
      }
    />
    <Authors authors={collaborators} />
  </React.Fragment>
)

export default CollaboratorsPage
