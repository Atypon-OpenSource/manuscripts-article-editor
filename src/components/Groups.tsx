import * as React from 'react'
import { Link } from 'react-router-dom'
import { RxDocument } from 'rxdb'
import { styled } from '../theme'
import { GroupActions, GroupInterface, RemoveGroup } from '../types/group'
import { Person } from '../types/person'
import { Button } from './Button'
import { Contributor } from './Contributor'

export const GroupsContainer = styled.div`
  padding: 20px 20px;
`

export const GroupContainer = styled(Link)`
  padding: 10px 10px;
  cursor: pointer;
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
  display: block;

  &:hover {
    background-color: #f1f8ff;
  }
`

const GroupSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
`

const GroupTitle = styled.span`
  opacity: 0.75;
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
`

const GroupContributors = styled.div``

const DeleteButton = Button.extend`
  color: #ddd;
  font-size: 8px;
`

export interface GroupProps {
  group: RxDocument<GroupInterface>
  contributors: Person[]
  removeGroup: RemoveGroup
}

export const Group: React.SFC<GroupProps> = ({
  group,
  contributors,
  removeGroup,
}) => (
  <GroupContainer to={`/group/${group._id}`}>
    <GroupSection>
      <GroupTitle>{group.name}</GroupTitle>
    </GroupSection>

    <GroupSection>
      <GroupContributors>
        {contributors.map(contributor => (
          <Contributor contributor={contributor} />
        ))}
      </GroupContributors>

      <DeleteButton onClick={removeGroup(group)}>Delete</DeleteButton>
    </GroupSection>
  </GroupContainer>
)

export interface GroupsProps {
  groups: Array<RxDocument<GroupInterface>>
}

export const Groups: React.SFC<GroupsProps & GroupActions> = ({
  groups,
  removeGroup,
}) => (
  <GroupsContainer>
    {groups.map(group => (
      <Group
        key={group._id}
        group={group}
        contributors={[]}
        removeGroup={removeGroup}
      />
    ))}
  </GroupsContainer>
)
