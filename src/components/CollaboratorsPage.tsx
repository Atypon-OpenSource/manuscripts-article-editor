import * as React from 'react'
import { CollaboratorsActionCreators } from '../store/collaborators/types'
import { Person } from '../types/person'
import { Authors } from './Authors'
import { ActionButton } from './Button'
import { PageHeading } from './PageHeading'
import { Search } from './Search'

interface CollaboratorsPageProps {
  collaborators: Person[]
}

const CollaboratorsPage: React.SFC<
  CollaboratorsPageProps & CollaboratorsActionCreators
> = ({ collaborators }) => (
  <React.Fragment>
    <PageHeading
      title={'Collaborators'}
      action={<ActionButton>+</ActionButton>}
    />
    <Search />
    <Authors authors={collaborators} />
  </React.Fragment>
)

export default CollaboratorsPage
