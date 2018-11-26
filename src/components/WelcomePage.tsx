import { Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import AddFile from '../icons/welcome/add-file'
import App from '../icons/welcome/app'
import DocFile from '../icons/welcome/doc-file'
import Feedback from '../icons/welcome/feedback'
import MarkdownFile from '../icons/welcome/markdown-file'
import Project from '../icons/welcome/project'
import TextFile from '../icons/welcome/text-file'
import { styled, ThemedProps } from '../theme'
import ImportContainer, { ImportProps } from './ImportContainer'
import { SimpleModal } from './SimpleModal'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const Container = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 15px 0 rgba(147, 159, 173, 0.36);
`

const WelcomeHeader = styled.div`
  text-align: center;
  padding: 30px 30px 50px;
`

const WelcomeTitle = styled.div`
  font-size: 36px;
  font-weight: 300;
  line-height: 0.72;
  letter-spacing: -0.9px;
  color: #353535;
  display: inline-block;
`

const WelcomeFooter = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
`

const ShowAgainLabel = styled.label`
  font-size: 12px;
  letter-spacing: -0.2px;
  color: #9b9b9b;
  display: inline-block;
  margin-left: 5px;
`

const PanelGroup = styled.div`
  display: flex;
  border-bottom: solid 1px #f2f8ff;
  border-top: solid 1px #f2f8ff;
`

const Sidebar = styled.div`
  flex: 1;
  padding-bottom: 20px;
  background-color: #f8fbfe;
  min-width: 200px;
`

const Main = styled.div`
  flex: 2;
  padding: 20px 40px;
`

const SidebarHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
  width: 190px;
  border-radius: 5px;
  background-color: #ffffff;
  border: solid 1px #e9eff4;
  margin: 10px;
  padding: 20px;
  cursor: pointer;

  &:hover {
    outline: 4px solid rgba(77, 161, 255, 0.07);
  }
`

const Label = styled.span`
  font-size: 18px;
  font-weight: 300;
  line-height: 1.06;
  letter-spacing: normal;
  text-align: center;
  color: #4a4a4a;
  margin-top: 10px;
`

const UploadBox = styled.div`
  border-radius: 8px;
  background-color: #f1f5ff;
  border: dashed 3px
    ${(props: ImportProps) => (props.isOver ? '#6fb7ff' : '#acb8c7')};
  padding: 30px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`

const UploadLabel = styled.span`
  font-size: 18px;
  letter-spacing: -0.4px;
  color: #353535;
  display: inline-block;
  text-align: center;
`

const UploadBoxInnerText = styled(UploadLabel)`
  display: block;
  font-size: 16px;
  color: #939fad;
`

const UploadBoxBrowse = styled.span`
  margin: 0 2px;
  font-size: 16px;
  color: #7fb5d5;
  cursor: pointer;
`

const UploadFileTypes = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`

const UploadFileType = styled.span`
  display: inline-block;
  margin: 0 10px;
`

const AddFileIconHolder = styled.button`
  position: absolute;
  right: 10px;
  font-size: 16px;
  color: #7fb5d5;
  margin-top: -76px;
  border: 0;
  background: none;
  cursor: pointer;
`

const RecentFileIcon = styled.div`
  margin-left: 25px;
  margin-top: 30px;
  text-align: left;
  cursor: pointer;
`

const RecentFileName = styled.span`
  font-size: 18px;
  letter-spacing: -0.4px;
  text-align: left;
  color: #353535;
  margin-left: 10px;
`

const RecentFileHint = styled.span`
  font-size: 14px;
  letter-spacing: -0.3px;
  text-align: left;
  color: #868686;
  clear: both;
  display: block;
  margin-left: 30px;
  margin-top: 5px;
`

const OpenRecentFileLabel = styled.p`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.4px;
  text-align: left;
  color: #353535;
  margin-left: 25px;
`

export interface RecentFile {
  id: string
  containerID: string
  title: string
  description?: string
}

export interface WelcomeProps {
  recentFiles: RecentFile[]
  hideWelcome: boolean
  handleHideWelcomeChange: React.ChangeEventHandler<HTMLInputElement>
  handleClose: () => void
  createNewManuscript: () => void
  openManuscript: (file: RecentFile) => void
  sendFeedback: () => void
  importManuscript: (models: Model[]) => Promise<void>
}

export const WelcomePage: React.FunctionComponent<WelcomeProps> = ({
  recentFiles,
  hideWelcome,
  handleHideWelcomeChange,
  handleClose,
  createNewManuscript,
  sendFeedback,
  openManuscript,
  importManuscript,
}) => (
  <SimpleModal handleClose={handleClose}>
    <Container>
      <WelcomeHeader>
        <WelcomeTitle>Manuscripts.io</WelcomeTitle>
      </WelcomeHeader>

      <PanelGroup>
        <Sidebar>
          <SidebarHeader>
            <App size={118} />
          </SidebarHeader>

          <OpenRecentFileLabel>Open Recent</OpenRecentFileLabel>

          {recentFiles.map(file => (
            <RecentFileIcon key={file.id} onClick={() => openManuscript(file)}>
              <Project size={20} />
              <RecentFileName>{file.title}</RecentFileName>
              {file.description && (
                <RecentFileHint>{file.description}</RecentFileHint>
              )}
            </RecentFileIcon>
          ))}
        </Sidebar>

        <Main>
          <ActionButtons>
            <ActionButton onClick={createNewManuscript}>
              <Project size={50} />

              <Label>
                <div>
                  <b>Create</b> new
                </div>
                <div>manuscript</div>
              </Label>
            </ActionButton>

            <ActionButton onClick={sendFeedback}>
              <Feedback size={50} />

              <Label>
                <div>
                  <b>Send</b>
                </div>
                <div>feedback</div>
              </Label>
            </ActionButton>
          </ActionButtons>

          <ImportContainer
            importManuscript={importManuscript}
            render={({ isImporting, isOver }: ImportProps) => (
              <UploadBox isImporting={isImporting} isOver={isOver}>
                <AddFileIconHolder>
                  <AddFile size={64} />
                </AddFileIconHolder>

                {isImporting ? (
                  <UploadLabel>Importing…</UploadLabel>
                ) : (
                  <React.Fragment>
                    <UploadLabel>Drag file here to import</UploadLabel>

                    <UploadBoxInnerText>
                      or <UploadBoxBrowse>browse</UploadBoxBrowse> for a file
                    </UploadBoxInnerText>
                  </React.Fragment>
                )}

                <UploadFileTypes>
                  <UploadFileType>
                    <TextFile size={32} />
                  </UploadFileType>
                  <UploadFileType>
                    <DocFile size={32} />
                  </UploadFileType>
                  <UploadFileType>
                    <MarkdownFile size={32} />
                  </UploadFileType>
                </UploadFileTypes>
              </UploadBox>
            )}
          />
        </Main>
      </PanelGroup>

      <WelcomeFooter>
        <ShowAgainLabel>
          <input
            type="checkbox"
            onChange={handleHideWelcomeChange}
            checked={!hideWelcome}
          />
          Show this window after signing in
        </ShowAgainLabel>
      </WelcomeFooter>
    </Container>
  </SimpleModal>
)
