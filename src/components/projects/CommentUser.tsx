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
import { Contribution } from '@manuscripts/manuscripts-json-schema'
import { Avatar } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { buildName } from '../../lib/comments'

const CommentUserContainer = styled.div`
  display: flex;
  align-items: center;
`

const CommentUserName = styled.div`
  margin: 0 ${(props) => props.theme.grid.unit * 2}px;
  font-weight: ${(props) => props.theme.font.weight.semibold};
`

export const CommentUser: React.FC<{
  contributions: Contribution[]
  getCollaboratorById: (id: string) => UserProfileWithAvatar | undefined
}> = ({ contributions, getCollaboratorById }) => {
  if (!contributions.length) {
    return null
  }

  const [contribution] = contributions // only one contributor

  const user = getCollaboratorById(contribution.profileID)

  if (!user) {
    return null
  }

  return (
    <CommentUserContainer>
      <Avatar src={user.avatar} size={20} />
      <CommentUserName>by {buildName(user.bibliographicName)}</CommentUserName>
    </CommentUserContainer>
  )
}
