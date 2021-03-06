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
import { PrimaryButton, SecondaryButton } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import {
  NotificationActions,
  NotificationHead,
  NotificationMessage,
  NotificationPrompt,
  NotificationTitle,
} from '../components/Notifications'

export const NotificationInfo = styled.div`
  color: inherit;
  font-size: 80%;
`

interface Props {
  title: string
  info?: JSX.Element | JSX.Element[] | string
  buttonText: string
  buttonAction: () => void
  primaryButtonText?: string
  primaryButtonAction?: () => void
}

const SyncNotification: React.FC<Props> = ({
  title,
  info,
  buttonText,
  buttonAction,
  primaryButtonText,
  primaryButtonAction,
}) => {
  const innards = React.Children.map(info, (child) => (
    <React.Fragment>{child}&emsp;</React.Fragment>
  ))

  return (
    <NotificationPrompt>
      <NotificationHead>
        <AttentionOrange />
        <NotificationMessage>
          <NotificationTitle>{title}</NotificationTitle>
          {innards ? <NotificationInfo>{innards}</NotificationInfo> : null}
        </NotificationMessage>
      </NotificationHead>
      <NotificationActions>
        <SecondaryButton onClick={buttonAction}>{buttonText}</SecondaryButton>
        {primaryButtonText && primaryButtonAction && (
          <PrimaryButton onClick={primaryButtonAction}>
            {primaryButtonText}
          </PrimaryButton>
        )}
      </NotificationActions>
    </NotificationPrompt>
  )
}

export default SyncNotification
