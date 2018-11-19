import AuthorPlaceholder from '@manuscripts/assets/react/AuthorPlaceholder'
import ContributorSearchPlaceholder from '@manuscripts/assets/react/ContributorSearchPlaceholder'
import ContributorsPlaceholder from '@manuscripts/assets/react/ContributorsPlaceholder'
import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import AddAuthor from '../../icons/add-author'
import AddedIcon from '../../icons/added-icon'
import ContributorDetails from '../../icons/contributor-details-placeholder'
import InvitationPlaceholder from '../../icons/invitation-placeholder'
import { isOwner } from '../../lib/roles'
import { styled } from '../../theme'
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
  color: #949494;
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
`

const ActionButtonText = styled.div`
  font-weight: 500;
  font-size: 26px;
  color: #353535;
`

const Message = styled.div`
  font-size: 21px;
  padding: 15px 0;
  font-weight: 300;
  color: #949494;

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

export const CollaboratorDetailsPage: React.SFC<
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
          {collaboratorsCount || !isOwner(project, user.userID) ? (
            <InnerContainer>
              <Placeholder>
                <ContributorDetails size={500} />
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

export const AddCollaboratorsPage: React.SFC<AddCollaboratorsPageProps> = ({
  project,
  addedCollaboratorsCount,
}) => (
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

export const AddAuthorsPage: React.SFC<AddAuthorsPageProps> = ({
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

export const AuthorDetailsPage: React.SFC = () => (
  <OuterContainerModal>
    <InnerContainer>
      <Placeholder>
        <ContributorDetails size={500} />
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

export const InviteCollaboratorsPage: React.SFC<
  InviteCollaboratorsPageProps
> = ({ project }) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <InvitationPlaceholder size={500} />
      </Placeholder>

      <ProjectTitle>{project.title}</ProjectTitle>

      <Action>Invite New Collaborator</Action>

      <Message>
        <InviteCollaboratorsMessage />
      </Message>
    </InnerContainer>
  </OuterContainer>
)

export const InviteCollaboratorsModal: React.SFC<
  InviteCollaboratorsPageProps
> = ({ project }) => (
  <OuterContainerModal>
    <InnerContainer>
      <Placeholder>
        <InvitationPlaceholder size={500} />
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

export const SearchCollaboratorsPage: React.SFC<
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
