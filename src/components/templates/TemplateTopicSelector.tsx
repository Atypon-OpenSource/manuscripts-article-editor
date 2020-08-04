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
import { ResearchField } from '@manuscripts/manuscripts-json-schema'
import { TertiaryButton } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'
import { TemplateTopicsList } from './TemplateTopicsList'

const TopicSelector = styled.div`
  border-left: 1px solid ${props => props.theme.colors.border.secondary};
  flex-shrink: 0;

  button {
    border-radius: 0;
  }

  svg path[stroke] {
    stroke: currentColor;
  }
`

const TopicsToggleButton = styled(TertiaryButton)`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.font.size.normal};
  font-weight: ${props => props.theme.font.weight.normal};
  text-transform: none;
`

const SelectedTopic = styled.div`
  margin-right: ${props => props.theme.grid.unit}px;
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

  private nodeRef: React.RefObject<HTMLDivElement> = React.createRef()

  public componentDidMount() {
    this.addClickListener()
  }

  public componentWillUnmount() {
    this.removeClickListener()
  }

  public render() {
    const { isOpen } = this.state
    const { options, handleChange, value } = this.props

    return (
      <TopicSelector ref={this.nodeRef}>
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

  private handleClickOutside = (event: Event) => {
    if (
      this.state.isOpen &&
      this.nodeRef.current &&
      !this.nodeRef.current.contains(event.target as Node)
    ) {
      this.setState({
        isOpen: false,
      })
    }
  }

  private addClickListener() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  private removeClickListener() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }
}
