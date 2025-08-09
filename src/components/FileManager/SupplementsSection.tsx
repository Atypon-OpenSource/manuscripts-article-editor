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
  insertAttachment,
  insertSupplement,
  NodeFile,
} from '@manuscripts/body-editor'
import { usePermissions } from '@manuscripts/style-guide'
import { skipTracking } from '@manuscripts/track-changes-plugin'
import React, { useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { useStore } from '../../store'
import { FileActions } from './FileActions'
import { FileContainer } from './FileContainer'
import { FileCreatedDate } from './FileCreatedDate'
import { FileSectionType, Replace } from './FileManager'
import { FileName } from './FileName'
import {
  FileSectionAlert,
  FileSectionAlertType,
  setUploadProgressAlert,
} from './FileSectionAlert'
import { FileUploader } from './FileUploader'

export type SupplementsSectionProps = {
  supplements: NodeFile[]
}

/**
 * This component represents the other files in the file section.
 */
export const SupplementsSection: React.FC<SupplementsSectionProps> = ({
  supplements,
}) => {
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

  const upload = async (file: File) => {
    setAlert({
      type: FileSectionAlertType.UPLOAD_IN_PROGRESS,
      message: file.name,
    })
    const uploaded = await fileManagement.upload(
      file,
      setUploadProgressAlert(setAlert, FileSectionType.Supplements)
    )
    setAlert({
      type: FileSectionAlertType.UPLOAD_SUCCESSFUL,
      message: '',
    })
    return uploaded
  }

  const handleUpload = async (file: File) => {
    const uploaded = await upload(file)
    insertSupplement(uploaded, view.state, view.dispatch)
  }

  const handleReplace = async (supplement: NodeFile, file: File) => {
    const uploaded = await upload(file)
    const tr = view.state.tr
    tr.setNodeAttribute(supplement.pos, 'href', uploaded.id)
    view.dispatch(skipTracking(tr))
  }

  const handleMoveToOtherFiles = (supplement: NodeFile) => {
    const tr = view.state.tr
    const from = supplement.pos
    const to = from + supplement.node.nodeSize
    tr.delete(from, to)
    view.dispatch(skipTracking(tr))
    setAlert({
      type: FileSectionAlertType.MOVE_SUCCESSFUL,
      message: FileSectionType.OtherFile,
    })
  }

  const handleUseAsMain = async (supplement: NodeFile) => {
    const tr = view.state.tr
    const from = supplement.pos
    const to = from + supplement.node.nodeSize
    tr.delete(from, to)
    view.dispatch(skipTracking(tr))
    insertAttachment(supplement.file, view.state, 'document', view.dispatch)

    setAlert({
      type: FileSectionAlertType.MOVE_SUCCESSFUL,
      message: FileSectionType.MainFile,
    })
  }

  return (
    <>
      {can?.uploadFile && (
        <FileUploader
          onUpload={handleUpload}
          placeholder="Drag or click to upload a new file"
        />
      )}
      <FileSectionAlert alert={alert} />
      {supplements.map((supplement) => (
        <SupplementFile
          key={supplement.node.attrs.id}
          supplement={supplement}
          onDownload={() => fileManagement.download(supplement.file)}
          onReplace={async (f) => await handleReplace(supplement, f)}
          onDetach={() => handleMoveToOtherFiles(supplement)}
          onUseAsMain={() => handleUseAsMain(supplement)}
        />
      ))}
    </>
  )
}

const SupplementFile: React.FC<{
  supplement: NodeFile
  onDownload: () => void
  onReplace: Replace
  onDetach: () => void
  onUseAsMain: () => Promise<void>
}> = ({ supplement, onDownload, onReplace, onDetach, onUseAsMain }) => {
  const [{ isDragging }, dragRef, preview] = useDrag({
    type: 'file',
    item: {
      file: supplement.file,
    },
    end: (_, monitor) => {
      if (monitor.didDrop()) {
        onDetach()
      }
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
      data-cy="file-container"
      key={supplement.file.id}
      ref={dragRef}
      className={isDragging ? 'dragging' : ''}
    >
      <FileName file={supplement.file} />
      <FileCreatedDate file={supplement.file} className="show-on-hover" />
      <FileActions
        data-cy="file-actions"
        sectionType={FileSectionType.Supplements}
        onDownload={supplement.file ? onDownload : undefined}
        onReplace={onReplace}
        move={
          supplement.file
            ? {
                sectionType: FileSectionType.OtherFile,
                handler: onDetach,
              }
            : undefined
        }
        onUseAsMain={onUseAsMain}
        file={supplement.file}
      />
    </FileContainer>
  )
}
