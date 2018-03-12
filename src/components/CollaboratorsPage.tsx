import * as React from 'react'
import { RxDocument } from 'rxdb'
import Add from '../icons/add'
import { CollaboratorActions } from '../types/collaborator'
import { Collaborator } from '../types/components'
import { Authors } from './Authors'
import { ActionButton } from './Button'
import { EmptyContainer, EmptyMessage } from './Empty'
import { PageHeading } from './PageHeading'

interface CollaboratorsPageProps {
  collaborators: Array<RxDocument<Collaborator>>
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

    {collaborators.length ? (
      <Authors authors={collaborators} />
    ) : (
      <EmptyContainer>
        <EmptyMessage>
          <div>No Collaborators yet.</div>
        </EmptyMessage>
      </EmptyContainer>
    )}
  </React.Fragment>
)

export default CollaboratorsPage
