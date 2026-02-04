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
} from '@manuscripts/style-guide'
import { skipTracking } from '@manuscripts/track-changes-plugin'
import { NodeSelection } from 'prosemirror-state'
import React, { useState } from 'react'
import styled from 'styled-components'

import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'
import { FileActions } from './FileActions'
import { FileContainer } from './FileContainer'
import { FileSectionType } from './FileManager'
import { FileName } from './FileName'
import {
  FileSectionAlert,
  FileSectionAlertType,
  setUploadProgressAlert,
} from './FileSectionAlert'
import { FileUploader } from './FileUploader'

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
    return null
  }

  const uploadFile = async (file: File) => {
    setAlert({
      type: FileSectionAlertType.UPLOAD_IN_PROGRESS,
      message: file.name,
    })
    try {
      const uploaded = await fileManagement.upload(
        file,
        setUploadProgressAlert(setAlert, FileSectionType.MainFile)
      )
      insertAttachment(uploaded, view.state, 'document', view.dispatch)
      setAlert({
        type: FileSectionAlertType.UPLOAD_SUCCESSFUL,
        message: '',
      })
      return uploaded
    } catch (error) {
      const errorMessage = error
        ? error.cause?.result
        : error.message || 'Unknown error occurred'
      setAlert({
        type: FileSectionAlertType.UPLOAD_ERROR,
        message: errorMessage,
      })
      throw error
    }
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

  const replaceFile = async () => {
    setConfirmDialogOpen(false)
    if (fileToUpload) {
      setAlert({
        type: FileSectionAlertType.UPLOAD_IN_PROGRESS,
        message: fileToUpload.name,
      })
      try {
        const uploaded = await fileManagement.upload(
          fileToUpload,
          setUploadProgressAlert(setAlert, FileSectionType.MainFile)
        )
        insertAttachment(uploaded, view.state, 'document', view.dispatch)
        setAlert({
          type: FileSectionAlertType.REPLACE_SUCCESSFUL,
          message: fileToUpload.name,
        })
      } catch (error) {
        const errorMessage = error
          ? error.cause?.result
          : error.message || 'Unknown error occurred'
        setAlert({
          type: FileSectionAlertType.UPLOAD_ERROR,
          message: errorMessage,
        })
      }
    }
  }

  const handleMainDocumentClick = (pos?: number) => {
    if (!pos) {
      return
    }
    const tr = view.state.tr
    tr.setSelection(NodeSelection.create(view.state.doc, pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
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

  const isPDF = (file: any) => {
    if (file.name && file.name.toLowerCase().endsWith('.pdf')) {
      return true
    }

    return false
  }

  return (
    <div>
      {mainDocument ? (
        <FileContainer
          data-cy="file-container"
          onClick={(e) => {
            e.stopPropagation()
            if (isPDF(mainDocument.file)) {
              handleMainDocumentClick(mainDocument.pos)
            }
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.currentTarget === document.activeElement
            ) {
              e.stopPropagation()
              if (isPDF(mainDocument.file)) {
                handleMainDocumentClick(mainDocument.pos)
              }
            }
          }}
        >
          <FileName
            file={mainDocument.file}
            label="Main"
            icon={FileMainDocumentIcon}
          />
          <FileActions
            data-cy="file-actions"
            sectionType={FileSectionType.MainFile}
            onDownload={handleDownload}
            onReplace={handleReplace}
            move={{
              sectionType: FileSectionType.OtherFile,
              handler: () => handleMove(mainDocument),
            }}
            file={mainDocument.file}
            accept=".docx, .doc, .pdf, .xml, .tex"
          />
        </FileContainer>
      ) : (
        can?.uploadFile && (
          <MainDocumentTitle>Upload main document</MainDocumentTitle>
        )
      )}
      {can?.uploadFile && (
        <FileUploader
          onUpload={handleUpload}
          placeholder="Drag or click to replace with a new file"
          accept=".docx, .doc, .pdf, .xml, .tex"
        />
      )}
      <FileSectionAlert alert={alert} />

      <Dialog
        isOpen={isConfirmDialogOpen}
        category={Category.confirmation}
        header="Replace main document"
        message={
          <>
            This action will replace the current main document file with this
            one!
            <br />
            <br />
            Do you want to continue?
          </>
        }
        actions={{
          primary: {
            action: replaceFile,
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
