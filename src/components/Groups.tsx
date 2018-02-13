import * as React from 'react'
import { styled } from '../theme'
import { GroupInterface } from '../types/group'

export const GroupsContainer = styled('div')``

export const GroupContainer = styled('div')`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.primary};
  }
`

const GroupName = styled('div')`
  flex: 1;
  font-size: 20px;
  line-height: 22px;
`

export interface GroupProps {
  group: GroupInterface
}

export const Group: React.SFC<GroupProps> = ({ group }) => (
  <GroupContainer>
    <GroupName>{group.name}</GroupName>
  </GroupContainer>
)

export interface GroupsProps {
  groups: GroupInterface[]
}

export const Groups: React.SFC<GroupsProps> = ({ groups }) => (
  <GroupsContainer>
    {groups.map(group => <Group key={group._id} group={group} />)}
  </GroupsContainer>
)
