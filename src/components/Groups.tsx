import * as React from 'react'
import { Link } from 'react-router-dom'
import { RxDocument } from 'rxdb'
import { styled } from '../theme'
import { GroupInterface } from '../types/group'
import { Person } from '../types/person'
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

export interface GroupProps {
  group: RxDocument<GroupInterface>
  contributors: Person[]
}

export const Group: React.SFC<GroupProps> = ({ group, contributors }) => (
  <GroupContainer to={`/groups/${group._id}`}>
    <GroupSection>
      <GroupTitle>{group.name}</GroupTitle>
    </GroupSection>

    <GroupSection>
      <GroupContributors>
        {contributors.map(contributor => (
          <Contributor contributor={contributor} />
        ))}
      </GroupContributors>
    </GroupSection>
  </GroupContainer>
)

export interface GroupsProps {
  groups: Array<RxDocument<GroupInterface>>
}

export const Groups: React.SFC<GroupsProps> = ({ groups }) => (
  <GroupsContainer>
    {groups.map(group => (
      <Group key={group._id} group={group} contributors={[]} />
    ))}
  </GroupsContainer>
)
