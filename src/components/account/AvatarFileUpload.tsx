/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Avatar, GreyButton, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { styled } from '../../theme/styled-components'
import { Sidebar, SidebarContent } from '../Sidebar'
import ImportAvatarContainer from './ImportAvatarContainer'
import { AvatarProps } from './ProfilePageSidebar'

const DropZone = styled.div`
  width: 150px;
  height: 150px;
  background-color: ${props => props.theme.colors.sidebar.background.default};
  border: dashed 3px ${props => props.theme.colors.sidebar.border};
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
  font-size: 20px;
  line-height: 22px;
  letter-spacing: -0.4px;
  text-align: center;
  color: ${props => props.theme.colors.sidebar.text.primary};
`

const UploadBoxInnerText = styled.div`
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.4px;
  text-align: center;
  color: ${props => props.theme.colors.sidebar.text.secondary};
`

const UploadBoxBrowse = styled.span`
  margin: 0 2px;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.4px;
  text-align: center;
  color: ${props => props.theme.colors.sidebar.text.link};
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
  width: 50%;
`

const CancelButton = styled(GreyButton)`
  margin-bottom: 10px;
  width: 50%;
`

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  background-color: ${props => props.theme.colors.sidebar.background.default};
  overflow: hidden;
`

const RangeInput = styled.input.attrs({
  type: 'range',
})``

const RoundedBorders = styled.div`
  width: 150px;
  height: 150px;
  background-color: ${props => props.theme.colors.sidebar.background.default};
  border: solid 1px ${props => props.theme.colors.sidebar.border};
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

export const AvatarFileUpload: React.FunctionComponent<
  AvatarFileUploadProps
> = ({
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
  <Sidebar>
    <SidebarContent>
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
    </SidebarContent>
  </Sidebar>
)
