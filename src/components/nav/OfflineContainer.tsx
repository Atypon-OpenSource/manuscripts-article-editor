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

import AttentionOrange from '@manuscripts/assets/react/AttentionOrange'
import { Button, Tip } from '@manuscripts/style-guide'
import React, { useContext, useEffect, useState } from 'react'
import { Detector } from 'react-detect-offline'
import config from '../../config'
import { mercuryGrey } from '../../theme/colors'
import { styled } from '../../theme/styled-components'
import {
  NotificationComponent,
  NotificationContext,
} from '../NotificationProvider'
import {
  NotificationActions,
  NotificationHead,
  NotificationMessage,
  NotificationPrompt,
  NotificationTitle,
} from '../Notifications'

const Wrapper = styled.div`
  position: relative;
`

const Bubble = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  top: -2px;
  right: -2px;
  cursor: pointer;
  background: ${mercuryGrey};
  border: 2px solid white;
`

export const NotificationInfo = styled.div`
  color: inherit;
  font-size: 80%;
`

export const OfflineContainer: React.FC = ({ children }) => (
  <Wrapper>
    <Detector
      polling={{
        url: config.url, // TODO: ok to ping the base URL every 5 seconds?
      }}
      render={({ online }: { online: boolean }) => (
        <OfflineView online={online} />
      )}
    />
    {children}
  </Wrapper>
)

export const OfflineView: React.FC<{ online: boolean }> = ({ online }) => {
  const [notified, setNotified] = useState(false)

  const { removeNotification, showNotification } = useContext(
    NotificationContext
  )

  useEffect(() => {
    if (online) {
      removeNotification('offline')
    } else {
      const handleDismiss = () => {
        setNotified(true)
        removeNotification('offline')
      }

      const OfflineNotification: NotificationComponent = () => (
        <NotificationPrompt>
          <NotificationHead>
            <AttentionOrange />
            <NotificationMessage>
              <NotificationTitle>
                Seems like your network connection just dropped.
              </NotificationTitle>
              <NotificationInfo>
                Not to worry, you can still keep working on your documents.
              </NotificationInfo>
            </NotificationMessage>
          </NotificationHead>
          <NotificationActions>
            <Button onClick={handleDismiss}>Got it</Button>
          </NotificationActions>
        </NotificationPrompt>
      )

      if (!notified) {
        showNotification('offline', OfflineNotification)
      }
    }
  }, [online])

  return online ? null : (
    <Tip placement={'right-end'} title={'Working offline'}>
      <Bubble />
    </Tip>
  )
}
