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
import {
  Correction as CorrectionT,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { Avatar } from '@manuscripts/style-guide'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import { getUserRole } from '../../lib/roles'
import { FormattedDateTime } from '../FormattedDateTime'

export const CorrectionItem: React.FC<{
  correction: CorrectionT
  getCollaboratorById: (id: string) => UserProfileWithAvatar | undefined
  project: Project
}> = ({ correction, getCollaboratorById, project }) => {
  const user =
    correction.contributions && correction.contributions.length
      ? getCollaboratorById(correction.contributions[0].profileID)
      : undefined
  const timestamp = correction.contributions![0].timestamp
  return (
    <>
      <SnippetText isRejected={correction.status === 'rejected'}>
        {correction.insertion}
      </SnippetText>
      {user ? (
        <AvatarContainer key={user._id}>
          <div data-tip={true} data-for={user._id}>
            <Avatar src={user?.avatar} size={22} />
          </div>
          <ReactTooltip
            id={user._id}
            place="bottom"
            effect="solid"
            offset={{ top: 4 }}
            className="tooltip"
          >
            <TooltipHeader>Created by</TooltipHeader>
            <Name>
              {user.bibliographicName.given +
                ' ' +
                user.bibliographicName.family}
            </Name>
            {getUserRole(project, user.userID)}

            <Date>
              {FormattedDateTime({
                date: timestamp,
                options: { year: 'numeric', month: 'numeric', day: 'numeric' },
              })}
              ,{' '}
              {FormattedDateTime({
                date: timestamp,
                options: { hour: 'numeric', minute: 'numeric' },
              })}
            </Date>
          </ReactTooltip>
        </AvatarContainer>
      ) : null}
      <Time>
        {' '}
        {FormattedDateTime({
          date: timestamp,
          options: { hour: 'numeric', minute: 'numeric' },
        })}
      </Time>
    </>
  )
}

const Text = styled.div`
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
`
const SnippetText = styled(Text)<{
  isRejected: boolean
}>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: ${(props) => props.theme.grid.unit}px;
  color: ${(props) => props.theme.colors.text.primary};
  opacity: ${(props) => (props.isRejected ? 0.5 : 1)};
`

const TooltipHeader = styled(Text)`
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`

const Name = styled.div`
  font-size: ${(props) => props.theme.font.size.normal};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
  font-weight: 700;
`
const Date = styled(Text)`
  font-weight: 700;
  margin-top: ${(props) => props.theme.grid.unit * 2}px;
`
export const AvatarContainer = styled.div`
  margin-right: ${(props) => props.theme.grid.unit}px;
  position: relative;
  visibility: hidden;
  .tooltip {
    border-radius: 6px;
    padding: ${(props) => props.theme.grid.unit * 4}px;
  }

  & img {
    border: 1px solid transparent;
  }

  &:hover {
    & img {
      border: 1px solid #bce7f6;
    }
  }
`
export const Time = styled.span`
  visibility: hidden;
`
