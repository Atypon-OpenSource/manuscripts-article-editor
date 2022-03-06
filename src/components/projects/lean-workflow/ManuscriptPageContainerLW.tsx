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
  getModelsByType,
  ManuscriptNode,
  ManuscriptSchema,
} from '@manuscripts/manuscript-transform'
import {
  ExternalFile,
  Manuscript,
  Model,
  ObjectTypes,
  Project,
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'

import config from '../../../config'
import { getUnsavedComment, useComments } from '../../../hooks/use-comments'
import { useCommits } from '../../../hooks/use-commits'
import { useRequirementsValidation } from '../../../hooks/use-requirements-validation'
import {
  getErrorCode,
  Person,
  Submission,
  useGetPermittedActions,
  useGetSubmissionAndPerson,
  useSetMainManuscript,
  useUpdateAttachmentDesignation,
  useUpdateAttachmentFile,
  useUploadAttachment,
} from '../../../lib/lean-workflow-gql'
import { getUserRole, isAnnotator, isViewer } from '../../../lib/roles'
import { useStore } from '../../../store'
import { theme } from '../../../theme/theme'
import { ThemeProvider } from '../../../theme/ThemeProvider'
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
// import ManuscriptSidebar from '../ManuscriptSidebar'
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

const ManuscriptPageContainer: React.FC<CombinedProps> = (props) => {
  const [{ manuscriptID, project, user }, dispatch] = useStore((state) => {
    return {
      manuscriptID: state.manuscriptID,
      project: state.project,
      user: state.user,
    }
  })

  const submissionData = useGetSubmissionAndPerson(manuscriptID, project._id)

  useEffect(() => {
    if (submissionData?.data?.submission?.id && submissionData?.data?.person) {
      dispatch({
        submission: submissionData.data.submission,
        lwUser: submissionData.data.person,
      })
    }
  }, [submissionData])

  const submissionId: string = submissionData?.data?.submission?.id
  const lwUser: Person = submissionData?.data?.person
  const permittedActionsData = useGetPermittedActions(submissionId)
  const permittedActions = permittedActionsData?.data?.permittedActions
  // lwRole must not be used to calculate permissions in the contenxt of manuscripts app.
  // lwRole is only for the dashboard
  const can = useCalcPermission({
    profile: user,
    project: project,
    permittedActions,
  })

  if (submissionData.loading || permittedActionsData.loading) {
    return <ManuscriptPlaceholder />
  }
  // else if (error || !data) {
  //   return (
  //     <UserProvider
  //       lwUser={lwUser}
  //       manuscriptUser={props.user}
  //       submissionId={submissionId}
  //     >
  //       <ExceptionDialog errorCode={'MANUSCRIPT_ARCHIVE_FETCH_FAILED'} />
  //     </UserProvider>
  //   )
  // }

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
    <CapabilitiesProvider can={can}>
      <ManuscriptPageView />
    </CapabilitiesProvider>
  )
}

export interface ManuscriptPageViewProps extends CombinedProps {
  commitAtLoad?: Commit | null
  commits: Commit[]
  snapshotID: string | null
  snapshots: Array<RxDocument<Snapshot>>
  submission: Submission | null
  lwUser: Person
}

