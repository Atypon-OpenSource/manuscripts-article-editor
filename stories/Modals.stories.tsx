import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import ProfilePage from '../src/components/account/ProfilePage'

const bibliographicName: BibliographicName = {
  _id: 'MPBibliographicName:id',
  objectType: 'MPBibliographicName',
  given: 'Jon',
  family: 'Snow',
}

const affiliation1: UserProfileAffiliation = {
  _id: 'MPUserProfileAffiliation:id',
  objectType: 'MPUserProfileAffiliation',
  priority: 1,
  institution: 'Foobar University',
  containerID: 'MPUserProfile:id',
  createdAt: new Date().getTime() / 1000,
  updatedAt: new Date().getTime() / 1000,
}

const affiliation2: UserProfileAffiliation = {
  _id: 'MPUserProfileAffiliation:id2',
  objectType: 'MPUserProfileAffiliation',
  priority: 1,
  institution: 'Foobar Collage of IT',
  containerID: 'MPUserProfile:id2',
  createdAt: new Date().getTime() / 1000,
  updatedAt: new Date().getTime() / 1000,
}

const affiliationsMap = new Map([
  [affiliation1._id, affiliation1],
  [affiliation2._id, affiliation2],
])

const user: UserProfileWithAvatar = {
  _id: 'MPUserProfile:id',
  objectType: 'MPUserProfile',
  bibliographicName,
  createdAt: new Date().getTime() / 1000,
  updatedAt: new Date().getTime() / 1000,
  userID: 'User_jsnow@atypon.com',
  affiliations: [affiliation1._id],
}

storiesOf('Account/Modals', module).add('Profile', () => (
  <ProfilePage
    userWithAvatar={user}
    affiliationsMap={affiliationsMap}
    avatarEditorRef={React.createRef<AvatarEditor>()}
    handleSave={action('save profile')}
    handleChangePassword={action('open change password modal')}
    handleDeleteAccount={action('open delete account modal')}
    handleClose={action('close profile page')}
    saveUserProfileAvatar={action('save user avatar')}
    createAffiliation={action('create new affiliation')}
  />
))
