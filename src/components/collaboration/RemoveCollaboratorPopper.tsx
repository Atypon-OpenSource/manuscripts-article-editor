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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Avatar, TertiaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { initials } from '../../lib/name'
import { styled } from '../../theme/styled-components'
import { PopperBody, SeparatorLine } from '../Popper'

const CollaboratorInitial = styled.span`
  margin-right: 4px;
  font-weight: ${props => props.theme.font.weight.xlight};
`

const CollaboratorName = styled.div`
  text-align: center;
  font-size: 120%;
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.font.weight.semibold};
  padding-bottom: 13px;
`

const AvatarStyle = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 14px;
  padding-bottom: 6px;
`

const Action = styled.div`
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.font.weight.semibold};
  padding-left: 5px;
`

const Message = styled.div`
  display: flex;
  justify-content: center;
  color: ${props => props.theme.colors.text.primary};
  padding-bottom: 15px;
`

const Description = styled.div`
  display: flex;
  padding-bottom: 10px;
  font-size: ${props => props.theme.font.size.normal};
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  white-space: normal;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  collaborator: UserProfileWithAvatar
  handleRemove: () => void
  switchMode: () => void
}

export const RemoveCollaboratorPopper: React.FunctionComponent<Props> = ({
  collaborator,
  handleRemove,
  switchMode,
}) => {
  const { bibliographicName, avatar } = collaborator

  return (
    <PopperBody size={250}>
      <Message>
        Are you sure you want to <Action>remove</Action>
      </Message>
      <AvatarStyle>
        <Avatar src={avatar} size={45} color={'#6e6e6e'} />
      </AvatarStyle>
      <CollaboratorName>
        <CollaboratorInitial>{initials(bibliographicName)}</CollaboratorInitial>
        {bibliographicName.family}
      </CollaboratorName>
      <Message>from the Contributors list?</Message>
      <Description>
        {bibliographicName.given} won't be able to view or modify any content of
        the project anymore
      </Description>
      <SeparatorLine />
      <ButtonsContainer>
        <TertiaryButton onClick={switchMode}>Cancel</TertiaryButton>
        <TertiaryButton onClick={handleRemove}>Remove</TertiaryButton>
      </ButtonsContainer>
    </PopperBody>
  )
}
