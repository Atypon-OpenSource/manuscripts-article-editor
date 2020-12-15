/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

// @TODO Consider creating a separate presentational component
// @TODO Check if <Item onClick> callback should be moved out as a named callback

import LogotypeColor from '@manuscripts/assets/react/LogotypeColor'
import {
  Contributor,
  Manuscript,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import {
  CloseButton,
  ModalContainer,
  ModalHeader,
  PrimaryButton,
  ProjectIcon,
  SecondaryButton,
  StyledModal,
} from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Database } from '../components/DatabaseProvider'
import { PlaceholderTitle } from '../components/nav/Dropdown'
import { ModalBody } from '../components/Sidebar'
import config from '../config'
import ProjectsData from '../data/ProjectsData'
import { TokenActions } from '../data/TokenData'
import { usePickerContributorsData } from '../hooks/use-picker-contributors-data'
import { usePickerManuscriptDocs } from '../hooks/use-picker-manuscript-docs'
import { fetchProjectScopedToken } from '../lib/api'
import Sync from '../sync/Sync'
import { DropdownMenu } from './DropdownMenu'
import { Filter } from './Filter'
// type ProjectSelectable = Project

const lowestPriorityFirst = (
  a: Manuscript | Contributor,
  b: Manuscript | Contributor
) => {
  if (a.priority === b.priority) {
    return a.createdAt - b.createdAt
  }

  return Number(a.priority) - Number(b.priority)
}

const alphabetical = (a: Project, b: Project) => {
  if (!a.title) {
    return 1
  }

  if (!b.title) {
    return -1
  }

  return a.title.localeCompare(b.title)
}

interface AssocManuscripts {
  [key: string]: Manuscript[]
}

interface AssocNames {
  [key: string]: string
}

// Creating and array of string representing project names and manuscripts following that name
// e.g.: ['My project', Manuscript, Manuscript, 'Other Project', Manuscript, Manuscript, Manuscript]
export const groupManuscripts = (
  manuscripts: Manuscript[],
  projects: Project[]
) => {
  const names = projects.reduce((acc, project) => {
    acc[project._id] = project.title || 'Untitled Project'
    return acc
  }, {} as AssocNames)

  const groups = manuscripts.reduce((acc, item) => {
    const key = names[item.containerID]
    acc[key] = acc[key] || []
    acc[key].push(item)
    return acc
  }, {} as AssocManuscripts)

  return Object.keys(groups).reduce((acc, item) => {
    acc.push(item)
    acc.push(...groups[item].sort(lowestPriorityFirst))
    return acc
  }, [] as (Manuscript | string)[])
}

