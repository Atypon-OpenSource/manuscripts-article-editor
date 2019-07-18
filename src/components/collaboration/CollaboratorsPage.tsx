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
import {
  AddIconContainer,
  AddIconHover,
  RegularAddIcon,
} from '../projects/ProjectsListPlaceholder'
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
  font-size: 20px;
  line-height: 28px;
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
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.5px;
`

const ActionButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  font-size: inherit;
  white-space: nowrap;
`

const ActionButtonText = styled.div`
  font-weight: 500;
  font-size: 24px;
  letter-spacing: -0.5px;
  color: ${props => props.theme.colors.global.text.primary};
  padding-left: 10px;
`

const Message = styled.div`
  max-width: 400px;
  font-size: 21px;
  margin-top: 25px;
  font-weight: 300px;
  color: ${props => props.theme.colors.textField.placeholder.default};

  @media (max-width: 850px) {
    margin-right: 20px;
    margin-left: 20px;
    max-width: 350px;
  }
`
const InfoMessage = styled(Message)`
  margin-top: 0px;
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
                <ActionButton onClick={handleAddCollaborator}>
                  <AddIconContainer>
                    <RegularAddIcon width={40} height={40} />
                    <AddIconHover width={40} height={40} />
                    <ActionButtonText>Add Collaborator</ActionButtonText>
                  </AddIconContainer>
                </ActionButton>
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