const ManuscriptPageView: React.FC<ManuscriptPageViewProps> = (props) => {
  const [manuscript] = useStore<Manuscript>((store) => store.manuscript)
  const [project] = useStore<Project>((store) => store.project)
  const [user] = useStore<UserProfile>((store) => store.user)
  const [doc] = useStore((store) => store.doc)
  const [snapshotID] = useStore((store) => store.snapshotID)
  const [snapshots] = useStore((store) => store.snapshots)
  const [comments] = useStore((store) => store.comments)
  const [notes] = useStore((store) => store.notes)
  // const [addModal] = useStore((store) => store.addModal)
  const [lwUser] = useStore((store) => store.lwUser)
  const [getModel] = useStore((store) => store.getModel)
  const [saveModel] = useStore((store) => store.saveModel)
  const [deleteModel] = useStore((store) => store.deleteModel)
  const [collection] = useStore((store) => store.collection)
  const [modelMap] = useStore<Map<string, Model>>((store) => store.modelMap)
  const [biblio] = useStore((store) => store.biblio)
  const [submissionID] = useStore((store) => store.submissionID)
  const [ancestorDoc] = useStore((store) => store.ancestorDoc)
  const [commitAtLoad] = useStore((store) => store.commitAtLoad)
  const [initialCommits] = useStore((store) => store.commits)

  const submissionId = submissionID || ''
  const popper = useRef<PopperManager>(new PopperManager())

  const openTemplateSelector = (
    newProject?: boolean,
    switchTemplate?: boolean
  ) => {
    props.addModal('template-selector', ({ handleClose }) => (
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
          const errorCode = getErrorCode(e)
          if (!errorCode) {
            handleDialogError(
              e.graphQLErrors[0] ? e.graphQLErrors[0].message : e && e.message,
              'Something went wrong while updating submission.',
              true
            )
          }
          return false
        })
    },
    []
  )

  const { setMainManuscript, setMainManuscriptError } = useSetMainManuscript()
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
    attributes: {
      class: 'manuscript-editor',
      lang: 'en-GB',
      spellcheck: 'true',
      tabindex: '2',
    },
    doc,

    locale: manuscript.primaryLanguageCode || 'en-GB',
    permissions: { write: !isViewer(project, user.userID) },
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

    renderReactComponent: (child: React.ReactChild, container: HTMLElement) => {
      ReactDOM.render(<ThemeProvider>{child}</ThemeProvider>, container)
    },
    unmountReactComponent: ReactDOM.unmountComponentAtNode,
    components: {
      ReferencesViewer,
      CitationEditor,
      CitationViewer,
    },

    ancestorDoc: ancestorDoc,
    commit: commitAtLoad || null,
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
  // useChangeReceiver(editor, saveModel, deleteModel)

  const validation = useRequirementsValidation({
    project,
    manuscript,
    state,
    modelMap,
  })

  const selected = findParentNodeWithIdValue(state.selection)

  const modelIds = modelMap ? Array.from(modelMap?.keys()) : []

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
    initialCommits: initialCommits,
    editor,
    containerID: project._id,
    manuscriptID: manuscript._id,
    userProfileID: user._id,
    // TODO: we have to have a snapshotID
    snapshotID: snapshotID || '',
    ancestorDoc: ancestorDoc,
    sortBy,
  })

  const hasPendingSuggestions = useMemo(() => {
    for (const { status } of corrections) {
      const { label } = status
      if (label === 'proposed') {
        return true
      }
    }
    return false
  }, [corrections])

  const [selectedSnapshot, selectSnapshot] = useState(snapshots && snapshots[0])

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

  const {
    updateAttachmentFile,
    updateAttachmentFileError,
  } = useUpdateAttachmentFile()
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
        manuscriptUser={user}
        submissionId={submissionId}
      >
        {/* 
          // Commented as this is not needed in the LW
         <ManuscriptSidebar
          project={project}
          manuscript={manuscript}
          view={view}
          doc={state.doc}
          permissions={editorProps.permissions}
          manuscripts={manuscripts}
          user={user}
          tokenActions={tokenActions}
          saveModel={saveModel}
          selected={selected || null}
        /> */}
        <PageWrapper>
          <Main>
            <EditorContainer>
              <EditorContainerInner>
                {/* ManualFlowTransitioning will fail if no nextStep is present,
                  which will happen on the very last step = 'Published'
                  this should be handled later with are more graceful way but it is not clear at this point how.
              */}
                {submission?.nextStep && (
                  <ManualFlowTransitioning
                    submission={submission}
                    userRole={getUserRole(project, user.userID)}
                    documentId={`${project._id}#${manuscript._id}`}
                    hasPendingSuggestions={hasPendingSuggestions}
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
                    handleTitleStateChange={() => '' /*FIX THIS*/}
                    permissions={editorProps.permissions}
                    allowInvitingAuthors={false}
                    showAuthorEditButton={true}
                    disableEditButton={
                      isViewer(project, user.userID) ||
                      isAnnotator(project, user.userID)
                    }
                  />
                  <TrackChangesStyles
                    enabled={!!snapshotID}
                    readOnly={!can.handleSuggestion}
                    rejectOnly={can.rejectOwnSuggestion}
                    corrections={corrections}
                  >
                    <EditorElement
                      editor={editor}
                      accept={accept}
                      reject={reject}
                      doCommand={doCommand}
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
                        state={state}
                        dispatch={dispatch}
                        hasFocus={view?.hasFocus()}
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
                        {setMainManuscriptError && (
                          <ExceptionDialog errorCode={setMainManuscriptError} />
                        )}
                        {updateAttachmentFileError && (
                          <ExceptionDialog
                            errorCode={updateAttachmentFileError}
                          />
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

  .edit_authors_button {
    display: initial;
    color: ${(props) => props.theme.colors.button.secondary.color.default};
    background: ${(props) =>
      props.theme.colors.button.secondary.background.default};
    border-color: ${(props) =>
      props.theme.colors.button.secondary.border.default};

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      color: ${(props) => props.theme.colors.button.secondary.color.hover};
      background: ${(props) =>
        props.theme.colors.button.secondary.background.hover};
      border-color: ${(props) =>
        props.theme.colors.button.secondary.border.hover};
    }
  }
`

export default withModal(withIntl(ManuscriptPageContainer))
