/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { findParentNodeWithIdValue } from '@manuscripts/body-editor'
import { Model } from '@manuscripts/json-schema'
import { FileManager, usePermissions } from '@manuscripts/style-guide'
import { encode, schema } from '@manuscripts/transform'
import React, { useEffect, useMemo, useState } from 'react'

import config from '../../config'
import { useCreateEditor } from '../../hooks/use-create-editor'
import { useRequirementsValidation } from '../../hooks/use-requirements-validation'
import { useStore } from '../../store'
import {
  InspectorContainer,
  InspectorTab,
  InspectorTabList,
  InspectorTabPanel,
  InspectorTabs,
  PaddedInspectorTabPanels,
} from '../Inspector'
import Panel from '../Panel'
import { RequirementsInspectorView } from '../requirements/RequirementsInspector'
import { ResizingInspectorButton } from '../ResizerButtons'
import { TrackChangesPanel } from '../track-changes/TrackChangesPanel'
import { filterNodesWithTrackingData } from '../track-changes/utils'
import { CommentsTab } from './lean-workflow/CommentsTab'
import { ContentTab } from './lean-workflow/ContentTab'

interface Props {
  editor: ReturnType<typeof useCreateEditor>
}
const Inspector: React.FC<Props> = ({ editor }) => {
  const [{ saveModel, dbModelMap, fileManagement, commentTarget, doc }] =
    useStore((store) => ({
      saveModel: store.saveModel,
      dbModelMap: store.modelMap,
      fileManagement: store.fileManagement,
      doc: store.doc,
      commentTarget: store.commentTarget,
    }))

  const { state, dispatch } = editor

  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    if (commentTarget) {
      setTabIndex(1)
    }
  }, [commentTarget])

  const validation = useRequirementsValidation({
    state,
  })
  const selection = useMemo(
    () => state && findParentNodeWithIdValue(state.selection),
    [state]
  )

  const can = usePermissions()

  /**
   * Document stored in quarterback will be different from the one we get from api **if we start editing**,
   * unless we create a snapshot or complete the task they should be identical.
   *
   * As a result of that will combine both of them to get (inline files & supplementary files)
   */
  const docClean = filterNodesWithTrackingData(doc.toJSON())

  const modelMapClean = encode(schema.nodeFromJSON(docClean))

  const modelMap = new Map<string, Model>([...dbModelMap, ...modelMapClean])

  return (
    <>
      <Panel
        name={'inspector'}
        minSize={400}
        direction={'row'}
        side={'start'}
        hideWhen={'max-width: 900px'}
        resizerButton={ResizingInspectorButton}
        forceOpen={commentTarget !== undefined}
      >
        <InspectorContainer>
          <InspectorTabs index={tabIndex} onChange={setTabIndex}>
            <InspectorTabList>
              <InspectorTab>Content</InspectorTab>
              <InspectorTab>Comments</InspectorTab>
              {config.features.qualityControl && (
                <InspectorTab>Quality</InspectorTab>
              )}
              {config.quarterback.enabled && (
                <InspectorTab>History</InspectorTab>
              )}
              {config.features.fileManagement && (
                <InspectorTab>Files</InspectorTab>
              )}
            </InspectorTabList>
            <PaddedInspectorTabPanels>
              <InspectorTabPanel key="Content">
                <ContentTab state={state} dispatch={dispatch} key="content" />
              </InspectorTabPanel>
              <InspectorTabPanel key="Comments">
                <CommentsTab
                  selected={selection}
                  editor={editor}
                  key="comments"
                />
              </InspectorTabPanel>
              {config.features.qualityControl && (
                <InspectorTabPanel key="Quality">
                  <RequirementsInspectorView
                    result={validation.result}
                    error={validation.error}
                    isBuilding={validation.isBuilding}
                    key="quality"
                  />
                </InspectorTabPanel>
              )}
              {config.quarterback.enabled && (
                <InspectorTabPanel key="History">
                  <TrackChangesPanel key="track-changes" />
                </InspectorTabPanel>
              )}
              {config.features.fileManagement && (
                <InspectorTabPanel key="Files">
                  <FileManager
                    can={can}
                    enableDragAndDrop={true}
                    modelMap={modelMap}
                    saveModel={saveModel}
                    fileManagement={fileManagement}
                  />
                </InspectorTabPanel>
              )}
            </PaddedInspectorTabPanels>
          </InspectorTabs>
        </InspectorContainer>
      </Panel>
    </>
  )
}

export default Inspector
