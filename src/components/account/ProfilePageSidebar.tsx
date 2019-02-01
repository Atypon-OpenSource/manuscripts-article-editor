import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { styled } from '../../theme/styled-components'
import UserProfileSidebar from '../UserProfileSidebar'
import { AvatarFileUpload } from './AvatarFileUpload'

const ModalSidebar = styled.div`
  width: 300px;
  overflow: hidden;
  border-top-left-radius: ${props => props.theme.radius}px;
  border-bottom-left-radius: ${props => props.theme.radius}px;
`

export interface AvatarProps {
  src: string
  width?: number | string
  height?: number | string
  file: File
}

interface Props {
  userWithAvatar: UserProfileWithAvatar
  saveUserProfileAvatar: (data: Blob) => Promise<void>
  deleteUserProfileAvatar: () => Promise<void>
  handleChangePassword: () => void
  handleDeleteAccount: () => void
}

interface State {
  editAvatar: boolean
  newAvatar: AvatarProps | null
  avatarZoom: number
}

class ProfilePageSidebar extends React.Component<Props, State> {
  public state: Readonly<State> = {
    editAvatar: false,
    newAvatar: null,
    avatarZoom: 1,
  }

  private avatarEditorRef = React.createRef<AvatarEditor>()

  public render() {
    const {
      userWithAvatar,
      handleChangePassword,
      handleDeleteAccount,
    } = this.props
    const { editAvatar, newAvatar, avatarZoom } = this.state

    return (
      <ModalSidebar>
        {editAvatar ? (
          <AvatarFileUpload
            newAvatar={newAvatar}
            avatarZoom={avatarZoom}
            avatarEditorRef={this.avatarEditorRef}
            userWithAvatar={userWithAvatar}
            importAvatar={this.importAvatar}
            handleCancel={this.closeEditor}
            handleSaveAvatar={this.handleSaveAvatar}
            handleDeleteAvatar={this.handleDeleteAvatar}
            handleAvatarZoom={this.handleAvatarZoom}
          />
        ) : (
          <UserProfileSidebar
            userWithAvatar={userWithAvatar}
            handleChangePassword={handleChangePassword}
            handleDeleteAccount={handleDeleteAccount}
            handleEditAvatar={this.openEditor}
          />
        )}
        >
      </ModalSidebar>
    )
  }

  private openEditor = () => {
    this.setState({
      newAvatar: null,
      editAvatar: true,
      avatarZoom: 1,
    })
  }

  private closeEditor = () => {
    this.setState({
      editAvatar: false,
    })
  }

  private handleSaveAvatar = async () => {
    const canvasElement = this.avatarEditorRef.current!.getImage()
    const blob = await this.canvasToBlob(canvasElement)
    await this.props.saveUserProfileAvatar(blob)
    this.closeEditor()
  }

  private handleDeleteAvatar = async () => {
    await this.props.deleteUserProfileAvatar()
    this.closeEditor()
  }

  private canvasToBlob = (canvasElement: HTMLCanvasElement): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvasElement.toBlob(blob => (blob ? resolve(blob) : reject()))
    })

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
          newAvatar: { src: fileReader.result as string, width, height, file },
        })
      }

      image.src = fileReader.result as string
    }

    fileReader.readAsDataURL(file)
  }
}

export default ProfilePageSidebar
