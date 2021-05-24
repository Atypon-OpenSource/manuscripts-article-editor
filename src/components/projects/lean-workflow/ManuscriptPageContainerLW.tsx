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

import '@manuscripts/manuscript-editor/styles/Editor.css'
import '@manuscripts/manuscript-editor/styles/popper.css'
import '@reach/tabs/styles.css'

import {
  findParentElement,
  findParentNodeWithIdValue,
  findParentSection,
  ManuscriptsEditor,
  ManuscriptToolbar,
  PopperManager,
  RequirementsProvider,
  useEditor,
} from '@manuscripts/manuscript-editor'
import {
  ContainedModel,
  getModelsByType,
  isManuscriptModel,
  ManuscriptNode,
  ManuscriptSchema,
} from '@manuscripts/manuscript-transform'
import {
  ExternalFile,
  Model,
  ObjectTypes,
  Snapshot,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { RxDocument } from '@manuscripts/rxdb'
import { CapabilitiesProvider, FileManager } from '@manuscripts/style-guide'
import { Commit } from '@manuscripts/track-changes'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { RouteComponentProps } from 'react-router'

import config from '../../../config'
import { useBiblio } from '../../../hooks/use-biblio'
import { useCommits } from '../../../hooks/use-commits'
import { createUseLoadable } from '../../../hooks/use-loadable'
import { useManuscriptModels } from '../../../hooks/use-manuscript-models'
import { bootstrap, saveEditorState } from '../../../lib/bootstrap-manuscript'
import {
  useGetPermittedActions,
  useGetPerson,
  useGetSubmission,
  useUpdateAttachmentDesignation,
  useUploadAttachment,
} from '../../../lib/lean-workflow-gql'
import { ContainerIDs } from '../../../sync/Collection'
import { theme } from '../../../theme/theme'
import { SnapshotsDropdown } from '../../inspector/SnapshotsDropdown'
import { IntlProps, withIntl } from '../../IntlProvider'
import CitationEditor from '../../library/CitationEditor'
import { CitationViewer } from '../../library/CitationViewer'
import MetadataContainer from '../../metadata/MetadataContainer'
import { ModalProps, withModal } from '../../ModalProvider'
import { Main } from '../../Page'
import Panel from '../../Panel'
import { ManuscriptPlaceholder } from '../../Placeholders'
import { RequirementsInspector } from '../../requirements/RequirementsInspector'
import { ResizingInspectorButton } from '../../ResizerButtons'
import { Corrections } from '../../track/Corrections'
import { SortByDropdown } from '../../track/SortByDropdown'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
  EditorHeader,
} from '../EditorContainer'
import { EditorStyles } from '../EditorStyles'
import { Inspector } from '../InspectorLW'
import { ManuscriptPageContainerProps } from '../ManuscriptPageContainer'
import ManuscriptSidebar from '../ManuscriptSidebar'
import { ReloadDialog } from '../ReloadDialog'
import {
  ApplicationMenuContainer,
  ApplicationMenusLW as ApplicationMenus,
} from './ApplicationMenusLW'
import { CommentsTab } from './CommentsTab'
import { ContentTab } from './ContentTab'
import EditorElement from './EditorElement'
import { ErrorDialog } from './ErrorDialog'
import { TrackChangesStyles } from './TrackChangesStyles'

interface RouteParams {
  projectID: string
  manuscriptID: string
}

type CombinedProps = ManuscriptPageContainerProps &
  RouteComponentProps<RouteParams> &
  IntlProps &
  ModalProps

const useLoadManuscript = createUseLoadable(bootstrap)

const ManuscriptPageContainer: React.FC<CombinedProps> = (props) => {
  const { project, match } = props

  const { data, isLoading, error } = useLoadManuscript({
    projectID: project._id,
    manuscriptID: match.params.manuscriptID,
  })

  const [commentTarget, setCommentTarget] = useState<string | undefined>()

  if (isLoading) {
    return <ManuscriptPlaceholder />
  } else if (error || !data) {
    return (
      <ReloadDialog
        message={error ? error.message : 'Unable to laod Manuscript'}
      />
    )
  }

  return (
    <ManuscriptPageView
      {...data}
      {...props}
      commentTarget={commentTarget}
      setCommentTarget={setCommentTarget}
    />
  )
}

