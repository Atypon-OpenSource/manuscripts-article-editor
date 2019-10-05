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

import { ObjectTypes, Project } from '@manuscripts/manuscripts-json-schema'
import { TitleField } from '@manuscripts/title-editor'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { Main, Page } from '../Page'
import { Sidebar, SidebarHeader, SidebarTitle } from '../Sidebar'

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background.dark};
  opacity: 0.75;
`

const pseudoProject: Project = {
  _id: 'MPProject:pseudo',
  objectType: ObjectTypes.Project,
  owners: [],
  writers: [],
  viewers: [],
  createdAt: 0,
  updatedAt: 0,
}

const StyledSidebar = styled(Sidebar)`
  background: ${props => props.theme.colors.background.primary};
  border-right: 1px solid ${props => props.theme.colors.background.info};
`

const ProjectTitle = styled(SidebarTitle)`
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.font.weight.medium};
  border: 1px solid transparent;
  padding: 4px;
  margin: -4px 0 -4px;
  overflow: hidden;
  flex: 1;

  .ProseMirror.empty-node::before {
    position: absolute;
    color: ${props => props.theme.colors.text.muted};
    cursor: text;
    content: 'Untitled Project';
    pointer-events: none;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const PseudoProjectPage: React.FC = () => (
  <>
    <Container>
      <Page project={pseudoProject}>
        <StyledSidebar>
          <SidebarHeader>
            <ProjectTitle>
              <TitleField
                editable={false}
                value={''}
                handleChange={() => null}
              />
            </ProjectTitle>
          </SidebarHeader>
        </StyledSidebar>
        <Main />
      </Page>
    </Container>
    <Overlay />
  </>
)
