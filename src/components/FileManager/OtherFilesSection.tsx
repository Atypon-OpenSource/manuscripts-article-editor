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
import { FileAttachment, insertSupplement } from '@manuscripts/body-editor'
import { usePermissions } from '@manuscripts/style-guide'
import React, { useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { useStore } from '../../store'
import { FileActions } from './FileActions'
import { FileContainer } from './FileContainer'
import { FileCreatedDate } from './FileCreatedDate'
import { FileSectionType } from './FileManager'
import { FileName } from './FileName'
import { FileSectionAlert, FileSectionAlertType } from './FileSectionAlert'
import { FileUploader } from './FileUploader'

/**
 *  This component represents the other files in the file section.
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

  const handleUpload = async (file: File) => {
    setAlert({
      type: FileSectionAlertType.UPLOAD_IN_PROGRESS,
      message: file.name,
    })
    await fileManagement.upload(file)
    setAlert({
      type: FileSectionAlertType.UPLOAD_SUCCESSFUL,
      message: '',
    })
  }

  const moveToSupplements = async (file: FileAttachment) => {
    insertSupplement(file, view.state, view.dispatch)
    setAlert({
      type: FileSectionAlertType.MOVE_SUCCESSFUL,
      message: FileSectionType.Supplements,
    })
  }

  return (
    <div>
      {can?.uploadFile && <FileUploader onUpload={handleUpload} />}
      <FileSectionAlert alert={alert} />
      {files.map((file) => (
        <OtherFile
          key={file.id}
          file={file}
          onDownload={() => fileManagement.download(file)}
          onMoveToSupplements={async () => await moveToSupplements(file)}
        />
      ))}
    </div>
  )
}

const OtherFile: React.FC<{
  file: FileAttachment
  onDownload: () => void
  onMoveToSupplements: () => Promise<void>
}> = ({ file, onDownload, onMoveToSupplements }) => {
  const [{ isDragging }, dragRef, preview] = useDrag({
    type: 'file',
    item: {
      file,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    preview(getEmptyImage())
  }, [preview])

  return (
    <FileContainer
      key={file.id}
      data-cy="file-container"
      ref={dragRef}
      className={isDragging ? 'dragging' : ''}
    >
      <FileName file={file} />
      <FileCreatedDate file={file} className="show-on-hover" />
      <FileActions
        sectionType={FileSectionType.OtherFile}
        onDownload={onDownload}
        move={{
          sectionType: FileSectionType.Supplements,
          handler: onMoveToSupplements,
        }}
      />
    </FileContainer>
  )
}
