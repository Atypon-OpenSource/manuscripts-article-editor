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
import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { ImageTypes, isImage } from '../../lib/images'
import UserProfileSidebar from '../UserProfileSidebar'
import { AvatarFileUpload } from './AvatarFileUpload'

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
  avatarError: boolean
}

class ProfilePageSidebar extends React.Component<Props, State> {
  public state: Readonly<State> = {
    editAvatar: false,
    newAvatar: null,
    avatarZoom: 1,
    avatarError: false,
  }

  private avatarEditorRef = React.createRef<AvatarEditor>()

  public render() {
    const {
      userWithAvatar,
      handleChangePassword,
      handleDeleteAccount,
    } = this.props
    const { editAvatar, newAvatar, avatarZoom, avatarError } = this.state

    return (
      <>
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
        {avatarError && (
          <Dialog
            isOpen={true}
            category={Category.error}
            header={'Add avatar failed'}
            message={`The avatar must be an image file of one of the following types: ${ImageTypes.join(
              ', '
            )}.`}
            actions={{
              primary: {
                action: () => this.setState({ avatarError: false }),
                title: 'OK',
              },
            }}
          />
        )}
      </>
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
    if (!isImage(file)) {
      return this.setState({ avatarError: true })
    }

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
