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
import { Commit } from '@manuscripts/track-changes'
import React, { useCallback, useState } from 'react'
import { HistoricalView } from '../../history/HistoricalView'
import { useModal } from '../../ModalHookableProvider'

import { getUnsavedComment, useComments } from '../../../hooks/use-comments'
import { useCommits } from '../../../hooks/use-commits'
import { useCreateEditor } from '../../../hooks/use-create-editor'
import { useRequirementsValidation } from '../../../hooks/use-requirements-validation'
import { useStore } from '../../../store'
import { SnapshotsDropdown } from '../../inspector/SnapshotsDropdown'
import Panel from '../../Panel'
import { RequirementsInspectorView } from '../../requirements/RequirementsInspector'
import { ResizingInspectorButton } from '../../ResizerButtons'
import { Corrections } from '../../track/Corrections'
import { SortByDropdown } from '../../track/SortByDropdown'
import { Inspector as InspectorLW } from '../InspectorLW'
import { CommentsTab } from './CommentsTab'
import { ContentTab } from './ContentTab'
import { ErrorDialog } from './ErrorDialog'
import { ExceptionDialog } from './ExceptionDialog'
import useFileHandling from './FileHandling'
import { Snapshot } from '@manuscripts/manuscripts-json-schema'
import { useSnapshotManager } from '../../../hooks/use-snapshot-manager'
import styled from 'styled-components'

interface Props {
  tabs: string[]
  commits: Commit[]
  editor: ReturnType<typeof useCreateEditor>
  corrections: ReturnType<typeof useCommits>['corrections']
  accept: ReturnType<typeof useCommits>['accept']
  reject: ReturnType<typeof useCommits>['reject']
}
const Inspector: React.FC<Props> = ({
  tabs,
  commits,
  editor,
  corrections,
  accept,
  reject,
}) => {
  const [
    {
      snapshots,
      saveModel,
      modelMap,
      user,
      project,
      manuscript,
      submission,
      submissionId,
      fileManagementErrors,
      commitsSortBy,
      comments,
      snapshotID,
    },
    dispatchStore,
  ] = useStore((store) => ({
    snapshots: store.snapshots,
    saveModel: store.saveModel,
    modelMap: store.modelMap,
    manuscript: store.manuscript,
    user: store.user,
    project: store.project,
    submissionId: store.submissionID,
    submission: store.submission,
    snapshotID: store.snapshotID,
    fileManagementErrors: (store.fileManagementErrors as string[]) || [],
    commitsSortBy: store.commitsSortBy as string,
    comments: store.comments || [],
  }))

  const {
    handleChangeAttachmentDesignation,
    handleReplaceAttachment,
    handleUpdateInlineFile,
    handleUploadAttachment,
  } = useFileHandling()

  const { state, dispatch, view } = editor

  const [header] = useStore<string>((store) => store.errorDialogHeader || '')
  const [message] = useStore<string>((store) => store.errorDialogMessage || '')
  const [showErrorDialog] = useStore<boolean>(
    (store) => store.showErrorDialog || false
  )

  const validation = useRequirementsValidation({
    state,
  })
  const selected = findParentNodeWithIdValue(state.selection)
  const can = usePermissions()

  const [errorDialog, setErrorDialog] = useState(false)
  const [selectedSnapshot, selectSnapshot] = useState(snapshots && snapshots[0])

  const { addModal } = useModal()
  const { requestTakeSnapshot } = useSnapshotManager(project)
  const handleSelect = useCallback((snapshot: Snapshot) => {
    selectSnapshot(snapshot)
  }, [])
  const viewHandler = useCallback(
    (selectedSnapshot: Snapshot) => {
      if (!selectedSnapshot || !selectedSnapshot.s3Id) {
        return
      }
      addModal('historicalView', ({ handleClose }) => {
        return (
          <HistoricalModal>
            <HistoricalView
              snapshotID={selectedSnapshot.s3Id!}
              project={project}
              manuscript={manuscript}
              user={user}
              handleClose={handleClose}
              selectSnapshot={(snapshot) => {
                selectSnapshot(snapshot)
              }}
              viewHandler={viewHandler}
            />
          </HistoricalModal>
        )
      })
    },
    [project, manuscript, user, addModal]
  )

  const handleSort = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    dispatchStore({
      commitsSortBy: event.currentTarget.value,
    })
  }

  const handleDownloadAttachment = useCallback((url: string) => {
    window.location.assign(url)
  }, [])

  const commentController = useComments(comments, user, state, editor.doCommand)
  const modelIds = modelMap ? Array.from(modelMap?.keys()) : []

  return (
    <>
      <Panel
        name={'inspector'}
        minSize={400}
        direction={'row'}
        side={'start'}
        hideWhen={'max-width: 900px'}
        resizerButton={ResizingInspectorButton}
        forceOpen={
          !!getUnsavedComment(commentController.items) ||
          !!commentController.focusedItem
        }
      >
        <InspectorLW
          tabs={tabs}
          commentTarget={
            getUnsavedComment(commentController.items) ||
            commentController.focusedItem ||
            undefined
          }
        >
          {tabs.map((label) => {
            switch (label) {
              case 'Content': {
                return (
                  <>
                    <button onClick={() => requestTakeSnapshot()}>
                      Take Snapshot
                    </button>

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
                    commentController={commentController}
                    selected={selected}
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
                  />
                )
              }
              case 'History': {
                return snapshotID ? (
                  <React.Fragment key="history">
                    {selectedSnapshot && (
                      <SnapshotsDropdown
                        snapshots={snapshots || []}
                        selectedSnapshot={selectedSnapshot}
                        selectSnapshot={handleSelect}
                        viewHandler={() => viewHandler(selectedSnapshot)}
                      />
                    )}

                    <SortByDropdown
                      sortBy={commitsSortBy}
                      handleSort={handleSort}
                    />
                    <Corrections
                      corrections={corrections}
                      editor={editor}
                      commits={commits}
                      accept={accept}
                      reject={reject}
                    />
                  </React.Fragment>
                ) : (
                  <h3 key="history">
                    Tracking is off - create a Snapshot to get started
                  </h3>
                )
              }

              case 'Files': {
                return submissionId ? (
                  <>
                    {errorDialog && (
                      <ErrorDialog
                        isOpen={showErrorDialog}
                        header={header}
                        message={message}
                        handleOk={() => setErrorDialog(false)}
                      />
                    )}
                    <FileManager
                      submissionId={submissionId}
                      can={can}
                      enableDragAndDrop={true}
                      modelMap={modelMap}
                      saveModel={saveModel}
                      attachments={
                        submission?.attachments as SubmissionAttachment[]
                      }
                      handleChangeDesignation={
                        handleChangeAttachmentDesignation
                      }
                      handleDownload={handleDownloadAttachment}
                      handleReplace={handleReplaceAttachment}
                      handleUpload={handleUploadAttachment}
                      handleUpdateInline={handleUpdateInlineFile}
                    />
                  </>
                ) : null
              }
            }
          })}
        </InspectorLW>
      </Panel>
      {fileManagementErrors.forEach(
        (error) => error && <ExceptionDialog errorCode={error} />
      )}
    </>
  )
}

const HistoricalModal = styled.div`
  position: relative;
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #fff;
`

export default Inspector
