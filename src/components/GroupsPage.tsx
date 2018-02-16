import * as React from 'react'
import { RxDocument } from 'rxdb'
import Add from '../icons/add'
import { GroupActions, GroupInterface } from '../types/group'
import { ActionButton } from './Button'
import { Groups } from './Groups'
import { PageHeading } from './PageHeading'
import { Sort } from './Sort'

interface GroupsPageProps {
  groups: Array<RxDocument<GroupInterface>>
}

const GroupsPage: React.SFC<GroupsPageProps & GroupActions> = ({
  groups,
  addGroup,
  removeGroup,
  updateGroup,
}) => (
  <React.Fragment>
    <PageHeading
      title={'Groups'}
      action={
        <ActionButton onClick={() => addGroup({ name: 'Untitled' })}>
          <Add size={15} />
        </ActionButton>
      }
    />
    <Sort>
      <option value="modified">by modification date</option>
      <option value="name">by name</option>
    </Sort>
    <Groups
      groups={groups}
      addGroup={addGroup}
      removeGroup={removeGroup}
      updateGroup={updateGroup}
    />
  </React.Fragment>
)

export default GroupsPage
