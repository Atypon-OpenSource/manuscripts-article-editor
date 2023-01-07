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

import {
  findParentElement,
  findParentNodeWithIdValue,
  findParentSection,
} from '@manuscripts/manuscript-editor'
import {
  FileManager,
  SubmissionAttachment,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { useMemo } from 'react'

import { useCreateEditor } from '../../../hooks/use-create-editor'
import { useRequirementsValidation } from '../../../hooks/use-requirements-validation'
import { useStore } from '../../../store'
import Panel from '../../Panel'
import { RequirementsInspectorView } from '../../requirements/RequirementsInspector'
import { ResizingInspectorButton } from '../../ResizerButtons'
import { TrackChangesPanel } from '../../track-changes/TrackChangesPanel'
import { Inspector as InspectorLW } from '../InspectorLW'
import { CommentsTab } from './CommentsTab'
import { ContentTab } from './ContentTab'

interface Props {
  tabs: string[]
  editor: ReturnType<typeof useCreateEditor>
}
const Inspector: React.FC<Props> = ({ tabs, editor }) => {
  const [
    {
      submissionId,
      submission,
      fileManagement,
      commentTarget,
      saveTrackModel,
      trackModelMap,
    },
    stateDispatch,
  ] = useStore((store) => ({
    saveTrackModel: store.saveTrackModel,
    trackModelMap: store.trackModelMap,
    submissionId: store.submissionID,
    submission: store.submission,
    fileManagement: store.fileManagement,
    commentTarget: store.commentTarget,
  }))

  const { state, dispatch, view } = editor

  const validation = useRequirementsValidation({
    state,
  })
  const selected = useMemo(
    () => state && findParentNodeWithIdValue(state.selection),
    [state]
  )

  const can = usePermissions()
  const modelIds = trackModelMap ? Array.from(trackModelMap?.keys()) : []

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
        <InspectorLW tabs={tabs} commentTarget={commentTarget}>
          {tabs.map((label) => {
            switch (label) {
              case 'Content': {
                return (
                  <>
                    <ContentTab
                      selected={selected}
                      selectedElement={findParentElement(
                        state.selection,
                        modelIds
                      )}
                      selectedSection={findParentSection(state.selection)}
                      state={state}
                      dispatch={dispatch}
                      hasFocus={view?.hasFocus()}
                      key="content"
                    />
                  </>
                )
              }

              case 'Comments': {
                return (
                  <CommentsTab
                    selected={selected}
                    editor={editor}
                    key="comments"
                  />
                )
              }

              case 'Quality': {
                return (
                  <RequirementsInspectorView
                    key="quality"
                    result={validation.result}
                    error={validation.error}
                    isBuilding={validation.isBuilding}
                  />
                )
              }

              case 'History': {
                return <TrackChangesPanel key="track-changes" />
              }

              case 'Files': {
                return submissionId ? (
                  <FileManager
                    can={can}
                    enableDragAndDrop={true}
                    modelMap={trackModelMap}
                    // @ts-ignore
                    saveModel={saveTrackModel}
                    fileManagement={{
                      ...fileManagement,
                      getAttachments: () => submission.attachments,
                    }}
                    addAttachmentToState={(attachment: SubmissionAttachment) =>
                      stateDispatch({
                        submission: {
                          ...submission,
                          attachments: [...submission.attachments, attachment],
                        },
                      })
                    }
                  />
                ) : null
              }
            }
          })}
        </InspectorLW>
      </Panel>
    </>
  )
}

export default Inspector
