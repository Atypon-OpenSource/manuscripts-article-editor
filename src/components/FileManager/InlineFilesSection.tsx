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
  findGraphicalAbstractFigureElement,
  NodeFile,
} from '@manuscripts/body-editor'
import { FileType, getFileTypeIcon } from '@manuscripts/style-guide'
import { NodeSelection } from 'prosemirror-state'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useStore } from '../../store'
import { FileActions } from './FileActions'
import { FileContainer } from './FileContainer'
import { FileCreatedDate } from './FileCreatedDate'
import { FileSectionType, Replace } from './FileManager'
import { FileName } from './FileName'
import { schema } from '@manuscripts/transform'

export type InlineFilesSectionProps = {
  elements: ElementFiles[]
}

export const InlineFilesSection: React.FC<InlineFilesSectionProps> = ({
  elements,
}) => {
  const [{ view, fileManagement }] = useStore((s) => ({
    view: s.view,
    fileManagement: s.fileManagement,
  }))

  const ga = useMemo(
    () =>
      view ? findGraphicalAbstractFigureElement(view.state.doc) : undefined,
    [view]
  )

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

  const handleDetach = async (figure: NodeFile) => {
    const tr = view.state.tr
    tr.setNodeAttribute(figure.pos, 'src', '')
    tr.setSelection(NodeSelection.create(tr.doc, figure.pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleReplace = async (figure: NodeFile, file: File) => {
    const uploaded = await fileManagement.upload(file)
    const tr = view.state.tr
    tr.setNodeAttribute(figure.pos, 'src', uploaded.id)
    tr.setSelection(NodeSelection.create(tr.doc, figure.pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const FileTypeLabels = {
    [FileType.GraphicalAbstract]: 'Graphical Abstract',
    [FileType.Image]: 'Image',
    [FileType.Figure]: 'Figure',
  }

  const getElementFileType = (element: ElementFiles) => {
    if (element.node.attrs.id === ga?.node.attrs.id) {
      return FileType.GraphicalAbstract
    }

    if (element.node.type === schema.nodes.image_element) {
      return FileType.Image
    }
    return FileType.Figure
  }

  const getElementFileLabel = (
    element: ElementFiles,
    counters: { [key: string]: number }
  ) => {
    const fileType = FileTypeLabels[getElementFileType(element)]
    if (fileType === 'Graphical Abstract') {
      return fileType
    }
    counters[fileType] = (counters[fileType] || 0) + 1
    return `${fileType} ${counters[fileType]}`
  }

  const counters = {
    [FileType.GraphicalAbstract]: 0,
    [FileType.Image]: 0,
    [FileType.Figure]: 0,
  }

  return (
    <>
      {elements.map((element, index) => {
        const figure = element.files && element.files[0]
        return (
          <FileContainer
            data-cy="file-container"
            key={index}
            onClick={() => handleClick(element)}
          >
            <ElementLabelContainer>
              {getFileTypeIcon(getElementFileType(element))}
              <ElementLabel>
                {getElementFileLabel(element, counters)}:
              </ElementLabel>
            </ElementLabelContainer>
            {figure && (
              <ElementFile
                key={figure.file.id}
                figure={figure}
                onReplace={async (f) => await handleReplace(figure, f)}
                onDetach={async () => await handleDetach(figure)}
                onDownload={() => fileManagement.download(figure.file)}
              />
            )}
          </FileContainer>
        )
      })}
    </>
  )
}

const ElementFile: React.FC<{
  figure: NodeFile
  onDownload: () => void
  onReplace?: Replace
  onDetach?: () => void
}> = ({ figure, onDownload, onReplace, onDetach }) => {
  return (
    <Element>
      <FileName file={figure.file} showIcon={false} />
      <FileCreatedDate file={figure.file} className="show-on-hover" />
      <FileActions
        data-cy="file-actions"
        sectionType={FileSectionType.Inline}
        onDownload={figure.file ? onDownload : undefined}
        onDetach={figure.file ? onDetach : undefined}
        onReplace={onReplace}
      />
    </Element>
  )
}

const Element = styled.div`
  display: flex;
  align-items: center;
`

const ElementLabelContainer = styled.div`
  display: flex;
  cursor: pointer;
`

const ElementLabel = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
  align-content: center;
`
