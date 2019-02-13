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
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ResearchField } from '../../types/templates'

const ListContainer = styled.div`
  position: relative;
  bottom: 12px;
  z-index: 2;
`

const List = styled.div`
  border: 1px solid
    ${props => props.theme.colors.templateSelector.topicsList.border};
  border-radius: 8px;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  background: ${props =>
    props.theme.colors.templateSelector.topicsList.background};
  max-height: 50vh;
  overflow-y: auto;
  margin: 0 20px;
  width: 85%;
  position: absolute;
`

const ListSection = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.templateSelector.topicsList.text};
  cursor: pointer;

  &:hover {
    background-color: ${props =>
      props.theme.colors.templateSelector.topicsList.hovered};
  }
`

const Separator = styled.div`
  height: 1px;
  opacity: 0.23;
  background-color: ${props =>
    props.theme.colors.templateSelector.topicsList.separator};
`

const AddedIconContainer = styled.span`
  display: inline-flex;
  width: 32px;
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
  handleChange: (value: ResearchField | null) => void
  options: ResearchField[]
  value: ResearchField | null
}

export const TemplateTopicsList: React.FunctionComponent<Props> = ({
  handleChange,
  options,
  value,
}) => (
  <ListContainer data-cy={'template-topics-list'}>
    <List>
      <ListSection onClick={() => handleChange(null)}>
        <Added visible={!value} />
        All Topics
      </ListSection>

      <Separator />

      {options.sort((a, b) => a.name.localeCompare(b.name)).map(topic => (
        <ListSection key={topic._id} onClick={() => handleChange(topic)}>
          <Added visible={value ? value._id === topic._id : false} />
          {topic.name}
        </ListSection>
      ))}
    </List>
  </ListContainer>
)
