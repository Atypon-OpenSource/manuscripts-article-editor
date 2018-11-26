import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { UserProfileAffiliation } from '@manuscripts/manuscripts-json-schema'
import { FormikActions } from 'formik'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { altoGrey } from '../../colors'
import Close from '../../icons/close'
import { styled, ThemedProps } from '../../theme'
import { CloseButton } from '../SimpleModal'
import { StyledModal, totalTransitionTime } from '../StyledModal'
import { ProfileErrors, ProfileForm, ProfileValues } from './ProfileForm'
import ProfilePageSidebar from './ProfilePageSidebar'

type ThemedDivProps = ThemedProps<HTMLDivElement>

// TODO: Try to remove the fixed numbers
const ModalMain = styled.div`
  width: 500px;
  height: 600px;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 8px;
`

const ModalContainer = styled.div`
  display: flex;
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
  border-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 ${altoGrey};
  background: #fff;
`

interface Props {
  userWithAvatar: UserProfileWithAvatar
  affiliationsMap: Map<string, UserProfileAffiliation>
  avatarEditorRef: React.RefObject<AvatarEditor>
  createAffiliation: (institution: string) => Promise<UserProfileAffiliation>
  saveUserProfileAvatar: () => void
  handleChangePassword: () => void
  handleDeleteAccount: () => void
  handleClose: () => void
  handleSave: (
    values: ProfileValues,
    actions: FormikActions<ProfileValues | ProfileErrors>
  ) => void
}

const ProfilePage: React.FunctionComponent<Props> = ({
  userWithAvatar,
  avatarEditorRef,
  affiliationsMap,
  handleSave,
  handleChangePassword,
  handleDeleteAccount,
  handleClose,
  saveUserProfileAvatar,
  createAffiliation,
}) => {
  return (
    <StyledModal
      isOpen={true}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={totalTransitionTime}
    >
      <ModalHeader>
        <CloseButton onClick={handleClose}>
          <Close size={24} />
        </CloseButton>
      </ModalHeader>
      <ModalContainer>
        <ProfilePageSidebar
          avatarEditorRef={avatarEditorRef}
          handleChangePassword={handleChangePassword}
          handleDeleteAccount={handleDeleteAccount}
          saveUserProfileAvatar={saveUserProfileAvatar}
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
