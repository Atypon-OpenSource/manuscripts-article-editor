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
import React, { ChangeEvent, useCallback, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import styled, { css } from 'styled-components'

type Files = {
  files: File[]
}

export interface FileUploaderProps {
  onUpload: (file: File) => void
  placeholder: string
  accept?: string
}

/**
 * This component will show the drag or upload file area
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  placeholder,
  accept,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFileDialog = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0]
      onUpload(file)
    }
  }

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: Files) => {
      const file = item.files[0]
      onUpload(file)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const drop = useCallback(
    (node: HTMLDivElement | null) => {
      dropRef(node)
    },
    [dropRef]
  )

  const isActive = canDrop && isOver

  return (
    <Container
      ref={drop}
      data-cy="file-uploader"
      active={isActive}
      onClick={openFileDialog}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          openFileDialog()
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleChange}
        accept={accept}
        value={''}
      />
      {placeholder}
    </Container>
  )
}

const activeBoxStyle = css`
  background: #f2fbfc;
  border: 1px dashed #bce7f6;
`

const Container = styled.div<{ active: boolean }>`
  background: ${(props) => props.theme.colors.background.secondary};
  border: 1px dashed #e2e2e2;
  box-sizing: border-box;
  border-radius: 8px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 24px;
  font-family: ${(props) => props.theme.font.family.Lato};
  color: ${(props) => props.theme.colors.text.onLight};
  cursor: pointer;
  margin: 16px 16px 8px;

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.outline.focus};
    outline-offset: 2px;
  }

  ${(props) =>
    props.active
      ? css`
          ${activeBoxStyle}
        `
      : css``}
`
