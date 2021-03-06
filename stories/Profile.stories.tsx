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
  BibliographicName,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { AvatarFileUpload } from '../src/components/account/AvatarFileUpload'
import ProfilePage from '../src/components/account/ProfilePage'
import { AvatarProps } from '../src/components/account/ProfilePageSidebar'
import { people } from './data/people'

const bibliographicName: BibliographicName = {
  _id: 'MPBibliographicName:id',
  objectType: 'MPBibliographicName',
  given: 'Jon',
  family: 'Snow',
}

const createdAt = new Date('2020-01-01T12:00:00Z').getTime() / 1000

const affiliation1: UserProfileAffiliation = {
  _id: 'MPUserProfileAffiliation:id',
  objectType: 'MPUserProfileAffiliation',
  priority: 1,
  institution: 'Foobar University',
  containerID: 'MPUserProfile:id',
  createdAt,
  updatedAt: createdAt,
}

const affiliation2: UserProfileAffiliation = {
  _id: 'MPUserProfileAffiliation:id2',
  objectType: 'MPUserProfileAffiliation',
  priority: 1,
  institution: 'Foobar Collage of IT',
  containerID: 'MPUserProfile:id2',
  createdAt,
  updatedAt: createdAt,
}

const affiliationsMap = new Map([
  [affiliation1._id, affiliation1],
  [affiliation2._id, affiliation2],
])

const user: UserProfileWithAvatar = {
  _id: 'MPUserProfile:id',
  objectType: 'MPUserProfile',
  bibliographicName,
  createdAt,
  updatedAt: createdAt,
  userID: 'User_jsnow@atypon.com',
  affiliations: [affiliation1._id],
}

storiesOf('Account/Modals', module).add('Profile', () => (
  <ProfilePage
    userWithAvatar={user}
    affiliationsMap={affiliationsMap}
    handleSave={action('save profile')}
    handleChangePassword={action('open change password modal')}
    handleDeleteAccount={action('open delete account modal')}
    handleClose={action('close profile page')}
    saveUserProfileAvatar={action('save user avatar')}
    deleteUserProfileAvatar={action('delete user profile')}
    createAffiliation={action('create new affiliation')}
    updateAffiliation={action('update affiliations')}
    removeAffiliation={action('remove affiliations')}
  />
))

const avatar = { src: people[0].avatar } as AvatarProps

const SidebarStory = styled.div`
  width: 300px;
  height: 600px;
`

storiesOf('Account/Profile', module)
  .add('AvatarFileUpload', () => (
    <SidebarStory>
      <AvatarFileUpload
        newAvatar={null}
        avatarZoom={2}
        avatarEditorRef={React.createRef()}
        importAvatar={action('import avatar')}
        handleAvatarZoom={action('zoom avatar')}
        handleCancel={action('cancel')}
        handleSaveAvatar={action('save avatar')}
        handleDeleteAvatar={action('delete avatar')}
        userWithAvatar={user}
      />
    </SidebarStory>
  ))
  .add('AvatarFileUpload - with old Avatar', () => (
    <SidebarStory>
      <AvatarFileUpload
        newAvatar={null}
        avatarZoom={2}
        avatarEditorRef={React.createRef()}
        importAvatar={action('import avatar')}
        handleAvatarZoom={action('zoom avatar')}
        handleCancel={action('cancel')}
        handleSaveAvatar={action('save avatar')}
        handleDeleteAvatar={action('delete avatar')}
        userWithAvatar={people[0]}
      />
    </SidebarStory>
  ))
  .add('AvatarFileUpload - with new Avatar', () => (
    <SidebarStory>
      <AvatarFileUpload
        newAvatar={avatar}
        avatarZoom={1}
        avatarEditorRef={React.createRef()}
        importAvatar={action('import avatar')}
        handleAvatarZoom={action('zoom avatar')}
        handleCancel={action('cancel')}
        handleSaveAvatar={action('save avatar')}
        handleDeleteAvatar={action('delete avatar')}
        userWithAvatar={people[0]}
      />
    </SidebarStory>
  ))
