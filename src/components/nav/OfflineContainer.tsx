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
