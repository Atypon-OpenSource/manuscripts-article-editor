import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { GreyButton, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { FormattedDate } from 'react-intl'
import { styled } from '../theme/styled-components'
import { Avatar } from './Avatar'
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
        Member since <FormattedDate value={userWithAvatar.createdAt * 1000} />
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
