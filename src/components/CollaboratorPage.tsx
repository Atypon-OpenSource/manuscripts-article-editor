import * as React from 'react'
import { RxDocument } from 'rxdb'
import { styled } from '../theme'
import { Collaborator, Manuscript } from '../types/components'
import { Button } from './Button'

const CollaboratorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

const CollaboratorMetadata = styled.div`
  padding: 10px 20px;
  margin: 0 40px;
`

const CollaboratorSection = styled.div`
  margin: 20px 0;
`

const CollaboratorSectionHeading = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 29px;
`

const CollaboratorSectionContent = styled.div`
  color: #333;
`

const Collaborator = styled.div`
  display: flex;
  margin-bottom: 10px;
`

const CollaboratorImage = styled.img`
  display: block;
  border-radius: 50%;
  background: gray;
  width: 60px;
  height: 60px;
  margin-right: 20px;
`

const CollaboratorInfo = styled.div`
  flex: 1;
`

const CollaboratorInfoSection = styled.div`
  margin-bottom: 10px;
`

const CollaboratorNameParts = CollaboratorInfoSection.extend`
  display: flex;
  font-size: 30px;
  line-height: 36px;
  margin-bottom: 10px;
`

const CollaboratorName = styled.div``

const CollaboratorSurname = styled.span`
  font-weight: 600;
`

const CollaboratorEmail = CollaboratorInfoSection.extend`
  font-size: 15px;
  font-weight: 500;
`

const CollaboratorTel = CollaboratorInfoSection.extend`
  font-size: 15px;
  font-weight: 300;
`

interface CollaboratorManuscriptProps {
  manuscript: Manuscript
}

const CollaboratorManuscript: React.SFC<CollaboratorManuscriptProps> = ({
  manuscript,
}) => <div>{manuscript.title}</div>

interface CollaboratorPageProps {
  collaborator: RxDocument<Collaborator>
  manuscripts: Array<RxDocument<Manuscript>>
  startEditing: () => void
}

const CollaboratorPage: React.SFC<CollaboratorPageProps> = ({
  collaborator,
  manuscripts,
  startEditing,
}) => (
  <CollaboratorContainer>
    <CollaboratorMetadata>
      <Collaborator>
        <CollaboratorImage src={collaborator.image} />

        <CollaboratorInfo>
          <CollaboratorNameParts>
            <CollaboratorName>{collaborator.name}</CollaboratorName>{' '}
            <CollaboratorSurname>{collaborator.surname}</CollaboratorSurname>
          </CollaboratorNameParts>
          <CollaboratorEmail>{collaborator.email}</CollaboratorEmail>
          <CollaboratorTel>{collaborator.tel}</CollaboratorTel>
        </CollaboratorInfo>

        <div>
          <Button onClick={startEditing}>Manage</Button>
        </div>
      </Collaborator>

      <CollaboratorSection>
        <CollaboratorSectionHeading>Manuscripts</CollaboratorSectionHeading>

        <CollaboratorSectionContent>
          {manuscripts &&
            manuscripts.map((manuscript: Manuscript) => (
              <CollaboratorManuscript
                key={manuscript.id}
                manuscript={manuscript}
              />
            ))}
        </CollaboratorSectionContent>
      </CollaboratorSection>
    </CollaboratorMetadata>
  </CollaboratorContainer>
)

export default CollaboratorPage
