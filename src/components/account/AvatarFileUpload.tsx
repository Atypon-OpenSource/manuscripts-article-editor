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
import {
  Avatar,
  PrimaryButton,
  SecondaryButton,
} from '@manuscripts/style-guide'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import styled from 'styled-components'

import { ModalSidebar } from '../Sidebar'
import ImportAvatarContainer from './ImportAvatarContainer'
import { AvatarProps } from './ProfilePageSidebar'

const DropZone = styled.div`
  width: 150px;
  height: 150px;
  background-color: ${(props) => props.theme.colors.background.secondary};
  border: dashed 3px ${(props) => props.theme.colors.border.primary};
  border-radius: 50%;
`

interface UploadContainerProps {
  isOver: boolean
}

const UploadContainer = styled.div`
  color: ${(props: UploadContainerProps) =>
    props.isOver ? '#6fb7ff' : '#acb8c7'};
  display: flex;
  flex-direction: column;
  align-items: center;
`

const UploadBox = styled.div`
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
`

const UploadLabel = styled.div`
  font-size: ${(props) => props.theme.font.size.xlarge};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  letter-spacing: -0.4px;
  text-align: center;
  color: ${(props) => props.theme.colors.text.primary};
`

const UploadBoxInnerText = styled.div`
  font-size: ${(props) => props.theme.font.size.medium}
  line-height: ${(props) => props.theme.font.lineHeight.large};
  letter-spacing: -0.4px;
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};
`

const UploadBoxBrowse = styled.span`
  margin: 0 2px;
  font-size: ${(props) => props.theme.font.size.medium};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  letter-spacing: -0.4px;
  text-align: center;
  color: ${(props) => props.theme.colors.brand.default};
  cursor: pointer;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const SaveAvatarButton = styled(PrimaryButton)`
  margin-bottom: 10px;
`

const CancelButton = styled(SecondaryButton)`
  margin-bottom: 10px;
`

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  background-color: ${(props) => props.theme.colors.background.primary};
  overflow: hidden;
`

const RangeInput = styled.input.attrs({
  type: 'range',
})``

const RoundedBorders = styled.div`
  width: 150px;
  height: 150px;
  background-color: ${(props) => props.theme.colors.background.primary};
  border: solid 1px ${(props) => props.theme.colors.border.primary};
  border-radius: 50%;
`

export interface AvatarFileUploadProps {
  newAvatar: AvatarProps | null
  avatarZoom: number
  avatarEditorRef: React.RefObject<AvatarEditor>
  userWithAvatar: UserProfileWithAvatar
  importAvatar: (avatar: File) => void
  handleCancel: () => void
  handleSaveAvatar: () => Promise<void>
  handleDeleteAvatar: () => Promise<void>
  handleAvatarZoom: (event: React.FormEvent<HTMLInputElement>) => void
}

export const AvatarFileUpload: React.FunctionComponent<AvatarFileUploadProps> = ({
  newAvatar,
  avatarZoom,
  avatarEditorRef,
  userWithAvatar,
  importAvatar,
  handleCancel,
  handleSaveAvatar,
  handleDeleteAvatar,
  handleAvatarZoom,
}) => (
  <ModalSidebar>
    {!newAvatar ? (
      <ImportAvatarContainer
        importAvatar={importAvatar}
        render={({ isImporting, isOver }) => (
          <UploadContainer isOver={isOver}>
            {userWithAvatar.avatar ? (
              <RoundedBorders>
                <Avatar size={150} src={userWithAvatar.avatar} />
              </RoundedBorders>
            ) : (
              <DropZone />
            )}
            <UploadBox>
              {isImporting ? (
                <UploadLabel>Importing…</UploadLabel>
              ) : (
                <React.Fragment>
                  <UploadLabel>Drag file above</UploadLabel>
                  <UploadBoxInnerText>
                    or <UploadBoxBrowse>browse</UploadBoxBrowse> for a file
                    {userWithAvatar.avatar && <div>to replace the image</div>}
                  </UploadBoxInnerText>
                </React.Fragment>
              )}
            </UploadBox>
          </UploadContainer>
        )}
      />
    ) : (
      <AvatarContainer>
        <AvatarEditor
          ref={avatarEditorRef}
          image={newAvatar.src}
          width={150}
          height={150}
          color={[148, 148, 148, 0.6]}
          borderRadius={180}
          scale={avatarZoom}
        />
        <RangeInput
          min={1}
          max={4}
          step={0.2}
          value={avatarZoom}
          onChange={handleAvatarZoom}
        />
      </AvatarContainer>
    )}
    <ButtonsContainer>
      <SaveAvatarButton onClick={handleSaveAvatar} disabled={!newAvatar}>
        Save Avatar
      </SaveAvatarButton>
      {userWithAvatar.avatar && (
        <SaveAvatarButton onClick={handleDeleteAvatar} disabled={!!newAvatar}>
          Remove Avatar
        </SaveAvatarButton>
      )}
      <CancelButton onClick={handleCancel}>Cancel</CancelButton>
    </ButtonsContainer>
  </ModalSidebar>
)
