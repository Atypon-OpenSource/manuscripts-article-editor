/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Affiliation, UserProfile } from '@manuscripts/manuscripts-json-schema'
import {
  AlertMessage,
  AlertMessageType,
  Avatar,
} from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'

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
  color: ${props => props.theme.colors.global.text.primary};
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
  color: ${props => props.theme.colors.global.text.primary};
  opacity: 0.3;
  padding-left: 1px;
`

const AffiliationLabel = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.label.text};
  padding: 3px 5px;
  background: ${props => props.theme.colors.label.primary};
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
          <AffiliationLabel key={affiliation._id}>
            {affiliation.institution}
          </AffiliationLabel>
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
