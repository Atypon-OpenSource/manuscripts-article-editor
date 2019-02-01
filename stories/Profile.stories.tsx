import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { AvatarFileUpload } from '../src/components/account/AvatarFileUpload'
import ProfilePage from '../src/components/account/ProfilePage'
import { AvatarProps } from '../src/components/account/ProfilePageSidebar'
import { styled } from '../src/theme/styled-components'
import { people } from './data/people'

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
    handleSave={action('save profile')}
    handleChangePassword={action('open change password modal')}
    handleDeleteAccount={action('open delete account modal')}
    handleClose={action('close profile page')}
    saveUserProfileAvatar={action('save user avatar')}
    deleteUserProfileAvatar={action('delete user profile')}
    createAffiliation={action('create new affiliation')}
  />
))

// tslint:disable-next-line:no-object-literal-type-assertion
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
