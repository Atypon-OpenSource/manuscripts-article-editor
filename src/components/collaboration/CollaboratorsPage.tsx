import AddAuthor from '@manuscripts/assets/react/AddAuthor'
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
import { CollaboratorForm } from './CollaboratorForm'

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
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
`

const ProjectTitle = styled.div`
  font-size: 18px;
  font-weight: 300;
  padding: 15px 0;
  color: ${props => props.theme.colors.global.text.secondary};
`

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;
  border: none;
  font-size: inherit;
  white-space: nowrap;

  &:hover use {
    fill: ${props => props.theme.colors.collaborators.actionButton};
  }
`

const ActionButtonText = styled.div`
  font-weight: 500;
  font-size: 26px;
  color: ${props => props.theme.colors.global.text.primary};
`

const Message = styled.div`
  max-width: 400px;
  font-size: 21px;
  padding: 15px 0;
  font-weight: 300;
  color: ${props => props.theme.colors.global.text.secondary};

  @media (max-width: 850px) {
    margin-right: 20px;
    margin-left: 20px;
    max-width: 350px;
  }
`

const AddButtonIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
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
      <OuterContainer>
        <InnerContainer>
          {collaboratorsCount > 1 || !isOwner(project, user.userID) ? (
            <InnerContainer>
              <Placeholder>
                <ContributorDetails />
              </Placeholder>

              <ProjectTitle>{project.title}</ProjectTitle>

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

              <ProjectTitle>{project.title}</ProjectTitle>

              <Action>
                <ActionButton onClick={handleAddCollaborator}>
                  <AddButtonIcon>
                    <AddAuthor />
                  </AddButtonIcon>
                  <ActionButtonText>Add Collaborator</ActionButtonText>
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
  project: Project
  addedCollaboratorsCount: number
}

interface AddAuthorsPageProps {
  addedAuthorsCount: number
}

export const AddCollaboratorsPage: React.FunctionComponent<
  AddCollaboratorsPageProps
> = ({ project, addedCollaboratorsCount }) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <ContributorsPlaceholder />
      </Placeholder>

      <ProjectTitle>{project.title}</ProjectTitle>

      {addedCollaboratorsCount ? (
        <React.Fragment>
          <Action>Add Collaborator</Action>

          <Message>
            <AddedCollaboratorsMessage addedCount={addedCollaboratorsCount} />
          </Message>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Message>
            <AddCollaboratorsMessage />
          </Message>
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
        <MessageContainer>
          <IconContainer>
            <AddedIcon />
          </IconContainer>

          <Message>
            <AddedAuthorsMessage addedCount={addedAuthorsCount} />
          </Message>
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
  <OuterContainerModal>
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

interface InviteCollaboratorsPageProps {
  project: Project
}

export const InviteCollaboratorsPage: React.FunctionComponent<
  InviteCollaboratorsPageProps
> = ({ project }) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <InvitationPlaceholder />
      </Placeholder>

      <ProjectTitle>{project.title}</ProjectTitle>

      <Action>Invite New Collaborator</Action>

      <Message>
        <InviteCollaboratorsMessage />
      </Message>
    </InnerContainer>
  </OuterContainer>
)

export const InviteCollaboratorsModal: React.FunctionComponent<
  InviteCollaboratorsPageProps
> = ({ project }) => (
  <OuterContainerModal>
    <InnerContainer>
      <Placeholder>
        <InvitationPlaceholder />
      </Placeholder>

      <ProjectTitle>{project.title}</ProjectTitle>

      <Action>Invite New Collaborator</Action>

      <Message>
        <InviteCollaboratorsMessage />
      </Message>
    </InnerContainer>
  </OuterContainerModal>
)

interface SearchCollaboratorsPageProps {
  project: Project
  searchText: string
}

export const SearchCollaboratorsPage: React.FunctionComponent<
  SearchCollaboratorsPageProps
> = ({ project, searchText }) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <ContributorSearchPlaceholder />
      </Placeholder>

      <ProjectTitle>{project.title}</ProjectTitle>

      <Message>No matches in the People list</Message>

      <Message>
        <CheckCollaboratorsSearchMessage searchText={searchText} />
      </Message>
    </InnerContainer>
  </OuterContainer>
)
