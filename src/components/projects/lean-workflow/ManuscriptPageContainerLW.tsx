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
import '@manuscripts/manuscript-editor/styles/LeanWorkflow.css'
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
import {
  CapabilitiesProvider,
  FileManager,
  useCalcPermission,
  usePermissions,
} from '@manuscripts/style-guide'
import { Commit } from '@manuscripts/track-changes'
import React, { useCallback, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'

import config from '../../../config'
import { useBiblio } from '../../../hooks/use-biblio'
import { useChangeReceiver } from '../../../hooks/use-change-receiver'
import { getUnsavedComment, useComments } from '../../../hooks/use-comments'
import { useCommits } from '../../../hooks/use-commits'
import { createUseLoadable } from '../../../hooks/use-loadable'
import {
  ManuscriptModelsProvider,
  useManuscriptModels,
} from '../../../hooks/use-manuscript-models'
import { useRequirementsValidation } from '../../../hooks/use-requirements-validation'
import { bootstrap } from '../../../lib/bootstrap-manuscript'
import {
  Person,
  Submission,
  useGetPermittedActions,
  useGetSubmissionAndPerson,
  useSetMainManuscript,
  useUpdateAttachmentDesignation,
  useUpdateAttachmentFile,
  useUploadAttachment,
} from '../../../lib/lean-workflow-gql'
import { getUserRole, isViewer } from '../../../lib/roles'
import { ContainerIDs } from '../../../sync/Collection'
import { theme } from '../../../theme/theme'
import { SnapshotsDropdown } from '../../inspector/SnapshotsDropdown'
import { IntlProps, withIntl } from '../../IntlProvider'
import CitationEditor from '../../library/CitationEditor'
import { CitationViewer } from '../../library/CitationViewer'
import { ReferencesViewer } from '../../library/ReferencesViewer'
import MetadataContainer from '../../metadata/MetadataContainer'
import { ModalProps, withModal } from '../../ModalProvider'
import { Main } from '../../Page'
import Panel from '../../Panel'
import { ManuscriptPlaceholder } from '../../Placeholders'
import { RequirementsInspectorView } from '../../requirements/RequirementsInspector'
import { ResizingInspectorButton } from '../../ResizerButtons'
import TemplateSelector from '../../templates/TemplateSelector'
import { Corrections } from '../../track/Corrections'
import { SortByDropdown } from '../../track/SortByDropdown'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
  EditorHeader,
} from '../EditorContainer'
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
import { ExceptionDialog } from './ExceptionDialog'
import { ManualFlowTransitioning } from './ManualFlowTransitioning'
import { UserProvider } from './provider/UserProvider'
import { SaveStatusController } from './SaveStatusController'
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

  const submissionData = useGetSubmissionAndPerson(
    match.params.manuscriptID,
    project._id
  )

  const submissionId: string = submissionData?.data?.submission?.id
  const lwUser: Person = submissionData?.data?.person
  const permittedActionsData = useGetPermittedActions(submissionId)
  const permittedActions = permittedActionsData?.data?.permittedActions
  // lwRole must not be used to calculate permissions in the contenxt of manuscripts app.
  // lwRole is only for the dashboard
  const can = useCalcPermission({
    profile: props.user,
    project,
    permittedActions,
  })

  if (isLoading || submissionData.loading || permittedActionsData.loading) {
    return <ManuscriptPlaceholder />
  } else if (error || !data) {
    return (
      <UserProvider
        lwUser={lwUser}
        manuscriptUser={props.user}
        submissionId={submissionId}
      >
        <ExceptionDialog errorCode={'MANUSCRIPT_ARCHIVE_FETCH_FAILED'} />
      </UserProvider>
    )
  }

  if (submissionData.error || permittedActionsData.error) {
    const networkError =
      submissionData.error?.networkError ||
      permittedActionsData.error?.networkError
    const message = networkError
      ? 'Trouble reaching lean server. Please try again.'
      : submissionData.error
      ? 'Request for project submission from server failed.'
      : 'Request for user permissions from server failed.'
    return <ReloadDialog message={message} />
  }

  return (
    <ManuscriptModelsProvider
      modelMap={data.modelMap}
      containerID={project._id}
      manuscriptID={match.params.manuscriptID}
    >
      <CapabilitiesProvider can={can}>
        <ManuscriptPageView
          {...data}
          {...props}
          submission={submissionData?.data?.submission}
          lwUser={lwUser}
        />
      </CapabilitiesProvider>
    </ManuscriptModelsProvider>
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
  submission: Submission
  lwUser: Person
}

