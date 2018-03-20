import * as React from 'react'
import Add from '../icons/add'
import {
  CollaboratorActions,
  CollaboratorDocument,
} from '../types/collaborator'
import { Authors } from './Authors'
import { ActionButton } from './Button'
import { EmptyContainer, EmptyMessage } from './Empty'
import { PageHeading } from './PageHeading'

interface CollaboratorsPageProps {
  collaborators: CollaboratorDocument[]
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
