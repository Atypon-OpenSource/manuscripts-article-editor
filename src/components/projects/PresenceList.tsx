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

import { useSubscription } from '@apollo/react-hooks'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import { Avatar, Tip } from '@manuscripts/style-guide'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import config from '../../config'
import { PROFILE_IMAGE_ATTACHMENT } from '../../lib/data'
import { styled } from '../../theme/styled-components'

const ACTIVITY_UPDATES = gql`
  subscription activityUpdates($containerId: String!) {
    activityUpdates(containerId: $containerId) {
      userId
      containerId
      idle
      location {
        path
        leaf
        root
        endPos
        startPos
      }
    }
  }
`

interface ActivityUpdate {
  containerId: string
  datetime: string
  deviceId: string
  idle: boolean
  userId: string
}

export interface UserPresence {
  profile: UserProfileWithAvatar
  presence: ActivityUpdate
}

export const PresenceList: React.FC<{
  containerId: string
  getCollaborator: (id: string) => UserProfile | undefined
}> = React.memo(({ containerId, getCollaborator }) => {
  const [users, setUsers] = useState<UserPresence[]>()

  const { data, loading, error } = useSubscription<
    {
      activityUpdates: ActivityUpdate[]
    },
    {
      containerId: string
    }
  >(ACTIVITY_UPDATES, {
    variables: { containerId },
  })

  useEffect(() => {
    if (data && data.activityUpdates) {
      const users: UserPresence[] = []

      for (const presence of data.activityUpdates) {
        const profile = getCollaborator(convertUserID(presence.userId))

        if (profile) {
          users.push({ profile, presence })
        }
      }

      setUsers(users)
    }
  }, [data])

  if (loading) return null
  if (error) return null // TODO
  if (!users) return null

  return <PresenceListView users={users} />
})

const convertUserID = (userID: string) => userID.replace('|', '_')

const profileName = (profile: UserProfile) => {
  const { given, family } = profile.bibliographicName

  return [given, family].join(' ').trim()
}

const avatarURL = (profile: UserProfile) => {
  return [
    config.gateway.url,
    config.buckets.projects,
    profile._id,
    PROFILE_IMAGE_ATTACHMENT,
  ].join('/')
}

const sortFalseFirst = (a: boolean, b: boolean) => (a === b ? 0 : a ? -1 : 1)

const sortStringAscending = (a: string, b: string) => {
  return a === b ? 0 : a > b ? -1 : 1
}

// TODO: sort current user first?
const sortUsers = (a: UserPresence, b: UserPresence) => {
  return (
    sortFalseFirst(a.presence.idle, b.presence.idle) ||
    sortStringAscending(
      String(a.profile.bibliographicName.given),
      String(b.profile.bibliographicName.given)
    ) ||
    sortStringAscending(
      String(a.profile.bibliographicName.family),
      String(b.profile.bibliographicName.family)
    )
  )
}

const tipTitle = (user: UserPresence) => {
  let output = profileName(user.profile)

  if (user.presence.idle) {
    output += ' - Idle'
  }

  return output
}

export const PresenceListView: React.FC<{
  users: UserPresence[]
}> = React.memo(({ users }) => {
  return (
    <AvatarStack>
      {users.sort(sortUsers).map(user => (
        <AvatarContainer
          key={user.profile._id}
          style={{
            filter: user.presence.idle ? 'grayscale(100%)' : 'none',
          }}
        >
          <Tip placement={'bottom'} title={tipTitle(user)}>
            <Avatar
              src={user.profile.avatar || avatarURL(user.profile)}
              size={22}
            />
          </Tip>
        </AvatarContainer>
      ))}
    </AvatarStack>
  )
})

const AvatarStack = styled.div`
  display: flex;
  line-height: 1;
  margin-left: 8px;
`

const AvatarContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  background: white;
  border-radius: 50%;
  border: 2px solid white;
  box-sizing: border-box;
  z-index: 1;

  &:hover {
    z-index: 2;
  }
`
