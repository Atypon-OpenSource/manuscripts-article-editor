import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { styled, ThemedProps } from '../../theme'
import { AvatarFileUpload } from '../AvatarFileUpload'
import UserProfileSidebar from '../UserProfileSidebar'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ModalSidebar = styled.div`
  width: 300px;
  overflow: hidden;
  border-top-left-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  border-bottom-left-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
`

export interface AvatarProps {
  src: string
  width?: number | string
  height?: number | string
  file: File
}

interface Props {
  userWithAvatar: UserProfileWithAvatar
  avatarEditorRef: React.RefObject<AvatarEditor>
  saveUserProfileAvatar: () => void
  handleChangePassword: () => void
  handleDeleteAccount: () => void
}

interface State {
  editAvatar: boolean
  avatar: AvatarProps | null
  avatarZoom: number
}

class ProfilePageSidebar extends React.Component<Props, State> {
  public state: Readonly<State> = {
    editAvatar: false,
    avatar: null,
    avatarZoom: 1,
  }

  public render() {
    const {
      userWithAvatar,
      avatarEditorRef,
      handleChangePassword,
      handleDeleteAccount,
    } = this.props
    const { editAvatar, avatar, avatarZoom } = this.state
    return (
      <ModalSidebar>
        {editAvatar ? (
          <AvatarFileUpload
            avatar={avatar}
            avatarZoom={avatarZoom}
            avatarEditorRef={avatarEditorRef}
            importAvatar={this.importAvatar}
            handleCancel={this.handleEditAvatarSidebar}
            handleSaveAvatar={this.handleSaveAvatar}
            handleAvatarZoom={this.handleAvatarZoom}
          />
        ) : (
          <UserProfileSidebar
            userWithAvatar={userWithAvatar}
            createdAt={new Date(userWithAvatar.createdAt * 1000).toDateString()} // the number is divided by 1000 before being stored in the DB
            handleChangePassword={handleChangePassword}
            handleDeleteAccount={handleDeleteAccount}
            handleEditAvatar={this.handleEditAvatarSidebar}
          />
        )}
        >
      </ModalSidebar>
    )
  }

  private handleEditAvatarSidebar = () => {
    this.setState({
      avatar: null,
      editAvatar: !this.state.editAvatar,
      avatarZoom: 1,
    })
  }

  private handleSaveAvatar = async () => {
    const imageURL = this.getCroppedImage()
    this.props.saveUserProfileAvatar()
    this.setAvatar(imageURL)
    this.handleEditAvatarSidebar()
  }

  private handleAvatarZoom = (event: React.FormEvent<HTMLInputElement>) =>
    this.setState({
      avatarZoom: Number(event.currentTarget.value),
    })

  private importAvatar = (file: File) => {
    const fileReader = new FileReader()

    fileReader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const maxSize = 150
        let height
        let width
        if (image.width < image.height) {
          width = maxSize
        } else {
          height = maxSize
        }

        this.setState({
          avatar: { src: fileReader.result as string, width, height, file },
        })
      }

      image.src = fileReader.result as string
    }

    fileReader.readAsDataURL(file)
  }

  private setAvatar = (avatar: string) =>
    (this.props.userWithAvatar.avatar = avatar)

  private getCroppedImage = () =>
    this.props.avatarEditorRef.current!.getImage().toDataURL()
}

export default ProfilePageSidebar
