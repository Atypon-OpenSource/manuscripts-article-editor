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
import {
  BibliographicName,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { TickMarkIcon } from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { Route } from 'react-router-dom'
import { buildCollaborators } from '../../lib/collaborators'
import { projectListCompare } from '../../lib/projects'
import { styled } from '../../theme/styled-components'
import ShareProjectButton from '../collaboration/ShareProjectButton'
import ProjectContextMenuButton from './ProjectContextMenuButton'

const SidebarProject = styled.div<{ isActive: boolean }>`
  padding: 16px;
  margin: 0 -16px;
  width: 500px;
  border-radius: ${props => (props.isActive ? '4px' : 0)};
  cursor: pointer;

  background-color: ${props =>
    props.isActive
      ? props.theme.colors.projects.background.hovered
      : 'transparent'};

  border-width: 1px;
  border-style: solid;
  border-color: ${props =>
    props.isActive
      ? props.theme.colors.projects.border.hovered
      : 'transparent'};
  border-bottom-color: #eaecee;

  &:hover {
    background-color: ${props =>
      props.theme.colors.projects.background.hovered};
    border-color: ${props => props.theme.colors.projects.border.hovered};
    border-radius: 4px;
  }

  @media (max-width: 450px) {
    width: unset;
  }
`

const SidebarProjectHeader = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 450px) {
    margin-left: 7px;
  }
`

const ProjectTitle = styled.div`
  font-size: 19px;
  font-weight: 500;
  font-style: normal;
  flex: 1;
`

const ProjectContributors = styled.div`
  font-size: 15px;
  margin-top: 8px;

  @media (max-width: 450px) {
    margin-left: 7px;
  }
`

const PlaceholderTitle = styled(Title)`
  color: ${props => props.theme.colors.title.placeholder};
`

const ProjectContributor = styled.span``

const Edit = styled.div`
  margin-bottom: 5px;
`
const AcceptedLabel = styled.div`
  display: flex;
  align-items: center;
  color: white;
  background: ${props => props.theme.colors.label.success};
  padding: 2px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-right: 7px;
`
const TickMarkContainer = styled.div`
  display: flex;
  padding-right: 3px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 450px) {
    margin-left: 7px;
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
  collaborators: Map<string, UserProfileWithAvatar>
  user: UserProfileWithAvatar
  closeModal?: () => void
  acceptedInvitations: string[]
}

export const ProjectsList: React.FunctionComponent<Props> = ({
  closeModal,
  collaborators,
  deleteProject,
  projects,
  saveProjectTitle,
  user,
  acceptedInvitations,
}) => (
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
                onClick={event => {
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
                    <ShareProjectButton project={project} user={user} />
                  </Container>
                </SidebarProjectHeader>

                <ProjectContributors>
                  {buildCollaborators(project, collaborators).map(
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
