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

import { Title } from '@manuscripts/title-editor'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { version } from '../../../package.json'
import config from '../../config'
import ProjectsData from '../../data/ProjectsData'
import { styled } from '../../theme/styled-components'
import { GlobalMenu } from '../nav/GlobalMenu'
import { Main, Page } from '../Page'
import { StorageInfo } from './StorageInfo'

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
`

const Diagnostics = styled.div`
  padding: 0 ${props => props.theme.grid.unit * 4}px;
`

const RowHeader = styled.th`
  text-align: right;
`

const ProjectsList = styled.div`
  padding: ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 5}px;
`

const ProjectLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  padding: ${props => props.theme.grid.unit}px;

  &:hover {
    text-decoration: underline;
  }
`

const ProjectTitle = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.medium};
  font-style: normal;
  flex: 1;
`

const PlaceholderTitle = styled(Title)`
  color: ${props => props.theme.colors.text.secondary};
`

const DiagnosticsPageContainer: React.FunctionComponent = () => {
  const [apiVersion, setApiVersion] = useState<string>()
  const [gatewayVersion, setGatewayVersion] = useState<string>()

  useEffect(() => {
    fetch(`${config.api.url}/app/version`)
      .then(response => response.json())
      .then(data => {
        setApiVersion(data.version)
      })
      .catch(error => {
        console.error(error) // tslint:disable-line:no-console
      })
  }, [])

  useEffect(() => {
    fetch(config.gateway.url)
      .then(response => response.json())
      .then(data => {
        setGatewayVersion(data.version)
      })
      .catch(error => {
        console.error(error) // tslint:disable-line:no-console
      })
  }, [])

  return (
    <Page>
      <Main>
        <Container>
          <GlobalMenu active={'diagnostics'} />

          <Diagnostics>
            <h2>Versions</h2>

            <table>
              <tbody>
                <tr>
                  <RowHeader>Client</RowHeader>
                  <td>{version}</td>
                </tr>
                <tr>
                  <RowHeader>API</RowHeader>
                  <td>{apiVersion || 'Loading…'}</td>
                </tr>
                <tr>
                  <RowHeader>Gateway</RowHeader>
                  <td>{gatewayVersion || 'Loading…'}</td>
                </tr>
              </tbody>
            </table>

            <h2>Storage</h2>

            <StorageInfo />

            <h2>Project Diagnostics</h2>

            <ProjectsData>
              {projects => (
                <ProjectsList>
                  {projects.map(project => (
                    <ProjectTitle key={project._id}>
                      <ProjectLink to={`/projects/${project._id}/diagnostics`}>
                        {project.title ? (
                          <Title value={project.title} />
                        ) : (
                          <PlaceholderTitle value={'Untitled Project'} />
                        )}
                      </ProjectLink>
                    </ProjectTitle>
                  ))}
                </ProjectsList>
              )}
            </ProjectsData>
          </Diagnostics>
        </Container>
      </Main>
    </Page>
  )
}

export default DiagnosticsPageContainer
