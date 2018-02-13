import * as React from 'react'
import { RxDocument } from 'rxdb'
import { GroupActions, GroupInterface } from '../types/group'
import { ActionButton } from './Button'
import { Groups } from './Groups'
import { PageHeading } from './PageHeading'
import { Search } from './Search'

interface GroupsPageProps {
  groups: Array<RxDocument<GroupInterface>>
}

const GroupsPage: React.SFC<GroupsPageProps & GroupActions> = ({
  groups,
  addGroup,
}) => (
  <React.Fragment>
    <PageHeading
      title={'Groups'}
      action={
        <ActionButton onClick={() => addGroup({ name: 'Untitled' })}>
          +
        </ActionButton>
      }
    />
    <Search />
    <Groups groups={groups} />
  </React.Fragment>
)

export default GroupsPage
