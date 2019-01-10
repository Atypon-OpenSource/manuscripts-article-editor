import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { styled, ThemedProps } from '../../theme'
import UserProfileSidebar from '../UserProfileSidebar'
import { AvatarFileUpload } from './AvatarFileUpload'

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
  saveUserProfileAvatar: (data: Blob) => Promise<void>
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

  private avatarEditorRef = React.createRef<AvatarEditor>()

  public render() {
    const {
      userWithAvatar,
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
            avatarEditorRef={this.avatarEditorRef}
            importAvatar={this.importAvatar}
            handleCancel={this.closeEditor}
            handleSaveAvatar={this.handleSaveAvatar}
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
      avatar: null,
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
          avatar: { src: fileReader.result as string, width, height, file },
        })
      }

      image.src = fileReader.result as string
    }

    fileReader.readAsDataURL(file)
  }
}

export default ProfilePageSidebar
