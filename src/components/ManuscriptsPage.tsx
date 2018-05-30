import React from 'react'
import Add from '../icons/add'
import { ManuscriptActions, ManuscriptDocument } from '../types/manuscript'
import { ActionButton } from './Button'
import { EmptyContainer, EmptyMessage } from './Empty'
import { Manuscripts } from './Manuscripts'
import {
  EmptyManuscriptsMessage,
  ImportManuscriptMessage,
  ManuscriptsTitleMessage,
} from './Messages'
import { PageHeading } from './PageHeading'

interface ManuscriptsPageProps {
  manuscripts: ManuscriptDocument[]
}

const ManuscriptsPage: React.SFC<ManuscriptsPageProps & ManuscriptActions> = ({
  manuscripts,
  addManuscript,
  removeManuscript,
}) => (
  <React.Fragment>
    <PageHeading
      action={
        <ActionButton onClick={() => addManuscript()}>
          <Add size={15} />
        </ActionButton>
      }
    >
      <ManuscriptsTitleMessage />
    </PageHeading>

    {manuscripts.length ? (
      <React.Fragment>
        <Manuscripts
          manuscripts={manuscripts}
          removeManuscript={removeManuscript}
        />
      </React.Fragment>
    ) : (
      <EmptyContainer>
        <EmptyMessage>
          <div>
            <EmptyManuscriptsMessage />
          </div>
          <div>
            <ImportManuscriptMessage />
          </div>
        </EmptyMessage>
      </EmptyContainer>
    )}
  </React.Fragment>
)

export default ManuscriptsPage
