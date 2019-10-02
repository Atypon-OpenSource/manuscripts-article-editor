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

import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { UserProfileAffiliation } from '@manuscripts/manuscripts-json-schema'
import { CloseButton, StyledModal } from '@manuscripts/style-guide'
import { FormikActions } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ProfileErrors, ProfileForm, ProfileValues } from './ProfileForm'
import ProfilePageSidebar from './ProfilePageSidebar'

// TODO: Try to remove the fixed numbers
const ModalMain = styled.div`
  width: 500px;
  height: 600px;
`

const ModalHeader = styled.div`
  position: absolute;
  right: -${props => props.theme.grid.unit * 3}px;
  top: -${props => props.theme.grid.unit * 3}px;
  z-index: 1;
`

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.background.primary};
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.grid.radius.default};
  display: flex;
  font-family: ${props => props.theme.font.family.sans};
  overflow: hidden;
`

interface Props {
  userWithAvatar: UserProfileWithAvatar
  affiliationsMap: Map<string, UserProfileAffiliation>
  createAffiliation: (institution: string) => Promise<UserProfileAffiliation>
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
}) => {
  return (
    <StyledModal
      isOpen={true}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={true}
    >
      <ModalHeader>
        <CloseButton onClick={handleClose} data-cy={'modal-close-button'}>
          <CloseIconDark />
        </CloseButton>
      </ModalHeader>
      <ModalContainer>
        <ProfilePageSidebar
          handleChangePassword={handleChangePassword}
          handleDeleteAccount={handleDeleteAccount}
          saveUserProfileAvatar={saveUserProfileAvatar}
          deleteUserProfileAvatar={deleteUserProfileAvatar}
          userWithAvatar={userWithAvatar}
        />
        <ModalMain>
          <ProfileForm
            affiliationsMap={affiliationsMap}
            userWithAvatar={userWithAvatar}
            handleSave={handleSave}
            createAffiliation={createAffiliation}
          />
        </ModalMain>
      </ModalContainer>
    </StyledModal>
  )
}

export default ProfilePage
