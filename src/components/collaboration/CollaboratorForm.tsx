/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
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
  bottom: ${props => props.theme.grid.unit * 4}px;
  width: inherit;
`

const NameField = styled.div`
  display: inline-flex;
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.normal};
  color: ${props => props.theme.colors.text.primary};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 26px;
`

const EmailContainer = styled.div`
  font-size: ${props => props.theme.font.size.large};
  font-weight: ${props => props.theme.font.weight.medium};
  margin: ${props => props.theme.grid.unit * 4}px;
  position: relative;
  top: ${props => props.theme.grid.unit * 2}px;
`

const CollaboratorInformationContainer = styled.div`
  display: flex;
  padding-bottom: 40px;
`

const Legend = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.medium};
  padding-bottom: ${props => props.theme.grid.unit * 5}px;
`

const EmptyFieldText = styled.div`
  font-size: ${props => props.theme.font.size.large};
  color: ${props => props.theme.colors.text.primary};
  opacity: 0.3;
  padding-left: 1px;
`

const AffiliationLabel = styled.div`
  font-size: ${props => props.theme.font.size.large};
  color: ${props => props.theme.colors.text.primary};
  padding: 3px 5px;
  background: ${props => props.theme.colors.brand.light};
  border-radius: ${props => props.theme.grid.radius.small};
  display: inline-flex;
  margin-right: ${props => props.theme.grid.unit * 2}px;
  margin-bottom: ${props => props.theme.grid.unit * 2}px;
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
      {`${collaborator.bibliographicName.given} ${collaborator.bibliographicName.family}`}
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
