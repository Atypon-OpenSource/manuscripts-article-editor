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
import { ElementFiles, FileAttachment } from '@manuscripts/body-editor'
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
  element: ElementFiles
  label: string
  icon: React.FC<React.SVGAttributes<SVGElement>>
  file: FileAttachment
  node?: ManuscriptNode
  pos?: number
}

export const InlineFilesSection: React.FC<InlineFilesSectionProps> = ({
  elements,
}) => {
  const [{ view, fileManagement, sectionCategories }] = useStore((s) => ({
    view: s.view,
    fileManagement: s.fileManagement,
    sectionCategories: s.sectionCategories,
  }))

  const metadata: FileMetadata[] = useMemo(() => {
    if (!view) {
      return []
    }
    let figureIndex = 1
    let imageIndex = 1
    return elements.map((element) => {
      const figure = element.files[0]
      const file = figure?.file || { id: '', name: '' }

      const $pos = view.state.doc.resolve(element.pos)
      const section = findParentNodeOfTypeClosestToPos(
        $pos,
        schema.nodes.graphical_abstract_section
      )

      let label
      let icon
      if (section) {
        const category = section.node.attrs.category
        label = sectionCategories.get(category)?.titles[0] || ''
        icon = FileGraphicalAbstractIcon
      } else if (element.node.type === schema.nodes.image_element) {
        label = `Image ${imageIndex++}`
        icon = FileImageIcon
      } else if (element.node.type === schema.nodes.hero_image) {
        label = `Hero Image`
        icon = FileImageIcon
      } else {
        label = `Figure ${figureIndex++}`
        icon = FileFigureIcon
      }
      return {
        element,
        node: figure?.node,
        pos: figure?.pos,
        file,
        label,
        icon,
      }
    })
  }, [elements, view, sectionCategories])

  if (!view) {
    return null
  }

  const handleClick = (metadata: FileMetadata) => {
    const tr = view.state.tr
    tr.setSelection(NodeSelection.create(view.state.doc, metadata.element.pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleDetach = (metadata: FileMetadata) => {
    if (!metadata.pos) {
      return
    }
    const tr = view.state.tr
    tr.setNodeAttribute(metadata.pos, 'src', '')
    tr.setSelection(NodeSelection.create(tr.doc, metadata.pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleReplace = async (metadata: FileMetadata, file: File) => {
    if (!metadata.pos) {
      return
    }
    const uploaded = await fileManagement.upload(file)
    const tr = view.state.tr
    tr.setNodeAttribute(metadata.pos, 'src', uploaded.id)
    tr.setSelection(NodeSelection.create(tr.doc, metadata.pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  return (
    <>
      {metadata.map((e, index) => {
        return (
          <FileContainer
            data-cy="file-container"
            key={index}
            onClick={() => handleClick(e)}
          >
            <FileName file={e.file} label={e.label} icon={e.icon} />
            <FileCreatedDate file={e.file} className="show-on-hover" />
            <FileActions
              data-cy="file-actions"
              sectionType={FileSectionType.Inline}
              onReplace={async (f) => await handleReplace(e, f)}
              onDetach={() => handleDetach(e)}
              onDownload={() => fileManagement.download(e.file)}
            />
          </FileContainer>
        )
      })}
    </>
  )
}
