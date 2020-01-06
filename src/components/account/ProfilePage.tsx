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
import { UserProfileAffiliation } from '@manuscripts/manuscripts-json-schema'
import {
  CloseButton,
  ModalContainer,
  ModalHeader,
  StyledModal,
} from '@manuscripts/style-guide'
import { FormikActions } from 'formik'
import React from 'react'
import { ModalBody, StyledModalMain } from '../Sidebar'
import { ProfileErrors, ProfileForm, ProfileValues } from './ProfileForm'
import ProfilePageSidebar from './ProfilePageSidebar'

interface Props {
  userWithAvatar: UserProfileWithAvatar
  affiliationsMap: Map<string, UserProfileAffiliation>
  createAffiliation: (institution: string) => Promise<UserProfileAffiliation>
  updateAffiliation: (
    data: Partial<UserProfileAffiliation>
  ) => Promise<UserProfileAffiliation>
  removeAffiliation: (data: UserProfileAffiliation) => Promise<string>
  saveUserProfileAvatar: (data: Blob) => Promise<void>
  deleteUserProfileAvatar: () => Promise<void>
  handleChangePassword: () => void
  handleDeleteAccount: () => void
  handleClose: () => void
  handleSave: (
    values: ProfileValues,
    actions: FormikActions<ProfileValues | ProfileErrors>
  ) => void
}

export type ProfilePageComponent = React.ComponentType<Props>

const ProfilePage: ProfilePageComponent = ({
  userWithAvatar,
  affiliationsMap,
  handleSave,
  handleChangePassword,
  handleDeleteAccount,
  handleClose,
  saveUserProfileAvatar,
  deleteUserProfileAvatar,
  createAffiliation,
  updateAffiliation,
  removeAffiliation,
}) => {
  return (
    <StyledModal
      isOpen={true}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={true}
    >
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={handleClose} data-cy={'modal-close-button'} />
        </ModalHeader>
        <ModalBody>
          <ProfilePageSidebar
            handleChangePassword={handleChangePassword}
            handleDeleteAccount={handleDeleteAccount}
            saveUserProfileAvatar={saveUserProfileAvatar}
            deleteUserProfileAvatar={deleteUserProfileAvatar}
            userWithAvatar={userWithAvatar}
          />
          <StyledModalMain>
            <ProfileForm
              affiliationsMap={affiliationsMap}
              userWithAvatar={userWithAvatar}
              handleSave={handleSave}
              createAffiliation={createAffiliation}
              updateAffiliation={updateAffiliation}
              removeAffiliation={removeAffiliation}
            />
          </StyledModalMain>
        </ModalBody>
      </ModalContainer>
    </StyledModal>
  )
}

export default ProfilePage
