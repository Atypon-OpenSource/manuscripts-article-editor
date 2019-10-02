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

import AttentionRed from '@manuscripts/assets/react/AttentionRed'
import {
  ButtonGroup,
  PrimaryButton,
  StyledModal,
  TertiaryButton,
} from '@manuscripts/style-guide'
import React from 'react'
import config from '../../config'
import { styled } from '../../theme/styled-components'

const Message: React.FunctionComponent<{
  message: string
}> = ({ message }) => (
  <div>
    <p>{message || 'Failed to open project for editing due to an error.'}</p>
    <p>
      If the problem persists, please contact{' '}
      <a href={`mailto:${config.support.email}`}>{config.support.email}</a>
    </p>
  </div>
)

const Icon = styled(AttentionRed)`
  margin-right: ${props => props.theme.grid.unit * 2}px;
  color: ${props => props.theme.colors.background.warning};
`

const ModalBody = styled.div`
  border-radius: ${props => props.theme.grid.radius.default};
  box-shadow: ${props => props.theme.shadow.dropShadow};
  background: ${props => props.theme.colors.background.primary};
  font-family: ${props => props.theme.font.family.sans};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.font.size.medium};
  font-weight: ${props => props.theme.font.weight.medium};
  padding: ${props => props.theme.grid.unit * 4}px;
`

const Body = styled.div`
  max-width: 300px;
  min-height: 100px;
  font-size: ${props => props.theme.font.size.medium};
  color: ${props => props.theme.colors.text.secondary};
  padding: 0 ${props => props.theme.grid.unit * 4}px;

  & a {
    color: inherit;
  }
`

const Actions = styled(ButtonGroup)`
  padding: ${props => props.theme.grid.unit * 4}px;
`

const navigateToProjectsList = () => {
  window.location.href = '/projects'
}

const reloadPage = () => {
  window.location.reload()
}

interface Props {
  message: string
}

export const ReloadDialog: React.FunctionComponent<Props> = ({ message }) => (
  <StyledModal
    isOpen={true}
    onRequestClose={navigateToProjectsList}
    shouldCloseOnOverlayClick={true}
  >
    <ModalBody>
      <Header>
        <Icon /> Failed to open project for editing
      </Header>

      <Body>
        <Message message={message} />
      </Body>

      <Actions>
        <TertiaryButton onClick={navigateToProjectsList}>
          View projects
        </TertiaryButton>
        <PrimaryButton onClick={reloadPage}>Retry</PrimaryButton>
      </Actions>
    </ModalBody>
  </StyledModal>
)
