/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import { insertAttachment, NodeFile } from '@manuscripts/body-editor'
import {
  Category,
  Dialog,
  FileMainDocumentIcon,
  usePermissions,
} from '@manuscripts/style-guide'
import { skipTracking } from '@manuscripts/track-changes-plugin'
import React, { useState } from 'react'
import styled from 'styled-components'

import { useStore } from '../../store'
import { FileActions } from './FileActions'
import { FileSectionType } from './FileManager'
import { FileSectionAlert, FileSectionAlertType } from './FileSectionAlert'
import { FileUploader } from './FileUploader'

const MainDocumentContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 26px 16px;
  gap: 12px;
  position: relative;
  &:hover {
    background-color: #f2fbfc;
  }
`

const MainDocumentInfo = styled.div`
  display: flex;
  flex: 1;
`

const MainDocumentTitle = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 0 16px 8px 16px;
  gap: 12px;
  position: relative;
`

const Label = styled.span`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 16px;
  margin-right: 3.2px;
  font-weight: 700;
`

const FileName = styled.span`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 16px;
`

export const MainFilesSection: React.FC<{ mainDocument: NodeFile }> = ({
  mainDocument,
}) => {
  const [{ fileManagement, view }] = useStore((s) => ({
    fileManagement: s.fileManagement,
    view: s.view,
  }))

  const can = usePermissions()

  const [alert, setAlert] = useState({
    type: FileSectionAlertType.NONE,
    message: '',
  })

  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)

  const handleUpload = async (file: File) => {
    if (mainDocument) {
      setFileToUpload(file)
      setConfirmDialogOpen(true)
    } else {
      await uploadFile(file)
    }
  }
  if (!view) {
    return
  }

  const uploadFile = async (file: File) => {
    setAlert({
      type: FileSectionAlertType.UPLOAD_IN_PROGRESS,
      message: file.name,
    })
    const uploaded = await fileManagement.upload(file)
    insertAttachment(uploaded, view.state, 'document', view.dispatch)
    setAlert({
      type: FileSectionAlertType.UPLOAD_SUCCESSFUL,
      message: '',
    })
    return uploaded
  }

  const handleDownload = () => {
    if (mainDocument) {
      fileManagement.download(mainDocument.file)
    }
  }

  const handleReplace = async (file: File) => {
    setFileToUpload(file)
    setConfirmDialogOpen(true)
  }
  const handleMove = (mainFile: NodeFile) => {
    const tr = view.state.tr
    const from = mainFile.pos
    const to = from + mainFile.node.nodeSize
    tr.delete(from, to)
    view.dispatch(skipTracking(tr))
    setAlert({
      type: FileSectionAlertType.MOVE_SUCCESSFUL,
      message: FileSectionType.OtherFile,
    })
  }

  return (
    <div>
      {mainDocument ? (
        <MainDocumentContainer data-cy="file-container">
          <FileMainDocumentIcon />
          <MainDocumentInfo>
            <Label>Main:</Label>
            <FileName>{mainDocument.file.name}</FileName>
          </MainDocumentInfo>
          <FileActions
            data-cy="file-actions"
            sectionType={FileSectionType.MainFile}
            onDownload={handleDownload}
            onReplace={handleReplace}
            move={{
              sectionType: FileSectionType.OtherFile,
              handler: () => handleMove(mainDocument),
            }}
          />
        </MainDocumentContainer>
      ) : (
        <MainDocumentTitle>Upload main document</MainDocumentTitle>
      )}
      {can?.uploadFile && (
        <FileUploader
          onUpload={handleUpload}
          placeholder="Drag or click to replace with a new file"
          accept=".docx, .doc, .pdf, .xml"
        />
      )}
      <FileSectionAlert alert={alert} />

      <Dialog
        isOpen={isConfirmDialogOpen}
        category={Category.confirmation}
        header="Replace Main Document"
        message={`This action will replace the current main document file with this one! </br> </br> Do you want to continue?`}
        actions={{
          primary: {
            action: async () => {
              if (fileToUpload) {
                const uploaded = await fileManagement.upload(fileToUpload)
                const tr = view.state.tr
                tr.setNodeAttribute(mainDocument.pos, 'href', uploaded.id)
                view.dispatch(skipTracking(tr))
              }
              setConfirmDialogOpen(false)
              setAlert({
                type: FileSectionAlertType.REPLACE_SUCCESSFUL,
                message: FileSectionType.MainFile,
              })
            },
            title: 'Replace',
          },
          secondary: {
            action: () => {
              setFileToUpload(null)
              setConfirmDialogOpen(false)
            },
            title: 'Cancel',
          },
        }}
      />
    </div>
  )
}