export const Picker: React.FC<{ db: Database; tokenActions: TokenActions }> = ({
  db,
  tokenActions,
}) => {
  const selectManuscript = useCallback(
    (manuscript: Manuscript, project: Project) => {
      const targetOrigin = window.parent.origin

      // validate target origin against whitelist from config
      if (!config.picker.origins.includes(targetOrigin)) {
        throw new Error('Origin not whitelisted')
      }

      fetchProjectScopedToken(project._id, 'export')
        .then((token) => {
          window.parent.postMessage(
            { type: 'selected-manuscript', manuscript, project, token },
            targetOrigin
          )
        })
        .catch((error) => {
          console.error(error) // tslint:disable-line:no-console
        })
    },
    []
  )

  const { data: contributors } = usePickerContributorsData()
  const { data: manuscripts } = usePickerManuscriptDocs()

  const maybeGroup = (items: Manuscript[], projects: Project[]) => {
    if (!selectedMenuProject) {
      groupManuscripts(items, projects)
    }
    return items.sort(lowestPriorityFirst)
  }

  const closeWindow = () => {
    const targetOrigin = window.parent.origin
    window.parent.postMessage({ type: 'close-window' }, targetOrigin)
  }
  const [selectedProject, setSelectedProject] = useState<Project>()
  const [
    selectedMenuProject,
    setSelectedMenuProject,
  ] = useState<Project | null>()
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript>()

  return (
    <ProjectsData>
      {(projects) => (
        <Sync
          collection={'picker'}
          channels={projects.map((project) => `${project._id}-metadata`)}
          db={db}
          tokenActions={tokenActions}
        >
          <StyledModal isOpen={true} shouldCloseOnOverlayClick={false}>
            <ModalContainer>
              <ModalHeader>
                <CloseButton
                  onClick={closeWindow}
                  data-cy={'modal-close-button'}
                />
              </ModalHeader>
              <Box>
                <Row>
                  <Column>
                    <Heading>
                      <LogotypeColor style={{ maxWidth: '100%' }} />
                    </Heading>
                    <Item
                      onClick={() => {
                        setSelectedMenuProject(null)
                        setSelectedManuscript(undefined)
                      }}
                      selected={!selectedMenuProject}
                    >
                      All manuscripts
                    </Item>
                    {[...projects].sort(alphabetical).map((project) => (
                      <Item
                        key={project._id}
                        onClick={() => {
                          setSelectedMenuProject(project)
                          setSelectedProject(undefined)
                          setSelectedManuscript(undefined)
                        }}
                        selected={selectedMenuProject === project}
                      >
                        {project.title ? (
                          <Title value={project.title} />
                        ) : (
                          <PlaceholderTitle value={'Untitled Project'} />
                        )}
                      </Item>
                    ))}
                  </Column>
                  <ProjectsColumn>
                    {projects.length && manuscripts?.length && (
                      <Filter
                        rows={manuscripts.filter((manuscript) =>
                          selectedMenuProject
                            ? manuscript.containerID === selectedMenuProject._id
                            : true
                        )}
                      >
                        {(filtered) => {
                          return maybeGroup(filtered, projects).map(
                            (manuscript) => {
                              if (typeof manuscript === 'string') {
                                return (
                                  <TitleItem key={manuscript}>
                                    {manuscript}
                                  </TitleItem>
                                )
                              }
                              return (
                                <Item
                                  key={manuscript._id}
                                  onClick={() => {
                                    setSelectedManuscript(manuscript)
                                    setSelectedProject(
                                      projects.find(
                                        (project) =>
                                          manuscript.containerID === project._id
                                      )
                                    )
                                  }}
                                  selected={selectedManuscript === manuscript}
                                >
                                  <IconWrapper>
                                    <ProjectIcon color="#FDCD47" />
                                  </IconWrapper>
                                  <ItemContent>
                                    {manuscript.title ? (
                                      <Title value={manuscript.title} />
                                    ) : (
                                      <PlaceholderTitle
                                        value={'Untitled Manuscript'}
                                      />
                                    )}
                                    <Contributors>
                                      {contributors &&
                                        contributors
                                          .filter(
                                            (contributor) =>
                                              contributor.manuscriptID ===
                                              manuscript._id
                                          )
                                          .sort(lowestPriorityFirst)
                                          .map(
                                            (contributor) =>
                                              `${contributor.bibliographicName.given} ${contributor.bibliographicName.family}`
                                          )}
                                    </Contributors>
                                  </ItemContent>
                                </Item>
                              )
                            }
                          )
                        }}
                      </Filter>
                    )}
                  </ProjectsColumn>
                </Row>
                <Footer>
                  <DropdownMenu />
                  <Actions>
                    <SecondaryButton onClick={closeWindow}>
                      Close
                    </SecondaryButton>
                    <PrimaryButton
                      disabled={!selectedProject || !selectedManuscript}
                      onClick={() => {
                        if (selectedProject && selectedManuscript) {
                          selectManuscript(selectedManuscript, selectedProject)
                        }
                      }}
                    >
                      Export
                    </PrimaryButton>
                  </Actions>
                </Footer>
              </Box>
            </ModalContainer>
          </StyledModal>
        </Sync>
      )}
    </ProjectsData>
  )
}

const Row = styled.div`
  min-height: 0;
  display: flex;
  flex: 1;
`

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px -2px 12px rgba(216, 216, 216, 0.2);
  padding: 16px;
`

const Box = styled(ModalBody)`
  overflow: hidden;
  display: flex;
  flex-flow: column;
  height: 615px;
  max-height: 100%;
  max-width: 790px;
`
const Column = styled.div`
  flex: 1;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;

  &:first-child {
    min-width: 260px;
    max-width: 33%;
    background: #fafafa;
  }

  &:not(:last-child) {
    border-right: 1px solid #ddd;
  }
`
const Item = styled.div<{ selected?: boolean }>`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;

  background: ${(props) => (props.selected ? '#F2FBFC' : 'transparent')};
  border-top: ${(props) => (props.selected ? '1px solid #bce7f6' : 'none')}
  border-bottom: ${(props) => (props.selected ? '1px solid #bce7f6' : 'none')}

  &:hover {
    background: ${(props) => (props.selected ? '#F2FBFC' : 'transparent')};
    border-bottom-color: white;
  }
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`
const TitleItem = styled(Item)`
  padding: 16px 16px 4px;
  border-bottom: none;
  font-weight: bold;
`

const ProjectsColumn = styled(Column)`
  padding: 1.5rem;
  ${Item} {
    padding-left: 0;
    padding-right: 0;
  }
`
const Heading = styled.div`
  font-weight: bold;
  font-size: 200%;
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;
`
const IconWrapper = styled.span`
  flex: 0 auto;
  margin-right: 0.5em;
`

const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  button + button {
    margin-left: 0.5rem;
  }
`
const Contributors = styled.div`
  margin-top: 0.5rem;
  color: #6e6e6e;
`
const ItemContent = styled.div`
  color: inherit;
`
