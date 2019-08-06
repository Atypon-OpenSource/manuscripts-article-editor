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
  margin-right: 8px;
  color: ${props => props.theme.colors.reload.icon};
`

const ModalBody = styled.div`
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 8px 0 ${props => props.theme.colors.modal.shadow};
  background: #fff;
  font-family: ${props => props.theme.fontFamily};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  padding: 16px;
`

const Body = styled.div`
  max-width: 300px;
  min-height: 100px;
  font-size: 16px;
  color: ${props => props.theme.colors.dialog.text};
  padding: 0 16px;

  & a {
    color: inherit;
  }
`

const Actions = styled(ButtonGroup)`
  padding: 16px 0;

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
