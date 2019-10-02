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
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ResearchField } from '../../types/templates'

const ListContainer = styled.div`
  position: relative;
  z-index: 2;
`

const List = styled.div`
  border: 1px solid ${props => props.theme.colors.text.muted};
  border-radius: ${props => props.theme.grid.radius.default};
  box-shadow: ${props => props.theme.shadow.dropShadow};
  background: ${props => props.theme.colors.background.primary};
  height: 300px;
  max-height: 50vh;
  overflow-y: auto;
  position: absolute;
  right: 0;
`

const ListSection = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.grid.unit * 2}px;
  font-size: ${props => props.theme.font.size.medium};
  font-weight: ${props => props.theme.font.weight.medium};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.background.fifth};
  }
`

const Separator = styled.div`
  height: 1px;
  opacity: 0.23;
  background-color: ${props => props.theme.colors.border.field.default};
`

const AddedIconContainer = styled.span`
  display: inline-flex;
  width: ${props => props.theme.grid.unit * 8}px;
  height: 1em;
  align-items: center;
  justify-content: center;
`

const Added: React.FunctionComponent<{ visible: boolean }> = ({ visible }) => (
  <AddedIconContainer>
    {visible && <AddedIcon width={16} height={16} />}
  </AddedIconContainer>
)

interface Props {
  handleChange: (value?: ResearchField) => void
  options: ResearchField[]
  value?: ResearchField
}

export const TemplateTopicsList: React.FunctionComponent<Props> = ({
  handleChange,
  options,
  value,
}) => (
  <ListContainer data-cy={'template-topics-list'}>
    <List>
      <ListSection onClick={() => handleChange(undefined)}>
        <Added visible={!value} />
        All Topics
      </ListSection>

      <Separator />

      {options
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(topic => (
          <ListSection key={topic._id} onClick={() => handleChange(topic)}>
            <Added visible={value ? value._id === topic._id : false} />
            {topic.name}
          </ListSection>
        ))}
    </List>
  </ListContainer>
)
