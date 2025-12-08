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
import { NodeFile } from '@manuscripts/body-editor'
import { ToggleHeader } from '@manuscripts/style-guide'
import { NodeSelection } from 'prosemirror-state'
import React, { useState } from 'react'

import { useStore } from '../../store'
import { FileActions } from './FileActions'
import { FileContainer } from './FileContainer'
import { FileCreatedDate } from './FileCreatedDate'
import { FileSectionType, Replace } from './FileManager'
import { FileName } from './FileName'
import { FileSectionAlert, FileSectionAlertType } from './FileSectionAlert'

type LinkedFilesSectionProps = {
  linkedFiles: NodeFile[]
}

/**
 * This component represents the section for linked supplemental files.
 */
export const LinkedFilesSection: React.FC<LinkedFilesSectionProps> = ({
  linkedFiles,
}) => {
  const [isOpen, setIsOpen] = useState(true) // it is open by default
  const toggleVisibility = () => setIsOpen((prev) => !prev)

  const [{ view, fileManagement }] = useStore((s) => ({
    view: s.view,
    fileManagement: s.fileManagement,
  }))

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
    const uploaded = await fileManagement.upload(file)
    setAlert({
      type: FileSectionAlertType.UPLOAD_SUCCESSFUL,
      message: '',
    })
    return uploaded
  }

  const handleReplace = async (linkedFile: NodeFile, file: File) => {
    const uploaded = await upload(file)
    const pos = linkedFile.pos
    const tr = view.state.tr
    tr.setNodeAttribute(pos, 'extLink', uploaded.id)
    tr.setSelection(NodeSelection.create(tr.doc, pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleMoveToOtherFiles = (linkedFile: NodeFile) => {
    const tr = view.state.tr
    const pos = linkedFile.pos
    tr.setNodeAttribute(pos, 'extLink', '')
    tr.setSelection(NodeSelection.create(tr.doc, pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
    setAlert({
      type: FileSectionAlertType.MOVE_SUCCESSFUL,
      message: FileSectionType.OtherFile,
    })
  }

  return (
    <div data-cy="linked-files-section">
      <ToggleHeader
        title="Linked files"
        isOpen={isOpen}
        onToggle={toggleVisibility}
      />
      {isOpen && (
        <>
          <FileSectionAlert alert={alert} />
          {linkedFiles.map((file) => (
            <LinkedFile
              key={file.node.attrs.id}
              linkedFile={file}
              onDownload={() => fileManagement.download(file.file)}
              onReplace={(f) => handleReplace(file, f)}
              onDetach={() => handleMoveToOtherFiles(file)}
            />
          ))}
        </>
      )}
    </div>
  )
}

const LinkedFile: React.FC<{
  linkedFile: NodeFile
  onDownload: () => void
  onReplace: Replace
  onDetach: () => void
}> = ({ linkedFile, onDownload, onReplace, onDetach }) => {
  return (
    <FileContainer data-cy="file-container">
      <FileName file={linkedFile.file} />
      <FileCreatedDate file={linkedFile.file} className="show-on-hover" />
      <FileActions
        data-cy="file-actions"
        sectionType={FileSectionType.Supplements}
        onDownload={linkedFile.file ? onDownload : undefined}
        onReplace={onReplace}
        move={
          linkedFile.file
            ? {
                sectionType: FileSectionType.OtherFile,
                handler: onDetach,
              }
            : undefined
        }
        file={linkedFile.file}
      />
    </FileContainer>
  )
}
