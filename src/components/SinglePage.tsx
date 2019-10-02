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
} from '@manuscripts/style-guide'
import React, { useEffect } from 'react'
import { styled } from '../theme/styled-components'
import { withModal } from './ModalProvider'

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
  padding: ${props => props.theme.grid.unit * 4}px 0;

  & button:not(:last-of-type) {
    margin-right: 4px;
  }
`

const Details = styled.details`
  padding: 0;
`

const Summary = styled.summary`
  cursor: pointer;

  :focus {
    outline: none;
  }
`

const takeBackControl = () => {
  window.localStorage.removeItem('running')
  window.location.reload()
}

const Modal: React.FC = () => (
  <StyledModal isOpen={true}>
    <ModalBody>
      <Header>
        <Icon /> Application already running
      </Header>

      <Body>
        <div>
          <p>
            The Manuscripts.io application can only be running in one window per
            browser user.
          </p>

          <Details>
            <Summary>More info</Summary>
            <div>
              <p>
                This is a temporary limitation, to be lifted in a future update.
                As a workaround, you can use a different browser on the same
                system.
              </p>

              <p>
                If you are sure the application is only running in this window,
                choose "Use this window".
              </p>

              <Actions>
                <PrimaryButton onClick={takeBackControl}>
                  Use this window
                </PrimaryButton>
              </Actions>
            </div>
          </Details>
        </div>
      </Body>
    </ModalBody>
  </StyledModal>
)

const STORAGE_KEY = 'running'

const SinglePage = withModal(({ addModal }) => {
  useEffect(() => {
    const running = window.localStorage.getItem('running')

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.oldValue && !event.newValue) {
        takeBackControl()
      }
    }

    if (running) {
      window.addEventListener('storage', handleStorageEvent)

      addModal('single-page', Modal)
    } else {
      window.addEventListener('unload', () => {
        window.localStorage.removeItem(STORAGE_KEY)
      })

      window.localStorage.setItem(STORAGE_KEY, new Date().toUTCString())
    }

    return () => {
      window.removeEventListener('storage', handleStorageEvent)
    }
  }, [])

  return null
})

export default SinglePage
