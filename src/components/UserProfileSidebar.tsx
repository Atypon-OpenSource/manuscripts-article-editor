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
import { Avatar, GreyButton, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { FormattedDate } from 'react-intl'
import { styled } from '../theme/styled-components'
import { Sidebar, SidebarContent } from './Sidebar'

const UserEmail = styled.div`
  font-weight: 500;
  text-align: center;
`

const MemberSince = styled.div`
  font-size: 14px;
  text-align: center;
  color: ${props => props.theme.colors.profile.date};
  margin-top: 10px;
  margin-bottom: 40px;
`

const EditButton = styled(PrimaryButton)`
  padding-left: 7px;
  padding-right: 7px;

  &:hover {
    background: white;
  }
`

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
`

const RoundedBorders = styled.div`
  width: 150px;
  height: 150px;
  background-color: ${props => props.theme.colors.sidebar.background.default};
  border: solid 1px ${props => props.theme.colors.sidebar.border};
  border-radius: 50%;
`

const ChangePasswordButton = styled(PrimaryButton)`
  width: 100%;
  margin-bottom: 10px;
`

const DeleteAccountButton = styled(GreyButton)`
  width: 100%;
`

const AddProfileButtonContainer = styled.div`
  position: relative;
  bottom: 37px;
  display: flex;
  justify-content: center;
`

const EditButtonContainer = styled.div`
  position: relative;
  bottom: 27px;
  display: flex;
  justify-content: center;
`

interface Props {
  userWithAvatar: UserProfileWithAvatar
  handleChangePassword: () => void
  handleDeleteAccount: () => void
  handleEditAvatar: () => void
}

const UserProfileSidebar: React.FunctionComponent<Props> = ({
  userWithAvatar,
  handleChangePassword,
  handleDeleteAccount,
  handleEditAvatar,
}) => (
  <Sidebar>
    <SidebarContent>
      <AvatarContainer>
        {!userWithAvatar.avatar ? (
          <Avatar size={150} />
        ) : (
          <RoundedBorders>
            <Avatar size={150} src={userWithAvatar.avatar} />
          </RoundedBorders>
        )}
      </AvatarContainer>

      {!userWithAvatar.avatar ? (
        <AddProfileButtonContainer>
          <EditButton onClick={handleEditAvatar}>Add Picture</EditButton>
        </AddProfileButtonContainer>
      ) : (
        <EditButtonContainer>
          <EditButton onClick={handleEditAvatar}>Edit</EditButton>
        </EditButtonContainer>
      )}

      <UserEmail>{userWithAvatar.email}</UserEmail>
      <MemberSince>
        Member since{' '}
        <FormattedDate
          value={userWithAvatar.createdAt * 1000}
          year={'numeric'}
          month={'short'}
          day={'numeric'}
        />
      </MemberSince>
      <ChangePasswordButton onClick={handleChangePassword}>
        Change Password
      </ChangePasswordButton>
      <DeleteAccountButton onClick={handleDeleteAccount}>
        Delete Account
      </DeleteAccountButton>
    </SidebarContent>
  </Sidebar>
)

export default UserProfileSidebar
