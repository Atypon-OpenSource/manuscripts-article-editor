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

import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import AuthorPlaceholder from '@manuscripts/assets/react/AuthorPlaceholder'
import ContributorDetails from '@manuscripts/assets/react/ContributorDetailsPlaceholder'
import ContributorSearchPlaceholder from '@manuscripts/assets/react/ContributorSearchPlaceholder'
import ContributorsPlaceholder from '@manuscripts/assets/react/ContributorsPlaceholder'
import InvitationPlaceholder from '@manuscripts/assets/react/InvitationPlaceholder'
import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { isOwner } from '../../lib/roles'
import { styled } from '../../theme/styled-components'
import { AddButton } from '../AddButton'
import {
  AddAuthorsMessage,
  AddCollaboratorsMessage,
  AddedAuthorsMessage,
  AddedCollaboratorsMessage,
  CheckCollaboratorsSearchMessage,
  InviteCollaboratorsMessage,
  SelectAuthorMessage,
  SelectCollaboratorMessage,
} from '../Messages'
import { CollaboratorForm } from './CollaboratorForm'

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
`

const OuterContainerModal = styled(OuterContainer)`
  height: 65vh;
`

const InnerContainer = styled.div`
  text-align: center;
  max-width: 480px;
  font-size: ${props => props.theme.font.size.xlarge};
  line-height: ${props => props.theme.font.lineHeight.large};
`

const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 20px;
`

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.medium};
  letter-spacing: -0.5px;
`

const Message = styled.div`
  max-width: 400px;
  font-size: ${props => props.theme.font.size.xlarge};
  margin-top: ${props => props.theme.grid.unit * 6}px;
  font-weight: ${props => props.theme.font.weight.light};
  color: ${props => props.theme.colors.text.secondary};

  @media (max-width: 850px) {
    margin-right: ${props => props.theme.grid.unit * 5}px;
    margin-left: ${props => props.theme.grid.unit * 5}px;
    max-width: 350px;
  }
`
const InfoMessage = styled(Message)`
  margin-top: 0;
`

const AddedMessage = styled(Message)`
  margin-top: 2px;
`
interface CollaboratorDetailsPageProps {
  user: UserProfile
  project: Project
  collaboratorsCount: number
  selectedCollaborator: UserProfile | null
  manageProfile: () => void
  handleAddCollaborator: () => void
}

export const CollaboratorDetailsPage: React.FunctionComponent<
  CollaboratorDetailsPageProps
> = ({
  project,
  user,
  collaboratorsCount,
  handleAddCollaborator,
  selectedCollaborator,
  manageProfile,
}) => (
  <React.Fragment>
    {selectedCollaborator ? (
      <CollaboratorForm
        collaborator={selectedCollaborator}
        user={user}
        manageProfile={manageProfile}
        affiliations={null}
      />
    ) : (
      <OuterContainer data-cy={'collaborators-page'}>
        <InnerContainer>
          {collaboratorsCount > 1 || !isOwner(project, user.userID) ? (
            <InnerContainer>
              <Placeholder>
                <ContributorDetails />
              </Placeholder>

              <Action>Collaborator Details</Action>

              <Message>
                <SelectCollaboratorMessage />
              </Message>
            </InnerContainer>
          ) : (
            <InnerContainer>
              <Placeholder>
                <ContributorsPlaceholder />
              </Placeholder>

              <Action>
                <AddButton
                  action={handleAddCollaborator}
                  title="Add Collaborator"
                  size={'large'}
                />
              </Action>

              <Message>
                <AddCollaboratorsMessage />
              </Message>
            </InnerContainer>
          )}
        </InnerContainer>
      </OuterContainer>
    )}
  </React.Fragment>
)

interface AddCollaboratorsPageProps {
  addedCollaboratorsCount: number
}

interface AddAuthorsPageProps {
  addedAuthorsCount: number
}

export const AddCollaboratorsPage: React.FunctionComponent<
  AddCollaboratorsPageProps
> = ({ addedCollaboratorsCount }) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <ContributorsPlaceholder />
      </Placeholder>

      {addedCollaboratorsCount ? (
        <React.Fragment>
          <Action>Add Collaborator</Action>

          <Message>
            <AddedCollaboratorsMessage addedCount={addedCollaboratorsCount} />
          </Message>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <InfoMessage>
            <AddCollaboratorsMessage />
          </InfoMessage>
        </React.Fragment>
      )}
    </InnerContainer>
  </OuterContainer>
)

const IconContainer = styled.div`
  display: flex;
  align-self: center;
  padding-right: 5px;
`

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const AddAuthorsPage: React.FunctionComponent<AddAuthorsPageProps> = ({
  addedAuthorsCount,
}) => (
  <OuterContainerModal>
    <InnerContainer>
      <Placeholder>
        <AuthorPlaceholder />
      </Placeholder>

      {addedAuthorsCount ? (
        <MessageContainer data-cy={'add-author-message'}>
          <IconContainer>
            <AddedIcon />
          </IconContainer>

          <AddedMessage>
            <AddedAuthorsMessage addedCount={addedAuthorsCount} />
          </AddedMessage>
        </MessageContainer>
      ) : (
        <React.Fragment>
          <Action>Add Author</Action>
          <Message>
            <AddAuthorsMessage />
          </Message>
        </React.Fragment>
      )}
    </InnerContainer>
  </OuterContainerModal>
)

export const AuthorDetailsPage: React.FunctionComponent = () => (
  <OuterContainerModal data-cy={'author-details'}>
    <InnerContainer>
      <Placeholder>
        <ContributorDetails />
      </Placeholder>

      <React.Fragment>
        <Action>Author Details</Action>
        <Message>
          <SelectAuthorMessage />
        </Message>
      </React.Fragment>
    </InnerContainer>
  </OuterContainerModal>
)

export const InviteCollaboratorsPage: React.FunctionComponent = () => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <InvitationPlaceholder />
      </Placeholder>

      <Action>Invite New Collaborator</Action>

      <Message>
        <InviteCollaboratorsMessage />
      </Message>
    </InnerContainer>
  </OuterContainer>
)

export const InviteCollaboratorsModal: React.FunctionComponent = () => (
  <OuterContainerModal>
    <InnerContainer>
      <Placeholder>
        <InvitationPlaceholder />
      </Placeholder>

      <Action>Invite New Collaborator</Action>

      <Message>
        <InviteCollaboratorsMessage />
      </Message>
    </InnerContainer>
  </OuterContainerModal>
)

interface SearchCollaboratorsPageProps {
  searchText: string
}

export const SearchCollaboratorsPage: React.FunctionComponent<
  SearchCollaboratorsPageProps
> = ({ searchText }) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <ContributorSearchPlaceholder />
      </Placeholder>

      <InfoMessage>No matches found</InfoMessage>

      <Message>
        <CheckCollaboratorsSearchMessage searchText={searchText} />
      </Message>
    </InnerContainer>
  </OuterContainer>
)