const ManuscriptPageView: React.FC<ManuscriptPageViewProps> = (props) => {
  const {
    manuscript,
    project,
    user,
    history,
    doc,
    snapshotID,
    snapshots,
    comments,
    notes,
    tags,
    submission,
    addModal,
    lwUser,
  } = props

  const submissionId: string = submission?.id
  const popper = useRef<PopperManager>(new PopperManager())
  const {
    getModel,
    saveModel,
    saveManuscript,
    deleteModel,
    collection,
    modelMap,
    bundle,
  } = useManuscriptModels()

  const openTemplateSelector = (
    newProject?: boolean,
    switchTemplate?: boolean
  ) => {
    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        projectID={newProject ? undefined : project._id}
        user={user}
        handleComplete={handleClose}
        manuscript={manuscript}
        switchTemplate={switchTemplate}
        modelMap={modelMap}
      />
    ))
  }

  const can = usePermissions()

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
            e.graphQLErrors[0] ? e.graphQLErrors[0].message : e && e.message,
            'Something went wrong while updating submission.',
            true
          )
          return false
        })
    },
    []
  )

  const setMainManuscript = useSetMainManuscript()
  const changeAttachmentDesignation = useUpdateAttachmentDesignation()
  const handleChangeAttachmentDesignation = useCallback(
    (submissionId: string, designation: string, name: string) => {
      if (designation == 'main-manuscript') {
        return handleSubmissionMutation(
          setMainManuscript({
            submissionId: submissionId,
            name: name,
          }),
          'Something went wrong while setting main manuscript.'
        )
      }
      return handleSubmissionMutation(
        changeAttachmentDesignation({
          submissionId: submissionId,
          name: name,
          designation: designation,
        }),
        'Something went wrong while updating attachment designation.'
      )
    },
    [changeAttachmentDesignation, handleSubmissionMutation, setMainManuscript]
  )
  const editorProps = {
    doc,

    locale: manuscript.primaryLanguageCode || 'en-GB',
    permissions: { write: !isViewer(project, props.user.userID) },
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
    retrySync,

    renderReactComponent: ReactDOM.render,
    unmountReactComponent: ReactDOM.unmountComponentAtNode,
    components: {
      ReferencesViewer,
      CitationEditor,
      CitationViewer,
    },

    ancestorDoc: props.ancestorDoc,
    commit: props.commitAtLoad || null,
    externalFiles: files,
    theme,
    submissionId,
    capabilities: can,
    updateDesignation: (designation: string, name: string) =>
      handleChangeAttachmentDesignation(submissionId, designation, name),
    uploadAttachment: (designation: string, file: File) =>
      putAttachment(file, designation),
  }

  const editor = useEditor<ManuscriptSchema>(
    ManuscriptsEditor.createState(editorProps),
    ManuscriptsEditor.createView(editorProps)
  )

  const { state, doCommand, dispatch, view } = editor
  useChangeReceiver(editor, saveModel, deleteModel)

  const validation = useRequirementsValidation({
    project,
    manuscript,
    state,
    modelMap,
  })

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

  const commentController = useComments(comments, user, state, doCommand)

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
  const { commits, corrections, accept, reject, isDirty } = useCommits({
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

  const handleDialogError = (
    errorMessage: string,
    errorHeader: string,
    showDialog: boolean
  ) => {
    setMessage(errorMessage)
    setHeader(errorHeader)
    setErrorDialog(showDialog)
  }

  const { uploadAttachment, uploadAttachmentError } = useUploadAttachment()
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

  const updateAttachmentFile = useUpdateAttachmentFile()
  const handleReplaceAttachment = useCallback(
    (submissionId: string, name: string, file: File, typeId: string) => {
      // to replace main manuscript we need first to upload the file and then change its designation to main-manuscript
      if (typeId == 'main-manuscript') {
        return uploadAttachment({
          submissionId: submissionId,
          file: file,
          designation: 'sumbission-file',
        }).then(() => {
          return handleSubmissionMutation(
            setMainManuscript({
              submissionId,
              name,
            }),
            'Something went wrong while setting main manuscript.'
          )
        })
      }

      return handleSubmissionMutation(
        updateAttachmentFile({
          submissionId,
          file,
          name,
        }),
        'Something went wrong while replacing attachment.'
      )
    },
    [
      updateAttachmentFile,
      handleSubmissionMutation,
      setMainManuscript,
      uploadAttachment,
    ]
  )

  const handleDownloadAttachment = useCallback((url: string) => {
    window.location.assign(url)
  }, [])

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
      <UserProvider
        lwUser={lwUser}
        manuscriptUser={props.user}
        submissionId={submission.id}
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
        <PageWrapper>
          <Main>
            <EditorContainer>
              <EditorContainerInner>
                {/* ManualFlowTransitioning will fail if no nextStep is present,
                  which will happen on the very last step = 'Published'
                  this should be handled later with are more graceful way but it is not clear at this point how.
              */}
                {submission.nextStep && (
                  <ManualFlowTransitioning
                    submission={submission}
                    userRole={getUserRole(project, user.userID)}
                    documentId={`${project._id}#${manuscript._id}`}
                  >
                    <SaveStatusController isDirty={isDirty} />
                  </ManualFlowTransitioning>
                )}

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
                      contentEditable={editorProps.permissions.write}
                    />
                  </ApplicationMenuContainer>
                  {can.seeEditorToolbar && (
                    <ManuscriptToolbar
                      state={state}
                      can={can}
                      dispatch={dispatch}
                      footnotesEnabled={config.features.footnotes}
                      view={view}
                    />
                  )}
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
                    allowInvitingAuthors={false}
                    showAuthorEditButton={editorProps.permissions.write}
                  />
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
            resizerButton={ResizingInspectorButton}
            forceOpen={!!getUnsavedComment(commentController.items)}
          >
            <Inspector
              tabs={TABS}
              commentTarget={
                getUnsavedComment(commentController.items) || undefined
              }
            >
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
                        openTemplateSelector={openTemplateSelector}
                      />
                    )
                  }
                  case 'Comments': {
                    return (
                      <CommentsTab
                        commentController={commentController}
                        notes={notes}
                        user={props.user}
                        collaborators={props.collaborators}
                        collaboratorsById={props.collaboratorsById}
                        keywords={props.keywords}
                        saveModel={saveModel}
                        deleteModel={deleteModel}
                        selected={selected}
                        key="comments"
                      />
                    )
                  }

                  case 'Quality': {
                    return (
                      <RequirementsInspectorView
                        modelMap={modelMap}
                        prototypeId={manuscript.prototype}
                        manuscriptID={manuscript._id}
                        bulkUpdate={bulkUpdate}
                        key="quality"
                        result={validation.result}
                        error={validation.error}
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
                        <SortByDropdown
                          sortBy={sortBy}
                          handleSort={handleSort}
                        />
                        <Corrections
                          project={project}
                          editor={editor}
                          corrections={corrections}
                          commits={commits}
                          collaborators={props.collaboratorsById}
                          accept={accept}
                          reject={reject}
                          user={user}
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
                          can={can}
                          enableDragAndDrop={true}
                          handleChangeDesignation={
                            handleChangeAttachmentDesignation
                          }
                          handleDownload={handleDownloadAttachment}
                          handleReplace={handleReplaceAttachment}
                          handleUpload={handleUploadAttachment}
                        />
                        {uploadAttachmentError && (
                          <ExceptionDialog errorCode={uploadAttachmentError} />
                        )}
                      </>
                    ) : null
                  }
                }
              })}
            </Inspector>
          </Panel>
        </PageWrapper>
      </UserProvider>
    </RequirementsProvider>
  )
}

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 2;
  overflow: hidden;
`

export default withModal(withIntl(ManuscriptPageContainer))
