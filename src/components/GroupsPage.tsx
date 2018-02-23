import * as React from 'react'
import { RxDocument } from 'rxdb'
import Add from '../icons/add'
import { AddGroup, GroupInterface } from '../types/group'
import { ActionButton } from './Button'
import { EmptyContainer, EmptyMessage } from './Empty'
import { Groups } from './Groups'
import { PageHeading } from './PageHeading'
import { Select, Sort } from './Sort'

interface GroupsPageProps {
  groups: Array<RxDocument<GroupInterface>>
  addGroup: AddGroup
}

const GroupsPage: React.SFC<GroupsPageProps> = ({ groups, addGroup }) => (
  <React.Fragment>
    <PageHeading
      title={'Groups'}
      action={
        <ActionButton onClick={() => addGroup({ name: 'Untitled' })}>
          <Add size={15} />
        </ActionButton>
      }
    />

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
          <div>No Groups yet.</div>
        </EmptyMessage>
      </EmptyContainer>
    )}
  </React.Fragment>
)

export default GroupsPage
