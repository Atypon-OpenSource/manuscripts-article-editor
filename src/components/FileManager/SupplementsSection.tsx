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
import { ToggleHeader } from '@manuscripts/style-guide'
import { skipTracking } from '@manuscripts/track-changes-plugin'
import { schema } from '@manuscripts/transform'
import { NodeSelection } from 'prosemirror-state'
import { findParentNodeClosestToPos } from 'prosemirror-utils'
import React, { useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { usePermissions } from '../../lib/capabilities'
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
  const [isOpen, setIsOpen] = useState(false)
  const toggleVisibility = () => setIsOpen((prev) => !prev)

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

  const handleClick = (element: NodeFile) => {
    const tr = view.state.tr
    tr.setSelection(NodeSelection.create(view.state.doc, element.pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const upload = async (file: File) => {
    setAlert({
      type: FileSectionAlertType.UPLOAD_IN_PROGRESS,
      message: file.name,
    })
    try {
      const uploaded = await fileManagement.upload(
        file,
        setUploadProgressAlert(setAlert, FileSectionType.Supplements)
      )
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

  const handleUpload = async (file: File) => {
    const uploaded = await upload(file)
    insertSupplement(uploaded, view)
  }

  const handleReplace = async (supplement: NodeFile, file: File) => {
    const uploaded = await upload(file)
    const tr = view.state.tr
    tr.setNodeAttribute(supplement.pos, 'href', uploaded.id)
    view.dispatch(tr)
  }

  const handleMoveToOtherFiles = (supplement: NodeFile) => {
    const tr = view.state.tr
    const from = supplement.pos
    const to = from + supplement.node.nodeSize

    const resolvedPos = view.state.doc.resolve(from)
    const supplementsNodeWithPos = findParentNodeClosestToPos(
      resolvedPos,
      (node) => node.type === schema.nodes.supplements
    )

    if (!supplementsNodeWithPos) {
      return
    }

    const { node: supplementsNode, pos: supplementsPos } =
      supplementsNodeWithPos

    // supplements has title + supplements children
    const lastSupplement = supplementsNode.childCount === 2

    if (lastSupplement) {
      // delete the whole supplements section
      tr.delete(supplementsPos, supplementsPos + supplementsNode.nodeSize)
    } else {
      // just delete the supplement itself
      tr.delete(from, to)
    }
    view.dispatch(tr)
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
    <div data-cy="supplements-section">
      {can?.uploadFile && (
        <FileUploader
          onUpload={handleUpload}
          placeholder="Drag or click to upload a new file"
        />
      )}
      <ToggleHeader
        title="Supplement files"
        isOpen={isOpen}
        onToggle={toggleVisibility}
      />
      {isOpen && (
        <>
          <FileSectionAlert alert={alert} />
          {supplements.map((supplement) => (
            <SupplementFile
              key={supplement.node.attrs.id}
              supplement={supplement}
              onDownload={() => fileManagement.download(supplement.file)}
              onReplace={async (f) => await handleReplace(supplement, f)}
              onDetach={() => handleMoveToOtherFiles(supplement)}
              onUseAsMain={() => handleUseAsMain(supplement)}
              onClick={() => handleClick(supplement)}
            />
          ))}
        </>
      )}
    </div>
  )
}

const SupplementFile: React.FC<{
  supplement: NodeFile
  onDownload: () => void
  onReplace: Replace
  onDetach: () => void
  onUseAsMain: () => Promise<void>
  onClick: () => void
}> = ({
  supplement,
  onDownload,
  onReplace,
  onDetach,
  onUseAsMain,
  onClick,
}) => {
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
      onClick={onClick}
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
