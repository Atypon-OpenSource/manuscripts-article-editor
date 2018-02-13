import * as React from 'react'
import { RxDocument } from 'rxdb'
import { ManuscriptActions, ManuscriptInterface } from '../types/manuscript'
import { ActionButton } from './Button'
import { Manuscripts } from './Manuscripts'
import { PageHeading } from './PageHeading'
import { Search } from './Search'

interface ManuscriptsPageProps {
  manuscripts: Array<RxDocument<ManuscriptInterface>>
}

const ManuscriptsPage: React.SFC<ManuscriptsPageProps & ManuscriptActions> = ({
  manuscripts,
  addManuscript,
  removeManuscript,
  updateManuscript,
}) => (
  <React.Fragment>
    <PageHeading
      title={'Manuscripts'}
      action={
        <ActionButton onClick={() => addManuscript({ title: 'Untitled' })}>
          +
        </ActionButton>
      }
    />
    <Search />
    <Manuscripts
      manuscripts={manuscripts}
      removeManuscript={removeManuscript}
      addManuscript={addManuscript}
      updateManuscript={updateManuscript}
    />
  </React.Fragment>
)

export default ManuscriptsPage
