/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */
import {
  FileAttachment,
  insertAttachment,
  insertSupplement,
} from '@manuscripts/body-editor'
import React, { useCallback, useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'
import { FileActions } from './FileActions'
import { FileContainer } from './FileContainer'
import { FileCreatedDate } from './FileCreatedDate'
import { FileSectionType } from './FileManager'
import { FileName } from './FileName'
import {
  FileSectionAlert,
  FileSectionAlertType,
  setUploadProgressAlert,
} from './FileSectionAlert'
import { FileUploader } from './FileUploader'

/**
 * This component represents the other files in the file section.
 */
export const OtherFilesSection: React.FC<{
  files: FileAttachment[]
}> = ({ files }) => {
  const [{ view, fileManagement }] = useStore((s) => ({
    view: s.view,
    fileManagement: s.fileManagement,
  }))

  const can = usePermissions()

  const [alert, setAlert] = useState({
    type: FileSectionAlertType.NONE,
    message: '',
  })

  if (!view) {
    return null
  }

  const handleUpload = async (file: File) => {
    setAlert({
      type: FileSectionAlertType.UPLOAD_IN_PROGRESS,
      message: file.name,
    })
    try {
      await fileManagement.upload(
        file,
        setUploadProgressAlert(setAlert, FileSectionType.OtherFile)
      )
      setAlert({
        type: FileSectionAlertType.UPLOAD_SUCCESSFUL,
        message: '',
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

  const moveToSupplements = async (file: FileAttachment) => {
    insertSupplement(file, view)
    setAlert({
      type: FileSectionAlertType.MOVE_SUCCESSFUL,
      message: FileSectionType.Supplements,
    })
  }

  const asMainDocument = async (file: FileAttachment) => {
    insertAttachment(file, view.state, 'document', view.dispatch)
    setAlert({
      type: FileSectionAlertType.MOVE_SUCCESSFUL,
      message: FileSectionType.MainFile,
    })
  }

  return (
    <div>
      {can?.uploadFile && (
        <FileUploader
          onUpload={handleUpload}
          placeholder="Drag or click to upload a new file"
        />
      )}
      <FileSectionAlert alert={alert} />
      {files.map((file) => (
        <OtherFile
          key={file.id}
          file={file}
          onDownload={() => fileManagement.download(file)}
          onMoveToSupplements={async () => await moveToSupplements(file)}
          onUseAsMain={async () => await asMainDocument(file)}
        />
      ))}
    </div>
  )
}

const OtherFile: React.FC<{
  file: FileAttachment
  onDownload: () => void
  onMoveToSupplements: () => Promise<void>
  onUseAsMain: () => Promise<void>
}> = ({ file, onDownload, onMoveToSupplements, onUseAsMain }) => {
  const [{ isDragging }, dragRef, preview] = useDrag({
    type: 'file',
    item: {
      file,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const drag = useCallback(
    (node: HTMLDivElement | null) => {
      dragRef(node)
    },
    [dragRef]
  )

  useEffect(() => {
    preview(getEmptyImage())
  }, [preview])

  return (
    <FileContainer
      key={file.id}
      data-cy="file-container"
      ref={drag}
      className={isDragging ? 'dragging' : ''}
      tabIndex={0}
    >
      <FileName file={file} />
      <FileCreatedDate file={file} className="show-on-hover" />
      <FileActions
        sectionType={FileSectionType.OtherFile}
        onDownload={onDownload}
        onUseAsMain={onUseAsMain}
        move={{
          sectionType: FileSectionType.Supplements,
          handler: onMoveToSupplements,
        }}
        file={file}
      />
    </FileContainer>
  )
}
