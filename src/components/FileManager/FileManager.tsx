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
import { Tooltip } from '@manuscripts/style-guide'
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
  MainFile = 'Main Document',
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
        <SecondaryInspectorTab data-tooltip-id="inline-tooltip">
          Inline files
        </SecondaryInspectorTab>
        <Tooltip id="inline-tooltip" place="bottom">
          Files that can be found inline in the manuscript.
        </Tooltip>
        <SecondaryInspectorTab data-tooltip-id="main-tooltip">
          Main Document
        </SecondaryInspectorTab>
        <Tooltip id="main-tooltip" place="bottom">
          The main document of the manuscript.
        </Tooltip>
        <SecondaryInspectorTab data-tooltip-id="supplements-tooltip">
          Supplements
        </SecondaryInspectorTab>
        <Tooltip id="supplements-tooltip" place="bottom">
          Files that were marked as supplements.
        </Tooltip>
        <SecondaryInspectorTab data-tooltip-id="other-tooltip">
          Other files
        </SecondaryInspectorTab>
        <Tooltip id="other-tooltip" place="bottom">
          Files excluded from the final submission.
        </Tooltip>
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
