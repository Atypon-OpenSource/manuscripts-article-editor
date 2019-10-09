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

import React from 'react'
import { styled } from '../../theme/styled-components'
import { AddButton } from '../AddButton'
import { Notification } from '../NotificationMessage'
import { ProjectPlaceholder } from '../Placeholders'

const OuterContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: ${props => props.theme.font.size.xlarge};
  justify-content: center;
  line-height: ${props => props.theme.font.lineHeight.large};
  text-align: center;
`

const Placeholder = styled.div``

const ActionContainer = styled.div``

const Message = styled.div`
  font-weight: ${props => props.theme.font.weight.light};
  padding-top: ${props => props.theme.grid.unit * 5}px;
  color: ${props => props.theme.colors.text.secondary};
`

const TextContainer = styled.div`
  letter-spacing: -0.8px;
  padding-top: 6px;
`
interface Props {
  openTemplateSelector: () => void
  message?: string
}

export const EmptyProjectPage: React.FunctionComponent<Props> = ({
  openTemplateSelector,
  message,
}) => {
  return (
    <OuterContainer>
      {message && <Notification message={message} id={'empty-project'} />}

      <Placeholder>
        <ProjectPlaceholder />
      </Placeholder>

      <ActionContainer>
        <AddButton
          action={openTemplateSelector}
          size={'large'}
          title={'New Manuscript'}
        />
      </ActionContainer>

      <Message>
        <TextContainer>This project is empty.</TextContainer>
        <TextContainer>Create a manuscript to get started.</TextContainer>
      </Message>
    </OuterContainer>
  )
}
