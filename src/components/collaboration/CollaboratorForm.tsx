import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { Affiliation, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { Avatar } from '../Avatar'

const DetailsContainer = styled.div`
  padding: 14px 0px 0px 40px;
  width: 65%;
`

const InfoContainer = styled.div`
  position: absolute;
  bottom: 15px;
  width: inherit;
`

const NameField = styled.div`
  display: inline-flex;
  font-size: 24px;
  font-weight: normal;
  color: #353535;
  margin-bottom: 26px;
`

const EmailContainer = styled.div`
  font-size: 17px;
  font-weight: 500;
  margin: 15px;
  position: relative;
  top: 9px;
`

const CollaboratorInformationContainer = styled.div`
  display: flex;
  padding-bottom: 40px;
`

const Legend = styled.div`
  font-size: 20px;
  font-weight: 500;
  padding-bottom: 19px;
`

const EmptyFieldText = styled.div`
  font-size: 16px;
  color: #353535;
  opacity: 0.3;
  padding-left: 1px;
`

const AffiliationLabel = styled.div`
  font-size: 16px;
  color: #353535;
  padding: 3px 5px;
  background: #e2e8ee;
  border-radius: 4px;
  display: inline-flex;
  margin-right: 7px;
  margin-bottom: 7px;
`

const AffiliationGroupContainer = styled.div`
  max-width: 600px;
`

interface CollaboratorProps {
  collaborator: UserProfileWithAvatar
  user: UserProfile
  affiliations: Affiliation[] | null
  manageProfile: () => void
}

export const CollaboratorForm: React.FunctionComponent<CollaboratorProps> = ({
  collaborator,
  manageProfile,
  user,
  affiliations,
}) => (
  <DetailsContainer>
    <NameField>
      {`${collaborator.bibliographicName.given} ${
        collaborator.bibliographicName.family
      }`}
    </NameField>
    <CollaboratorInformationContainer>
      <Avatar size={74} src={collaborator.avatar} />
      <div>
        <EmailContainer>{collaborator.email}</EmailContainer>
      </div>
    </CollaboratorInformationContainer>
    <Legend>Affiliations</Legend>
    {!affiliations ? (
      <EmptyFieldText>No Affiliations</EmptyFieldText>
    ) : (
      <AffiliationGroupContainer>
        {affiliations.map(affiliation => (
          <AffiliationLabel>{affiliation.institution}</AffiliationLabel>
        ))}
      </AffiliationGroupContainer>
    )}

    {collaborator.userID === user.userID && (
      <InfoContainer>
        <AlertMessage
          type={AlertMessageType.info}
          dismissButton={{ text: 'Manage profile', action: manageProfile }}
        >
          These are your details.
        </AlertMessage>
      </InfoContainer>
    )}
  </DetailsContainer>
)
