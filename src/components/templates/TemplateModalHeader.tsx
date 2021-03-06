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

import React, { Component } from 'react'
import styled from 'styled-components'

const ModalHeader = styled.header`
  display: flex;
  margin: 48px auto 32px;
  user-select: none;

  @media (max-width: 450px) {
    padding: 0 ${(props) => props.theme.grid.unit * 4}px;
  }
`
const Header = styled.h2`
  font-size: 24px;
  font-weight: ${(props) => props.theme.font.weight.bold};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  margin: 0;
`
const Icon = styled.span`
  margin-right: ${(props) => props.theme.grid.unit * 4}px;
`

interface Props {
  icon?: JSX.Element
  title: string
}

export class TemplateModalHeader extends Component<Props> {
  public render() {
    const { icon, title } = this.props

    return (
      <ModalHeader>
        {icon && <Icon>{icon}</Icon>}
        <Header>{title}</Header>
      </ModalHeader>
    )
  }
}
