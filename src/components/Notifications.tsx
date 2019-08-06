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

import AttentionBlue from '@manuscripts/assets/react/AttentionBlue'
import { ButtonGroup } from '@manuscripts/style-guide'
import React from 'react'
import { Transition } from 'react-spring/renderprops.cjs'
import { styled } from '../theme/styled-components'
import { NotificationItem } from './NotificationProvider'

interface Props {
  items: NotificationItem[]
  removeNotification: (id: string) => void
}

export const Notifications: React.FC<Props> = ({
  items,
  removeNotification,
}) => (
  <Container>
    <Transition
      items={items}
      keys={item => item.id}
      from={{
        transform: 'translate3d(0, 100%, 0)',
        opacity: 0,
        marginBottom: 0,
      }}
      enter={{
        transform: 'translate3d(0, 0, 0)',
        opacity: 1,
        marginBottom: 8,
        display: 'flex',
        width: '800px',
        maxWidth: '90%',
      }}
      leave={{
        opacity: 0,
        marginBottom: 0,
      }}
    >
      {({ id, notification: Notification }) => props => (
        <div style={props}>
          <Notification
            key={id}
            removeNotification={() => removeNotification(id)}
          />
        </div>
      )}
    </Transition>
  </Container>
)

const Container = styled.div`
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
`

export const NotificationPrompt = styled.div`
  border: 1px solid ${props => props.theme.colors.modal.border};
  box-shadow: 0 2px 4px 0 ${props => props.theme.colors.modal.shadow};
  border-radius: 4px;
  padding: 8px 16px;
  font-family: ${props => props.theme.fontFamily};
  background: white;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
`

export const NotificationHead = styled.div`
  display: flex;
  align-items: center;
`

export const NotificationActions = styled(ButtonGroup)``

export const NotificationIcon = styled(AttentionBlue)``
export const NotificationTitle = styled.div`
  font-size: 90%;
`
export const NotificationLink = styled.a.attrs({ target: '_blank' })`
  color: inherit;
  font-size: 80%;
`
export const NotificationMessage = styled.div`
  margin: 0 16px;
  display: flex;
  flex-direction: column;
`