export interface ManuscriptPageViewProps extends CombinedProps {
  commitAtLoad?: Commit | null
  commits: Commit[]
  doc: ManuscriptNode
  ancestorDoc: ManuscriptNode
  snapshotID: string | null
  modelMap: Map<string, Model>
  snapshots: Array<RxDocument<Snapshot>>
  setCommentTarget: (commentTarget?: string) => void
  commentTarget?: string
}

const ManuscriptPageView: React.FC<ManuscriptPageViewProps> = (props) => {
  const {
    manuscript,
    project,
    user,
    history,
    doc,
    modelMap,
    snapshotID,
    snapshots,
    comments,
    notes,
    setCommentTarget,
    commentTarget,
    tags,
  } = props

  const popper = useRef<PopperManager>(new PopperManager())
  const {
    getModel,
    saveModel,
    saveManuscript,
    deleteModel,
    collection,
    bundle,
  } = useManuscriptModels(modelMap, project._id, manuscript._id)

  const biblio = useBiblio({
    bundle,
    library: props.library,
    collection,
    lang: props.manuscript.primaryLanguageCode || 'en-GB',
  })

  const retrySync = (componentIDs: string[]) => {
    componentIDs.forEach((id) => {
      const model = getModel(id)
      if (!model) {
        return
      }
      saveModel(model)
    })
    return Promise.resolve()
  }

  const submissionData = useGetSubmission(
    manuscript._id,
    manuscript.containerID
  )

  const submissionId = submissionData?.data?.submission?.id

  const putAttachment = (file: File, designation = 'supplementary') => {
    return uploadAttachment({
      submissionId: submissionId,
      file: file,
      designation: designation,
    })
      .then(({ data }) => {
        return data.uploadAttachment?.link
      })
      .catch((e) => {
        console.error(e)
        return null
      })
  }

  const files = getModelsByType<ExternalFile>(
    modelMap,
    ObjectTypes.ExternalFile
  )

  const handleSubmissionMutation = useCallback(
    (mutaton: Promise<any>, errorLog: string) => {
      return mutaton
        .then((res) => {
          if (!res) {
            handleDialogError(errorLog, 'Error', true)
          }
          return res
        })
        .catch((e) => {
          handleDialogError(
            e.graphQLErrors[0] || e.message,
            'Something went wrong while updating submission.',
            true
          )
          return false
        })
    },
    []
  )

  const changeAttachmentDesignation = useUpdateAttachmentDesignation()
  const handleChangeAttachmentDesignation = useCallback(
    (submissionId: string, designation: string, name: string) => {
      return handleSubmissionMutation(
        changeAttachmentDesignation({
          submissionId: submissionId,
          name: name,
          designation: designation,
        }),
        'Something went wrong while updating attachment designation.'
      )
    },
    [changeAttachmentDesignation, handleSubmissionMutation]
  )

  const editorProps = {
    doc,

    locale: manuscript.primaryLanguageCode || 'en-GB',
    permissions: { write: true },
    environment: config.environment,
    history,
    popper: popper.current,
    projectID: project._id,

    // refactor the library stuff to a hook-ish type thingy
    ...biblio,

    // model and attachment retrieval:
    modelMap,
    getManuscript: () => manuscript,
    getCurrentUser: () => user,
    getModel,
    saveModel,
    deleteModel,
    putAttachment: putAttachment,
    setCommentTarget,
    retrySync,

    renderReactComponent: ReactDOM.render,
    unmountReactComponent: ReactDOM.unmountComponentAtNode,
    components: {
      CitationEditor,
      CitationViewer,
    },

    ancestorDoc: props.ancestorDoc,
    commit: props.commitAtLoad || null,
    externalFiles: files,
    theme,
    submissionId: '',
    updateDesignation: (designation: string, name: string) =>
      handleChangeAttachmentDesignation(submissionId, designation, name),
  }

  const editor = useEditor<ManuscriptSchema>(
    ManuscriptsEditor.createState(editorProps),
    ManuscriptsEditor.createView(editorProps)
  )

  const { state, dispatch, view } = editor

  useEffect(() => {
    saveEditorState(state, modelMap, project._id, manuscript._id)
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  const selected = findParentNodeWithIdValue(state.selection)

  const modelIds = modelMap ? Array.from(modelMap?.keys()) : []

  const listCollaborators = (): UserProfile[] =>
    Array.from(props.collaborators.values())

  const bulkUpdate = async (items: Array<ContainedModel>): Promise<void> => {
    for (const value of items) {
      const containerIDs: ContainerIDs = { containerID: manuscript.containerID }

      if (isManuscriptModel(value)) {
        containerIDs.manuscriptID = manuscript._id
      }

      await collection.save(value, containerIDs, true)
    }
  }

  const [sortBy, setSortBy] = useState('Date')
  const [errorDialog, setErrorDialog] = useState(false)
  const [header, setHeader] = useState('')
  const [message, setMessage] = useState('')
  const handleSort = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSortBy(event.currentTarget.value)
    },
    []
  )
  const { commits, corrections, freeze, accept, reject } = useCommits({
    modelMap,
    initialCommits: props.commits,
    editor,
    containerID: project._id,
    manuscriptID: manuscript._id,
    userProfileID: props.user._id,
    // TODO: we have to have a snapshotID
    snapshotID: snapshotID || '',
    ancestorDoc: props.ancestorDoc,
    sortBy,
  })

  const [selectedSnapshot, selectSnapshot] = useState(snapshots[0])

  const handleSelect = useCallback((snapshot) => {
    selectSnapshot(snapshot)
  }, [])

  useEffect(() => {
    if (submissionId) {
      const newEditorProps = {
        ...editorProps,
        submissionId,
        updateDesignation: (designation: string, name: string) =>
          handleChangeAttachmentDesignation(submissionId, designation, name),
      }
      editor.replaceView(
        ManuscriptsEditor.createState(newEditorProps),
        ManuscriptsEditor.createView(newEditorProps)
      )
    }
  }, [submissionId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDialogError = (
    errorMessage: string,
    errorHeader: string,
    showDialog: boolean
  ) => {
    setMessage(errorMessage)
    setHeader(errorHeader)
    setErrorDialog(showDialog)
  }

  const uploadAttachment = useUploadAttachment()
  const handleUploadAttachment = useCallback(
    (submissionId: string, file: File, designation: string) => {
      return handleSubmissionMutation(
        uploadAttachment({
          submissionId: submissionId,
          file: file,
          designation: designation,
        }),
        'Something went wrong while uploading attachment.'
      )
    },
    [uploadAttachment, handleSubmissionMutation]
  )

  const handleReplaceAttachment = useCallback(
    (submissionId: string, name: string, file: File, typeId: string) => {
      handleSubmissionMutation(
        uploadAttachment({
          submissionId: submissionId,
          file: file,
          designation: typeId,
        }),
        'Something went wrong while Uploading attachment.'
      )

      return handleSubmissionMutation(
        changeAttachmentDesignation({
          submissionId: submissionId,
          name: name,
          designation: typeId,
        }),
        'Something went wrong while replacing attachment.'
      )
    },
    [uploadAttachment, changeAttachmentDesignation, handleSubmissionMutation]
  )

  const handleDownloadAttachment = useCallback((url: string) => {
    window.location.assign(url)
  }, [])

  const personData = useGetPerson()
  const permittedActionsData = useGetPermittedActions(submissionId)
  const permittedActions = permittedActionsData?.data?.permittedActions
  const lwRole = personData?.data?.person?.role?.id

  const TABS = [
    'Content',
    (config.features.commenting || config.features.productionNotes) &&
      'Comments',
    config.features.qualityControl && 'Quality',
    config.shackles.enabled && 'History',
    config.features.fileManagement && 'Files',
  ].filter(Boolean) as Array<
    'Content' | 'Comments' | 'Quality' | 'History' | 'Files'
  >
  return (
    <RequirementsProvider modelMap={modelMap}>
      <CapabilitiesProvider
        profile={props.user}
        project={project}
        lwRole={lwRole}
        permittedActions={permittedActions}
      >
        <ManuscriptSidebar
          project={project}
          manuscript={manuscript}
          view={view}
          doc={doc}
          permissions={editorProps.permissions}
          manuscripts={props.manuscripts}
          user={user}
          tokenActions={props.tokenActions}
          saveModel={saveModel}
          selected={selected || null}
        />
        <Main>
          <EditorContainer>
            <EditorContainerInner>
              <EditorHeader>
                <ApplicationMenuContainer>
                  <ApplicationMenus
                    history={props.history}
                    editor={editor}
                    addModal={props.addModal}
                    manuscriptID={manuscript._id}
                    modelMap={modelMap}
                    saveModel={saveModel}
                    project={project}
                    collection={collection}
                  />
                </ApplicationMenuContainer>
                <ManuscriptToolbar
                  state={state}
                  dispatch={dispatch}
                  footnotesEnabled={config.features.footnotes}
                  view={view}
                />
              </EditorHeader>
              <EditorBody>
                <MetadataContainer
                  manuscript={manuscript}
                  saveManuscript={saveManuscript}
                  handleTitleStateChange={() => '' /*FIX THIS*/}
                  saveModel={saveModel}
                  deleteModel={deleteModel}
                  permissions={editorProps.permissions}
                  tokenActions={props.tokenActions}
                />
                <EditorStyles modelMap={modelMap}>
                  <TrackChangesStyles trackEnabled={!!snapshotID}>
                    <EditorElement
                      editor={editor}
                      modelMap={modelMap}
                      saveModel={saveModel}
                      changeAttachmentDesignation={(
                        designation: string,
                        name: string
                      ) =>
                        handleChangeAttachmentDesignation(
                          submissionId,
                          designation,
                          name
                        )
                      }
                    />
                  </TrackChangesStyles>
                </EditorStyles>
              </EditorBody>
            </EditorContainerInner>
          </EditorContainer>
        </Main>
        <Panel
          name={'inspector'}
          minSize={400}
          direction={'row'}
          side={'start'}
          hideWhen={'max-width: 900px'}
          forceOpen={commentTarget !== undefined}
          resizerButton={ResizingInspectorButton}
        >
          <Inspector tabs={TABS} commentTarget={commentTarget}>
            {TABS.map((label) => {
              switch (label) {
                case 'Content': {
                  return (
                    <ContentTab
                      selected={selected}
                      selectedElement={findParentElement(
                        state.selection,
                        modelIds
                      )}
                      selectedSection={findParentSection(state.selection)}
                      getModel={getModel}
                      modelMap={modelMap}
                      manuscript={manuscript}
                      state={state}
                      dispatch={dispatch}
                      hasFocus={view?.hasFocus()}
                      doc={doc}
                      saveModel={saveModel}
                      deleteModel={deleteModel}
                      saveManuscript={saveManuscript}
                      listCollaborators={listCollaborators}
                      project={project}
                      tags={tags}
                      key="content"
                    />
                  )
                }
                case 'Comments': {
                  return (
                    <CommentsTab
                      comments={comments}
                      notes={notes}
                      state={state}
                      dispatch={dispatch}
                      doc={doc}
                      user={props.user}
                      collaborators={props.collaborators}
                      collaboratorsById={props.collaboratorsById}
                      keywords={props.keywords}
                      saveModel={saveModel}
                      deleteModel={deleteModel}
                      selected={selected}
                      setCommentTarget={setCommentTarget}
                      commentTarget={commentTarget}
                      key="comments"
                    />
                  )
                }

                case 'Quality': {
                  return (
                    <RequirementsInspector
                      modelMap={modelMap}
                      prototypeId={manuscript.prototype}
                      manuscriptID={manuscript._id}
                      bulkUpdate={bulkUpdate}
                      key="quality"
                    />
                  )
                }
                case 'History': {
                  return snapshotID ? (
                    <React.Fragment key="history">
                      <SnapshotsDropdown
                        snapshots={snapshots}
                        selectedSnapshot={selectedSnapshot}
                        selectSnapshot={handleSelect}
                        selectedSnapshotURL={`/projects/${project._id}/history/${selectedSnapshot.s3Id}/manuscript/${manuscript._id}`}
                      />
                      <SortByDropdown sortBy={sortBy} handleSort={handleSort} />
                      <Corrections
                        project={project}
                        editor={editor}
                        corrections={corrections}
                        commits={commits}
                        collaborators={props.collaboratorsById}
                        freeze={freeze}
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
                          isOpen={errorDialog}
                          header={header}
                          message={message}
                          handleOk={() => setErrorDialog(false)}
                        />
                      )}
                      <FileManager
                        submissionId={submissionId}
                        externalFiles={files}
                        enableDragAndDrop={true}
                        handleChangeDesignation={
                          handleChangeAttachmentDesignation
                        }
                        handleDownload={handleDownloadAttachment}
                        handleReplace={handleReplaceAttachment}
                        handleUpload={handleUploadAttachment}
                      />
                    </>
                  ) : null
                }
              }
            })}
          </Inspector>
        </Panel>
      </CapabilitiesProvider>
    </RequirementsProvider>
  )
}

export default withModal(withIntl(ManuscriptPageContainer))
