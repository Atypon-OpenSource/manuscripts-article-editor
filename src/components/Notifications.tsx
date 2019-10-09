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
  border: 1px solid ${props => props.theme.colors.text.muted};
  box-shadow: ${props => props.theme.shadow.dropShadow};
  border-radius: ${props => props.theme.grid.radius.small};
  padding: ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 4}px;
  font-family: ${props => props.theme.font.family.sans};
  background: ${props => props.theme.colors.background.primary};
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
  margin: 0 ${props => props.theme.grid.unit * 4}px;
  display: flex;
  flex-direction: column;
`
