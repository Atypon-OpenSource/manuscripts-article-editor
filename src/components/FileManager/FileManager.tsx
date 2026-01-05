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
import { groupFiles } from '@manuscripts/body-editor'
import React, { useMemo } from 'react'

import { useStore } from '../../store'
import {
  InspectorTabList,
  InspectorTabPanel,
  InspectorTabPanels,
  InspectorTabs,
  SecondaryInspectorTab,
} from '../Inspector'
import { FileManagerDragLayer } from './FileManagerDragLayer'
import { InlineFilesSection } from './InlineFilesSection'
import { LinkedFilesSection } from './LinkedFilesSection'
import { MainFilesSection } from './MainFilesSection'
import { OtherFilesSection } from './OtherFilesSection'
import { SupplementsSection } from './SupplementsSection'

export enum FileSectionType {
  Inline = 'Inline files',
  Supplements = 'Supplements',
  OtherFile = 'Other files',
  MainFile = 'Main document',
}

export type Replace = (file: File) => Promise<void>

export type Move = {
  sectionType: FileSectionType
  handler: () => void
}

/**
 * This is the main component of the file handling
 * that should be called in the inspector,
 * and it expects to receive an array of submission attachments
 * and use Drag-and-Drop technique for manuscript-frontend inspector.
 *
 * File section component consist of three types of files which is:
 * 1- Inline files.
 * 2- Supplemental files. + linked files.
 * 3- Other files.
 */

export const FileManager: React.FC = () => {
  const [{ doc, files, inspectorOpenTabs }, dispatch] = useStore((s) => ({
    doc: s.doc,
    files: s.files,
    inspectorOpenTabs: s.inspectorOpenTabs,
  }))

  const { figures, supplements, attachments, linkedFiles, others } =
    useMemo(() => {
      return groupFiles(doc, files)
    }, [doc, files])

  return (
    <InspectorTabs
      defaultIndex={0}
      selectedIndex={inspectorOpenTabs?.secondaryTab || 0}
      data-cy="files-tabs"
      style={{ overflow: 'visible', overflowX: 'hidden' }}
      onChange={(index) =>
        dispatch({ inspectorOpenTabs: { secondaryTab: index } })
      }
    >
      <FileManagerDragLayer />
      <InspectorTabList>
        <SecondaryInspectorTab data-tooltip-content="Files that can be found inline in the manuscript.">
          Inline files
        </SecondaryInspectorTab>
        <SecondaryInspectorTab data-tooltip-content="The main document of the manuscript.">
          Main document
        </SecondaryInspectorTab>
        <SecondaryInspectorTab data-tooltip-content="Files that were marked as supplements.">
          Supplements
        </SecondaryInspectorTab>
        <SecondaryInspectorTab data-tooltip-content="Files excluded from the final submission.">
          Other files
        </SecondaryInspectorTab>
      </InspectorTabList>
      <InspectorTabPanels
        style={{ overflowY: 'visible', position: 'relative' }}
      >
        <InspectorTabPanel data-cy="inline">
          <InlineFilesSection elements={figures} />
        </InspectorTabPanel>
        <InspectorTabPanel data-cy="main">
          <MainFilesSection mainDocument={attachments[0]} />
        </InspectorTabPanel>
        <InspectorTabPanel data-cy="supplements">
          <SupplementsSection supplements={supplements} />
          <LinkedFilesSection linkedFiles={linkedFiles} />
        </InspectorTabPanel>
        <InspectorTabPanel data-cy="other">
          <OtherFilesSection files={others} />
        </InspectorTabPanel>
      </InspectorTabPanels>
    </InspectorTabs>
  )
}
