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

import ArrowDownBlack from '@manuscripts/assets/react/ArrowDownBlack'
import ArrowDownUp from '@manuscripts/assets/react/ArrowDownUp'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ResearchField } from '../../types/templates'
import { TemplateTopicsList } from './TemplateTopicsList'

const TopicSelector = styled.div`
  flex-shrink: 0;

  svg path[stroke] {
    stroke: currentColor;
  }
`

const TopicsToggleButton = styled.button`
  align-items: center;
  background: transparent;
  color: ${props => props.theme.colors.button.secondary};
  border: 0;
  cursor: pointer;
  display: flex;
  outline: none;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 400;

  &:focus,
  &:hover {
    color: ${props => props.theme.colors.button.primary};
  }
`

const SelectedTopic = styled.div`
  margin-right: 4px;
`

interface Props {
  handleChange: (value?: ResearchField) => void
  options: ResearchField[]
  value?: ResearchField
}

interface State {
  isOpen: boolean
}

export class TemplateTopicSelector extends React.Component<Props, State> {
  public state: Readonly<State> = {
    isOpen: false,
  }

  public render() {
    const { isOpen } = this.state
    const { options, handleChange, value } = this.props

    return (
      <TopicSelector>
        <TopicsToggleButton onClick={() => this.setState({ isOpen: !isOpen })}>
          <SelectedTopic>{value ? value.name : 'All Topics'}</SelectedTopic>

          {isOpen ? (
            <ArrowDownUp data-cy={'arrow-up'} />
          ) : (
            <ArrowDownBlack data-cy={'arrow-down'} />
          )}
        </TopicsToggleButton>

        {isOpen && (
          <TemplateTopicsList
            handleChange={value => {
              handleChange(value)
              this.setState({ isOpen: false })
            }}
            options={options}
            value={value}
          />
        )}
      </TopicSelector>
    )
  }
}
