import * as React from 'react'
import { RxDocument } from 'rxdb'
import Add from '../icons/add'
import { Manuscript } from '../types/components'
import { ManuscriptActions } from '../types/manuscript'
import { ActionButton } from './Button'
import { EmptyContainer, EmptyMessage } from './Empty'
import { Manuscripts } from './Manuscripts'
import { PageHeading } from './PageHeading'
import { Select, Sort } from './Sort'

interface ManuscriptsPageProps {
  manuscripts: Array<RxDocument<Manuscript>>
}

const ManuscriptsPage: React.SFC<ManuscriptsPageProps & ManuscriptActions> = ({
  manuscripts,
  addManuscript,
  removeManuscript,
}) => (
  <React.Fragment>
    <PageHeading
      title={'Manuscripts'}
      action={
        <ActionButton onClick={() => addManuscript({ title: '' })}>
          <Add size={15} />
        </ActionButton>
      }
    />

    {manuscripts.length ? (
      <React.Fragment>
        <Sort>
          <Select>
            <option value="modified">by modification date</option>
            <option value="name">by name</option>
          </Select>
        </Sort>

        <Manuscripts
          manuscripts={manuscripts}
          removeManuscript={removeManuscript}
        />
      </React.Fragment>
    ) : (
      <EmptyContainer>
        <EmptyMessage>
          <div>No Manuscripts yet.</div>
          <div>
            Use the + button to create a new Manuscript or import one from your
            computer.
          </div>
        </EmptyMessage>
      </EmptyContainer>
    )}
  </React.Fragment>
)

export default ManuscriptsPage
