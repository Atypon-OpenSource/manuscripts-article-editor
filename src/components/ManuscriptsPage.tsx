import * as React from 'react'
import { RxDocument } from 'rxdb'
import Add from '../icons/add'
import { styled } from '../theme'
import { ManuscriptActions, ManuscriptInterface } from '../types/manuscript'
import { ActionButton } from './Button'
import { Manuscripts } from './Manuscripts'
import { PageHeading } from './PageHeading'
import { Sort } from './Sort'

interface ManuscriptsPageProps {
  manuscripts: Array<RxDocument<ManuscriptInterface>>
}

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
`

const EmptyMessage = styled.div`
  text-align: center;
  max-width: 380px;
  font-size: 20px;
  line-height: 28px;
`

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
          <Add size={15} />
        </ActionButton>
      }
    />

    {manuscripts.length ? (
      <React.Fragment>
        <Sort>
          <option value="modified">by modification date</option>
          <option value="name">by name</option>
        </Sort>

        <Manuscripts
          manuscripts={manuscripts}
          removeManuscript={removeManuscript}
          addManuscript={addManuscript}
          updateManuscript={updateManuscript}
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
