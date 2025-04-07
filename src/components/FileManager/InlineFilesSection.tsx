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
  FileAttachment,
  NodeFile,
} from '@manuscripts/body-editor'
import {
  FileFigureIcon,
  FileGraphicalAbstractIcon,
  FileImageIcon,
} from '@manuscripts/style-guide'
import { ManuscriptNode, schema } from '@manuscripts/transform'
import { NodeSelection } from 'prosemirror-state'
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils'
import React, { useMemo } from 'react'

import { useStore } from '../../store'
import { FileActions } from './FileActions'
import { FileContainer } from './FileContainer'
import { FileCreatedDate } from './FileCreatedDate'
import { FileSectionType } from './FileManager'
import { FileName } from './FileName'

export type InlineFilesSectionProps = {
  elements: ElementFiles[]
}

type FileMetadata = {
  figure: ManuscriptNode
  file: FileAttachment
  label: string
  icon: React.FC<React.SVGAttributes<SVGElement>>
}

export const InlineFilesSection: React.FC<InlineFilesSectionProps> = ({
  elements,
}) => {
  const [{ view, fileManagement, sectionCategories }] = useStore((s) => ({
    view: s.view,
    fileManagement: s.fileManagement,
    sectionCategories: s.sectionCategories,
  }))

  const metadata = useMemo(() => {
    const map = new Map()
    if (!view) {
      return map
    }
    let figureIndex = 1
    let imageIndex = 1
    elements.forEach((e) => {
      const figure = e.files[0]
      const file = figure?.file || { id: '', name: '' }

      const $pos = view.state.doc.resolve(e.pos)
      const section = findParentNodeOfTypeClosestToPos(
        $pos,
        schema.nodes.graphical_abstract_section
      )

      let metadata: Partial<FileMetadata>
      if (section) {
        const category = section.node.attrs.category
        metadata = {
          label: sectionCategories.get(category)?.titles[0],
          icon: FileGraphicalAbstractIcon,
        }
      } else if (e.node.type === schema.nodes.image_element) {
        metadata = {
          label: `Image ${imageIndex++}`,
          icon: FileImageIcon,
        }
      } else {
        metadata = {
          label: `Figure ${figureIndex++}`,
          icon: FileFigureIcon,
        }
      }
      map.set(e.node.attrs.id, {
        ...metadata,
        file,
        figure: figure?.node,
      })
    })
    return map
  }, [elements, view])

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

  return (
    <>
      {elements.map((element, index) => {
        const entry = metadata.get(element.node.attrs.id)
        return (
          <FileContainer
            data-cy="file-container"
            key={index}
            onClick={() => handleClick(element)}
          >
            <FileName file={entry.file} label={entry.label} icon={entry.icon} />
            <FileCreatedDate file={entry.file} className="show-on-hover" />
            <FileActions
              data-cy="file-actions"
              sectionType={FileSectionType.Inline}
              onReplace={async (f) => await handleReplace(entry.figure, f)}
              onDetach={async () => await handleDetach(entry.figure)}
              onDownload={() => fileManagement.download(entry.file)}
            />
          </FileContainer>
        )
      })}
    </>
  )
}
