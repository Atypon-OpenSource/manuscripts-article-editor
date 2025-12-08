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
import { FileAttachment } from '@manuscripts/body-editor'
import {
  AttentionOrangeIcon,
  Category,
  Dialog,
  DotsIcon,
  DropdownContainer,
  DropdownList,
  useDropdown,
} from '@manuscripts/style-guide'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { usePermissions } from '../../lib/capabilities'
import { FileSectionType, Move, Replace } from './FileManager'

/**
 * This component represents the drop-down list action for each file item.
 */
export const FileActions: React.FC<{
  sectionType: FileSectionType
  onDownload?: () => void
  onReplace?: Replace
  onDetach?: () => void
  onDelete?: () => void
  onUseAsMain?: () => void
  move?: Move
  className?: string
  file?: FileAttachment
  accept?: string
}> = ({
  sectionType,
  onDownload,
  onReplace,
  onDetach,
  onDelete,
  onUseAsMain,
  move,
  className,
  file,
  accept,
}) => {
  const can = usePermissions()
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()
  const [isMoveDialogOpen, setMoveDialogOpen] = useState<boolean>(false)
  const [isUseAsMainDialogOpen, setUseAsMainDialogOpen] =
    useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const triggerRef = useRef<HTMLButtonElement>(null)

  const showDownload = can?.downloadFiles && onDownload
  const showReplace = can?.replaceFile && onReplace
  const showDetach = can?.detachFile && onDetach
  const showDelete = can?.detachFile && onDelete
  const showMove = can?.moveFile && move
  const showUseAsMain =
    can?.moveFile && onUseAsMain && isValidMainDocumentFormat(file)

  const show =
    showDownload || showReplace || showDetach || showMove || showUseAsMain

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (onReplace && event?.target?.files?.[0]) {
      await onReplace(event.target.files[0])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const openFileDialog = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Fix: Close dropdown when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        toggleOpen()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, wrapperRef, toggleOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => itemRefs.current[0]?.focus(), 0)
    }
  }, [isOpen])

  if (!show) {
    return null
  }

  const closeDropdown = () => {
    toggleOpen()
    triggerRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = itemRefs.current.filter(Boolean)
    if (items.length === 0) {
      return
    }

    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    if (index < 0) {
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closeDropdown()
        break

      case 'ArrowDown':
        e.preventDefault()
        items[(index + 1) % items.length]?.focus()
        break

      case 'ArrowUp':
        e.preventDefault()
        items[(index - 1 + items.length) % items.length]?.focus()
        break
    }
  }

  // Index counter for refs
  let refIndex = 0

  return (
    <DropdownContainer ref={wrapperRef}>
      <ActionsIcon
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation()
          toggleOpen()
        }}
        type="button"
        className="show-on-hover"
        data-cy="file-actions"
        aria-label="File Actions"
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
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {showDownload && (
            <FileAction
              onClick={onDownload}
              ref={(el) => {
                itemRefs.current[refIndex++] = el
              }}
            >
              Download
            </FileAction>
          )}
          {showReplace && (
            <>
              <FileAction
                onClick={openFileDialog}
                ref={(el) => {
                itemRefs.current[refIndex++] = el
              }}
              >
                Replace
              </FileAction>

              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleChange}
                accept={accept}
              />
            </>
          )}
          {showDetach && (
            <FileAction
              onClick={onDetach}
              ref={(el) => {
                itemRefs.current[refIndex++] = el
              }}
            >
              Detach
            </FileAction>
          )}

          {showDelete && (
            <FileAction
              onClick={onDelete}
              ref={(el) => {
                itemRefs.current[refIndex++] = el
              }}
            >
              Delete
            </FileAction>
          )}

          {showMove && (
            <FileAction
              onClick={() => setMoveDialogOpen(true)}
              ref={(el) => {
                itemRefs.current[refIndex++] = el
              }}
            >
              Move to {move.sectionType}
            </FileAction>
          )}
          {showUseAsMain && (
            <FileAction
              onClick={() => setUseAsMainDialogOpen(true)}
              ref={(el) => {
                itemRefs.current[refIndex++] = el
              }}
            >
              Use as main document
            </FileAction>
          )}
        </FileActionDropdownList>
      )}
      {showMove && (
        <MoveFileConfirmationDialog
          isOpen={isMoveDialogOpen}
          close={() => setMoveDialogOpen(false)}
          source={sectionType}
          target={move.sectionType}
          handleMove={move.handler}
        />
      )}
      {showUseAsMain && (
        <UseAsMainConfirmationDialog
          data-cy="file-use-as-main-confirm-dialog"
          isOpen={isUseAsMainDialogOpen}
          close={() => setUseAsMainDialogOpen(false)}
          handleUseAsMain={onUseAsMain}
        />
      )}
    </DropdownContainer>
  )
}

const UseAsMainConfirmationDialog: React.FC<{
  isOpen: boolean
  close: () => void
  handleUseAsMain: () => void
}> = ({ isOpen, close, handleUseAsMain }) => {
  const header = (
    <>
      <StyledIcon />
      Use as main document
    </>
  )
  const message = (
    <>
      This action will replace the current main document file with this one!
      <br />
      <br />
      Do you want to continue?
    </>
  )

  const handleConfirm = () => {
    handleUseAsMain()
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
          title: 'Replace',
        },
        secondary: {
          action: () => close(),
          title: 'Cancel',
        },
      }}
    />
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

const StyledIcon = styled(AttentionOrangeIcon)`
  margin-right: 8px;
`

export const ActionsIcon = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0 8px;
  &:focus {
    outline: none;
  }
  &:hover svg circle,
  &:focus-visible svg circle {
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

export const FileAction = styled.button`
  font-family: ${(props) => props.theme.font.family.Lato};
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 16px;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;

  &:hover,
  &:focus,
  &:focus-visible {
    background: #f2fbfc;
    outline: none;
  }
`

const isValidMainDocumentFormat = (file?: FileAttachment): boolean => {
  if (!file) {
    return false
  }

  const validExtensions = ['.docx', '.doc', '.pdf', '.xml', '.tex']

  return validExtensions.some((ext) =>
    file.name.toLowerCase().endsWith(ext.toLowerCase())
  )
}
