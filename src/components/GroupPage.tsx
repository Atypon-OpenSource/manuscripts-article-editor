import * as React from 'react'
import { styled } from '../theme'
import { CollaboratorDocument } from '../types/collaborator'
import { Manuscript, Person } from '../types/components'
import { GroupDocument } from '../types/group'
import { ManuscriptDocument } from '../types/manuscript'
import { Button } from './Button'

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

const GroupMetadata = styled.div`
  padding: 10px 20px;
  margin: 0 40px;
`

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const GroupName = styled.div`
  margin-bottom: 10px;
  font-size: 30px;
  line-height: 36px;
  font-weight: bold;
`

const GroupSection = styled.div`
  margin: 20px 0;
`

const GroupSectionHeading = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 29px;
`

const GroupSectionContent = styled.div`
  color: #333;
`

interface GroupMemberProps {
  member: Person
}

const GroupMember: React.SFC<GroupMemberProps> = ({ member }) => (
  <div>
    <img src={member.image} />
    <div>{member.name}</div>
  </div>
)

interface GroupManuscriptProps {
  manuscript: Manuscript
}

const GroupManuscript: React.SFC<GroupManuscriptProps> = ({ manuscript }) => (
  <div>{manuscript.title}</div>
)

interface GroupPageProps {
  group: GroupDocument
  members: CollaboratorDocument[]
  manuscripts: ManuscriptDocument[]
  startEditing: () => void
}

const GroupPage: React.SFC<GroupPageProps> = ({
  group,
  members,
  manuscripts,
  startEditing,
}) => (
  <GroupContainer>
    <GroupMetadata>
      <GroupHeader>
        <GroupName>{group.name}</GroupName>
        <Button onClick={startEditing}>Manage</Button>
      </GroupHeader>

      <GroupSection>
        <GroupSectionHeading>Description</GroupSectionHeading>

        <GroupSectionContent>{group.description}</GroupSectionContent>
      </GroupSection>

      <GroupSection>
        <GroupSectionHeading>Members</GroupSectionHeading>

        <GroupSectionContent>
          {members &&
            members.map((member: Person) => (
              <GroupMember key={member.id} member={member} />
            ))}
        </GroupSectionContent>
      </GroupSection>

      <GroupSection>
        <GroupSectionHeading>Manuscripts</GroupSectionHeading>

        <GroupSectionContent>
          {manuscripts &&
            manuscripts.map((manuscript: Manuscript) => (
              <GroupManuscript key={manuscript.id} manuscript={manuscript} />
            ))}
        </GroupSectionContent>
      </GroupSection>
    </GroupMetadata>
  </GroupContainer>
)

export default GroupPage
