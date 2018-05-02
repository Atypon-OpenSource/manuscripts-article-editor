import React from 'react'
import Add from '../icons/add'
import { AddGroup, GroupDocument } from '../types/group'
import { ActionButton } from './Button'
import { EmptyContainer, EmptyMessage } from './Empty'
import { Groups } from './Groups'
import { EmptyGroupsMessage, GroupsTitleMessage } from './Messages'
import { PageHeading } from './PageHeading'
import { Select, Sort } from './Sort'

interface GroupsPageProps {
  groups: GroupDocument[]
  addGroup: AddGroup
}

const GroupsPage: React.SFC<GroupsPageProps> = ({ groups, addGroup }) => (
  <React.Fragment>
    <PageHeading
      action={
        <ActionButton onClick={() => addGroup({ name: 'Untitled' })}>
          <Add size={15} />
        </ActionButton>
      }
    >
      <GroupsTitleMessage />
    </PageHeading>

    {groups.length ? (
      <React.Fragment>
        <Sort>
          <Select>
            <option value="name">by name</option>
            <option value="modified">by modification date</option>
          </Select>
        </Sort>

        <Groups groups={groups} />
      </React.Fragment>
    ) : (
      <EmptyContainer>
        <EmptyMessage>
          <EmptyGroupsMessage />
        </EmptyMessage>
      </EmptyContainer>
    )}
  </React.Fragment>
)

export default GroupsPage
