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
  ElementFiles,
  getMediaTypeInfo,
  NodeFile,
} from '@manuscripts/body-editor'
import {
  FileFigureIcon,
  FileGraphicalAbstractIcon,
  FileImageIcon,
  FileVideoIcon,
  ToggleIcon,
  TriangleCollapsedIcon,
  TriangleExpandedIcon,
} from '@manuscripts/style-guide'
import { ManuscriptNode, schema } from '@manuscripts/transform'
import { NodeSelection } from 'prosemirror-state'
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils'
import React, { useMemo, useState } from 'react'

import { trimFilename } from '../../lib/files'
import { useStore } from '../../store'
import { FileActions } from './FileActions'
import { FileCreatedDate } from './FileCreatedDate'
import {
  FileGroup,
  FileGroupContainer,
  FileGroupHeader,
  FileGroupItemContainer,
  FileLabel,
} from './FileGroup'
import { FileSectionType } from './FileManager'
import { FileNameText } from './FileName'
import { FileTypeIcon } from './FileTypeIcon'

type FileMetadata = {
  element: ElementFiles
  label: string
  icon: React.FC<React.SVGAttributes<SVGElement>>
  files: NodeFile[]
}

export type InlineFilesSectionProps = {
  elements: ElementFiles[]
}

export const InlineFilesSection: React.FC<InlineFilesSectionProps> = ({
  elements,
}) => {
  const [{ view, fileManagement, sectionCategories }] = useStore((s) => ({
    view: s.view,
    fileManagement: s.fileManagement,
    sectionCategories: s.sectionCategories,
  }))

  const groupedMetadata: FileMetadata[] = useMemo(() => {
    if (!view) {
      return []
    }

    let figureIndex = 1
    let imageIndex = 1
    let mediaIndex = 1

    const groups: FileMetadata[] = []

    for (const element of elements) {
      const $pos = view.state.doc.resolve(element.pos)
      const section = findParentNodeOfTypeClosestToPos(
        $pos,
        schema.nodes.graphical_abstract_section
      )

      let label: string
      let icon: React.FC<React.SVGAttributes<SVGElement>>

      if (section) {
        const category = section.node.attrs.category
        label = sectionCategories.get(category)?.titles[0] || ''
        icon = FileGraphicalAbstractIcon
      } else if (element.node.type === schema.nodes.image_element) {
        label = `Image ${imageIndex++}`
        icon = FileImageIcon
      } else if (element.node.type === schema.nodes.embed) {
        label = `Media ${mediaIndex++}`
        icon = FileVideoIcon

        const hasUploadedFile = element.files.some((f) => !!f.file.id)
        if (!hasUploadedFile) {
          continue
        }
      } else {
        label = `Figure ${figureIndex++}`
        icon = FileFigureIcon
      }

      groups.push({
        element,
        label,
        icon,
        files: element.files.filter((f) => f.file.id),
      })
    }

    return groups
  }, [elements, view, sectionCategories])

  const [openGroupIndexes, setOpenGroupIndexes] = useState<Set<number>>(
    new Set(groupedMetadata.map((_, index) => index))
  )

  const toggleGroupOpen = (groupIndex: number) => {
    setOpenGroupIndexes((prevOpenIndexes) => {
      const newOpenIndexes = new Set(prevOpenIndexes)
      if (newOpenIndexes.has(groupIndex)) {
        newOpenIndexes.delete(groupIndex)
      } else {
        newOpenIndexes.add(groupIndex)
      }
      return newOpenIndexes
    })
  }

  if (!view) {
    return null
  }

  const handleClick = (element: ElementFiles) => {
    const tr = view.state.tr
    tr.setSelection(NodeSelection.create(view.state.doc, element.pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleFileClick = (pos?: number) => {
    if (!pos) {
      return
    }
    const tr = view.state.tr
    tr.setSelection(NodeSelection.create(view.state.doc, pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleDetach = (node: ManuscriptNode, pos?: number) => {
    if (!pos) {
      return
    }
    const tr = view.state.tr

    if (node.type === schema.nodes.embed) {
      tr.setNodeAttribute(pos, 'href', '')
    } else {
      tr.setNodeAttribute(pos, 'src', '')
    }

    tr.setSelection(NodeSelection.create(tr.doc, pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleDelete = (node: ManuscriptNode, pos?: number) => {
    if (!pos || !view) {
      return
    }

    if (
      node?.type === schema.nodes.figure ||
      node?.type === schema.nodes.embed
    ) {
      const tr = view.state.tr
      tr.delete(pos, pos + node.nodeSize)
      view.dispatch(tr)
    }
  }

  const handleReplace = async (
    node: ManuscriptNode,
    pos?: number,
    file?: File
  ) => {
    if (!pos || !file) {
      return
    }
    const uploaded = await fileManagement.upload(file)
    const tr = view.state.tr

    if (node.type === schema.nodes.embed) {
      const mediaInfo = getMediaTypeInfo(file)
      tr.setNodeAttribute(pos, 'href', uploaded.id)
      tr.setNodeAttribute(pos, 'mimetype', mediaInfo.mimetype)
      tr.setNodeAttribute(pos, 'mimeSubtype', mediaInfo.mimeSubtype)
    } else {
      tr.setNodeAttribute(pos, 'src', uploaded.id)
    }

    tr.setSelection(NodeSelection.create(tr.doc, pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  return (
    <>
      {groupedMetadata.map((group, groupIndex) => {
        const isOpen = openGroupIndexes.has(groupIndex)
        const figureCount = group.files.length

        return (
          <FileGroupContainer
            data-cy="file-container"
            key={groupIndex}
            onClick={() => handleClick(group.element)}
          >
            <FileGroupHeader>
              <group.icon className="file-icon" />
              {group.label && <FileLabel>{group.label}:</FileLabel>}
              {group.files.length > 0 && (
                <ToggleIcon
                  isOpen={isOpen}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleGroupOpen(groupIndex)
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      toggleGroupOpen(groupIndex)
                    }
                  }}
                >
                  {isOpen ? (
                    <TriangleExpandedIcon />
                  ) : (
                    <TriangleCollapsedIcon />
                  )}
                </ToggleIcon>
              )}
            </FileGroupHeader>
            {isOpen && group.files.length > 0 && (
              <FileGroup>
                {group.files.map((fileAttachment, fileIndex) => (
                  <FileGroupItemContainer
                    key={fileIndex}
                    data-tooltip-content={fileAttachment.file?.name || 'Figure'}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileClick(fileAttachment.pos)
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        e.currentTarget === document.activeElement
                      ) {
                        e.stopPropagation()
                        handleFileClick(fileAttachment.pos)
                      }
                    }}
                  >
                    {fileAttachment.file && (
                      <FileTypeIcon file={fileAttachment.file} />
                    )}
                    <FileNameText data-cy="filename">
                      {fileAttachment.file?.name
                        ? trimFilename(fileAttachment.file.name, 25)
                        : 'Unknown file'}
                    </FileNameText>
                    {fileAttachment.file && (
                      <FileCreatedDate
                        file={fileAttachment.file}
                        className="show-on-hover"
                      />
                    )}
                    <FileActions
                      sectionType={FileSectionType.Inline}
                      onReplace={async (f) =>
                        await handleReplace(
                          fileAttachment.node,
                          fileAttachment.pos,
                          f
                        )
                      }
                      onDetach={() =>
                        handleDetach(fileAttachment.node, fileAttachment.pos)
                      }
                      onDownload={() =>
                        fileAttachment.file &&
                        fileManagement.download(fileAttachment.file)
                      }
                      onDelete={
                        figureCount > 1
                          ? () =>
                              handleDelete(
                                fileAttachment.node,
                                fileAttachment.pos
                              )
                          : undefined
                      }
                    />
                  </FileGroupItemContainer>
                ))}
              </FileGroup>
            )}
          </FileGroupContainer>
        )
      })}
    </>
  )
}
