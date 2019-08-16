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

import ArrowDownBlue from '@manuscripts/assets/react/ArrowDownBlue'
import ArrowUpBlue from '@manuscripts/assets/react/ArrowUpBlue'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ResearchField } from '../../types/templates'
import { TemplateTopicsList } from './TemplateTopicsList'

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
`

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: ${props => props.theme.colors.sidebar.text.primary};
  margin-right: 8px;
`

interface Props {
  handleChange: (value: ResearchField | null) => void
  options: ResearchField[]
  value: ResearchField | null
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
      <div>
        <Header onClick={() => this.setState({ isOpen: !isOpen })}>
          <Title>{value ? value.name : 'All Topics'}</Title>

          {isOpen ? (
            <ArrowUpBlue data-cy={'arrow-up'} />
          ) : (
            <ArrowDownBlue data-cy={'arrow-down'} />
          )}
        </Header>

        {isOpen && (
          <TemplateTopicsList
            handleChange={value => {
              this.setState({ isOpen: false })
              handleChange(value)
            }}
            options={options}
            value={value}
          />
        )}
      </div>
    )
  }
}
