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
  Category,
  Dialog,
  DotsIcon,
  DropdownContainer,
  DropdownList,
  useDropdown,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { ChangeEvent, useRef, useState } from 'react'
import styled from 'styled-components'

import { FileSectionType, Move, Replace } from './FileManager'

/**
 * This component represents the drop-down list action for each file item.
 */
export const FileActions: React.FC<{
  sectionType: FileSectionType
  onDownload?: () => void
  onReplace?: Replace
  onDetach?: () => void
  move?: Move
  className?: string
}> = ({ sectionType, onDownload, onReplace, onDetach, move, className }) => {
  const can = usePermissions()
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()
  const [isMoveDialogOpen, setMoveDialogOpen] = useState<boolean>(false)

  const showDownload = can?.downloadFiles && onDownload
  const showReplace = can?.replaceFile && onReplace
  const showDetach = can?.detachFile && onDetach
  const showMove = can?.moveFile && move

  const show = showDownload || showReplace || showDetach || showMove

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (onReplace && event && event.target && event.target.files) {
      const file = event.target.files[0]
      await onReplace(file)
    }
  }

  const openFileDialog = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  if (!show) {
    return null
  }

  return (
    <DropdownContainer ref={wrapperRef}>
      <ActionsIcon
        onClick={toggleOpen}
        type="button"
        className="show-on-hover"
        data-cy="file-actions"
        aria-label="Actions"
        aria-pressed={isOpen}
      >
        <DotsIcon />
      </ActionsIcon>
      {isOpen && (
        <FileActionDropdownList
          data-cy="file-actions-dropdown"
          direction="right"
          className={className}
          width={192}
          top={5}
          onClick={toggleOpen}
        >
          {showDownload && (
            <FileAction onClick={onDownload}>Download</FileAction>
          )}
          {showReplace && (
            <>
              <FileAction onClick={openFileDialog}>Replace</FileAction>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleChange}
              />
            </>
          )}
          {showDetach && <FileAction onClick={onDetach}>Detach</FileAction>}
          {showMove && (
            <FileAction onClick={() => setMoveDialogOpen(true)}>
              Move to {move.sectionType}
            </FileAction>
          )}
        </FileActionDropdownList>
      )}
      {showMove && (
        <MoveFileConfirmationDialog
          data-cy="file-move-confirm-dialog"
          isOpen={isMoveDialogOpen}
          close={() => setMoveDialogOpen(false)}
          source={sectionType}
          target={move.sectionType}
          handleMove={move.handler}
        />
      )}
    </DropdownContainer>
  )
}

const MoveFileConfirmationDialog: React.FC<{
  isOpen: boolean
  close: () => void
  source: FileSectionType
  target: FileSectionType
  handleMove: () => void
}> = ({ isOpen, close, source, target, handleMove }) => {
  const header = `Are you sure you want to move this file to “${target}”?`
  const message = `The file will be removed from “${source}” and added to “${target}”.`

  const handleConfirm = () => {
    handleMove()
    close()
  }

  return (
    <Dialog
      isOpen={isOpen}
      category={Category.confirmation}
      header={header}
      message={message}
      actions={{
        primary: {
          action: handleConfirm,
          title: 'Move',
        },
        secondary: {
          action: () => close(),
          title: 'Cancel',
        },
      }}
    />
  )
}

export const ActionsIcon = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0 8px;
  &:focus {
    outline: none;
  }
  &:hover svg circle {
    fill: #1a9bc7;
  }
`

export const FileActionDropdownList = styled(DropdownList)`
  border: 1px solid #e2e2e2;
  box-sizing: border-box;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  min-width: 180px;
  background: ${(props) => props.theme.colors.background.primary};
  z-index: 999;
  text-align: left;
  overflow: hidden;
`

export const FileAction = styled.div`
  font-family: ${(props) => props.theme.font.family.Lato};
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 16px;
  &:hover,
  &:focus {
    background: #f2fbfc;
  }
`
