import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { aliceBlue, altoGrey } from '../../colors'
import { styled } from '../../theme'
import { ManuscriptBlueButton, TransparentGreyButton } from '../Button'
import { ImportProps } from '../ImportContainer'
import { Sidebar, SidebarContent } from '../Sidebar'
import ImportAvatarContainer from './ImportAvatarContainer'
import { AvatarProps } from './ProfilePageSidebar'

const DropZone = styled.div`
  width: 150px;
  height: 150px;
  background-color: #f8fbfe;
  border: dashed 3px ${altoGrey};
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
  color: #353535;
`

const UploadBoxInnerText = styled.div`
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.4px;
  text-align: center;
  color: #97a2b1;
`

const UploadBoxBrowse = styled.span`
  margin: 0 2px;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.4px;
  text-align: center;
  color: #7fb5d5;
  cursor: pointer;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const SaveAvatarButton = styled(ManuscriptBlueButton)`
  margin-bottom: 10px;
  width: 50%;
`

const CancelButton = styled(TransparentGreyButton)`
  margin-bottom: 10px;
  width: 50%;
`

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  background-color: ${aliceBlue};
  overflow: hidden;
`

const RangeInput = styled.input.attrs({
  type: 'range',
})``

export interface AvatarFileUploadProps {
  avatar: AvatarProps | null
  avatarZoom: number
  avatarEditorRef: React.RefObject<AvatarEditor>
  importAvatar: (avatar: File) => void
  handleCancel: () => void
  handleSaveAvatar: () => void
  handleAvatarZoom: (event: React.FormEvent<HTMLInputElement>) => void
}

export const AvatarFileUpload: React.FunctionComponent<
  AvatarFileUploadProps
> = ({
  avatar,
  avatarZoom,
  avatarEditorRef,
  importAvatar,
  handleCancel,
  handleSaveAvatar,
  handleAvatarZoom,
}) => (
  <Sidebar>
    <SidebarContent>
      {!avatar ? (
        <ImportAvatarContainer
          importAvatar={importAvatar}
          render={({ isImporting, isOver }: ImportProps) => (
            <UploadContainer isOver={isOver}>
              <DropZone />
              <UploadBox>
                {isImporting ? (
                  <UploadLabel>Importing…</UploadLabel>
                ) : (
                  <React.Fragment>
                    <UploadLabel>Drag file above</UploadLabel>
                    <UploadBoxInnerText>
                      or <UploadBoxBrowse>browse</UploadBoxBrowse> for a file
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
            image={avatar.src}
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
        <SaveAvatarButton onClick={handleSaveAvatar} disabled={!avatar}>
          Save Avatar
        </SaveAvatarButton>
        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
      </ButtonsContainer>
    </SidebarContent>
  </Sidebar>
)
