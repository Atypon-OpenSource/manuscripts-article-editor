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
import {
  BibliographicName,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { TickMarkIcon } from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { Route } from 'react-router-dom'
import CollaboratorsData from '../../data/CollaboratorsData'
import { TokenActions } from '../../data/TokenData'
import {
  buildCollaboratorProfiles,
  buildCollaborators,
} from '../../lib/collaborators'
import { projectListCompare } from '../../lib/projects'
import { styled } from '../../theme/styled-components'
import ShareProjectButton from '../collaboration/ShareProjectButton'
import ProjectContextMenuButton from './ProjectContextMenuButton'

const SidebarProject = styled.div<{ isActive: boolean }>`
  padding: ${props => props.theme.grid.unit * 4}px;
  margin: 0 -${props => props.theme.grid.unit * 4}px;
  width: 500px;
  border-radius: 0;
  cursor: pointer;

  background-color: ${props =>
    props.isActive ? props.theme.colors.background.fifth : 'transparent'};

  border-top: 1px solid transparent;
  border-bottom: 1px solid ${props => props.theme.colors.border.secondary};

  &:hover {
    border-color: ${props => props.theme.colors.border.primary};
    background-color: ${props => props.theme.colors.background.fifth};
  }

  @media (max-width: 450px) {
    width: unset;
  }
`

const SidebarProjectHeader = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 450px) {
    margin-left: ${props => props.theme.grid.unit * 2}px;
  }
`

const ProjectTitle = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.medium};
  font-style: normal;
  flex: 1;
`

const ProjectContributors = styled.div`
  font-size: ${props => props.theme.font.size.medium};
  margin-top: ${props => props.theme.grid.unit * 2}px;

  @media (max-width: 450px) {
    margin-left: ${props => props.theme.grid.unit * 2}px;
  }
`

const PlaceholderTitle = styled(Title)`
  color: ${props => props.theme.colors.text.secondary};
`

const ProjectContributor = styled.span``

const Edit = styled.div`
  button {
    padding: ${props => props.theme.grid.unit * 2}px;
  }

  svg {
    g[fill] {
      fill: ${props => props.theme.colors.brand.default};
    }
  }
`
const AcceptedLabel = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.onDark};
  background: ${props => props.theme.colors.text.success};
  padding: 2px ${props => props.theme.grid.unit * 2}px;
  border-radius: ${props => props.theme.grid.radius.small};
  text-transform: uppercase;
  margin-right: ${props => props.theme.grid.unit * 2}px;
`
const TickMarkContainer = styled.div`
  display: flex;
  padding-right: ${props => props.theme.grid.unit}px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 450px) {
    margin-left: ${props => props.theme.grid.unit * 2}px;
  }
`
const initials = (name: BibliographicName): string =>
  name.given
    ? name.given
        .split(' ')
        .map(part => part.substr(0, 1).toUpperCase() + '.')
        .join('')
    : ''

interface Props {
  deleteProject: (project: Project) => () => Promise<string>
  projects: Project[]
  saveProjectTitle: (project: Project) => (title: string) => Promise<Project>
  user: UserProfileWithAvatar
  closeModal?: () => void
  acceptedInvitations: string[]
  tokenActions: TokenActions
}

export const ProjectsList: React.FunctionComponent<Props> = ({
  closeModal,
  deleteProject,
  projects,
  saveProjectTitle,
  user,
  acceptedInvitations,
  tokenActions,
}) => (
  <CollaboratorsData>
    {collaborators => {
      const collaboratorProfiles = buildCollaboratorProfiles(
        collaborators,
        user
      )

      return (
        <div>
          {projects.sort(projectListCompare).map(project => {
            const path = `/projects/${project._id}`

            return (
              <Route
                path={path}
                exact={false}
                key={project._id}
                children={({ history, match }) => {
                  return (
                    <SidebarProject
                      key={project._id}
                      isActive={match !== null}
                      onClick={() => {
                        closeModal && closeModal()
                        history.push(path)
                      }}
                    >
                      <SidebarProjectHeader>
                        <ProjectTitle>
                          {project.title ? (
                            <Title value={project.title} />
                          ) : (
                            <PlaceholderTitle value={'Untitled Project'} />
                          )}
                        </ProjectTitle>
                        {acceptedInvitations.includes(project._id) && (
                          <AcceptedLabel>
                            <TickMarkContainer>
                              <TickMarkIcon />
                            </TickMarkContainer>
                            Accepted
                          </AcceptedLabel>
                        )}
                        <Container>
                          <Edit>
                            <ProjectContextMenuButton
                              project={project}
                              deleteProject={deleteProject(project)}
                              saveProjectTitle={saveProjectTitle(project)}
                              closeModal={closeModal}
                            />
                          </Edit>
                          <ShareProjectButton
                            project={project}
                            user={user}
                            tokenActions={tokenActions}
                          />
                        </Container>
                      </SidebarProjectHeader>

                      <ProjectContributors>
                        {buildCollaborators(project, collaboratorProfiles).map(
                          (collaborator, index) => (
                            <React.Fragment key={collaborator._id}>
                              {!!index && ', '}
                              <ProjectContributor key={collaborator._id}>
                                {initials(collaborator.bibliographicName)}{' '}
                                {collaborator.bibliographicName.family}
                              </ProjectContributor>
                            </React.Fragment>
                          )
                        )}
                      </ProjectContributors>
                    </SidebarProject>
                  )
                }}
              />
            )
          })}
        </div>
      )
    }}
  </CollaboratorsData>
)
