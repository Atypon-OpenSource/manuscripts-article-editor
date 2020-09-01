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
  createProcessor,
  GetCitationProcessor,
  matchLibraryItemByIdentifier,
  transformBibliography,
} from '@manuscripts/library'
import {
  ApplicationMenu,
  canInsert,
  ChangeReceiver,
  Editor,
  findParentElement,
  findParentNodeWithIdValue,
  findParentSection,
  insertInlineCitation,
  MenuItem,
  menus as editorMenus,
  PopperManager,
  RequirementsProvider,
} from '@manuscripts/manuscript-editor'
import '@manuscripts/manuscript-editor/styles/Editor.css'
import '@manuscripts/manuscript-editor/styles/popper.css'
import {
  ActualManuscriptNode,
  Build,
  buildBibliographyItem,
  buildContributor,
  buildKeyword,
  buildManuscript,
  buildModelMap,
  ContainedModel,
  ContainedProps,
  Decoder,
  DEFAULT_BUNDLE,
  documentObjectTypes,
  elementObjects,
  encode,
  generateID,
  getAttachment,
  getModelsByType,
  hasObjectType,
  isFigure,
  isManuscriptModel,
  isUserProfile,
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptModel,
  ManuscriptNode,
  ManuscriptPlugin,
  ModelAttachment,
  schema,
  Selected,
  timestamp,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Bundle,
  CommentAnnotation,
  Figure,
  Keyword,
  Manuscript,
  ManuscriptTemplate,
  Model,
  ObjectTypes,
  Project,
  Section,
  Submission,
  Tag,
  UserProfile,
  UserProject,
} from '@manuscripts/manuscripts-json-schema'
import { RxDocument } from '@manuscripts/rxdb'
import {
  ConflictManager,
  conflictsKey,
  createTreeChangeQueue,
  isTreeChange,
  LocalConflicts,
  plugins as syncPlugins,
  SYNC_ERROR_LOCAL_DOC_ID,
  SyncErrors,
  syncErrorsKey,
  TreeChanges,
} from '@manuscripts/sync-client'
import { TitleEditorState, TitleEditorView } from '@manuscripts/title-editor'
import '@reach/tabs/styles.css'
import CiteProc from 'citeproc'
import debounce from 'lodash-es/debounce'
import React from 'react'
import ReactDOM from 'react-dom'
import { Prompt, RouteComponentProps } from 'react-router'
import { Subscription } from 'rxjs/Subscription'
import config from '../../config'
import { TokenActions } from '../../data/TokenData'
import { PROFILE_IMAGE_ATTACHMENT } from '../../lib/data'
import deviceId from '../../lib/device-id'
import { loadTargetJournals } from '../../lib/literatum'
import {
  isManuscript,
  isSection,
  nextManuscriptPriority,
} from '../../lib/manuscript'
import {
  createDispatchManuscriptToolbarAction,
  createDispatchTitleToolbarAction,
  manuscriptToolbarState,
  postWebkitMessage,
  titleToolbarState,
} from '../../lib/native'
import {
  createDispatchMenuAction,
  createGetMenuState,
} from '../../lib/native/menu'
import { buildProjectMenu } from '../../lib/project-menu'
import { buildTemplateModels } from '../../lib/publish-template'
import { canWrite } from '../../lib/roles'
import { filterLibrary } from '../../lib/search-library'
import sessionID from '../../lib/session-id'
import {
  attachStyle,
  createNewBundle,
  createParentBundle,
  updatedPageLayout,
} from '../../lib/templates'
import {
  buildRecentProjects,
  buildUserProject,
  RecentProject,
} from '../../lib/user-project'
import { ExportFormat } from '../../pressroom/exporter'
import { importBundledData } from '../../pressroom/importers'
import { Collection, ContainerIDs } from '../../sync/Collection'
import CollectionManager from '../../sync/CollectionManager'
// import { newestFirst, oldestFirst } from '../../lib/sort'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { Permissions } from '../../types/permissions'
import { AnyElement } from '../inspector/ElementStyleInspector'
import IntlProvider, { IntlProps, withIntl } from '../IntlProvider'
import CitationEditor from '../library/CitationEditor'
import { CitationViewer } from '../library/CitationViewer'
import MetadataContainer from '../metadata/MetadataContainer'
import { ModalProps, withModal } from '../ModalProvider'
import { Notification } from '../NotificationMessage'
import { NotificationProvider } from '../NotificationProvider'
import { Main } from '../Page'
import Panel from '../Panel'
import { ManuscriptPlaceholder } from '../Placeholders'
import CitationStyleSelector from '../templates/CitationStyleSelector'
import TemplateSelector from '../templates/TemplateSelector'
import { ResizingInspectorButton } from './../ResizerButtons'
import { ApplicationMenuContainer } from './ApplicationMenuContainer'
import ConflictResolver from './ConflictResolver'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
  EditorHeader,
} from './EditorContainer'
import { EditorStyles } from './EditorStyles'
import { Exporter } from './Exporter'
import { Importer } from './Importer'
import { Inspector } from './Inspector'
import {
  EditorType,
  EditorViewType,
  ManuscriptPageToolbar,
} from './ManuscriptPageToolbar'
import ManuscriptSidebar from './ManuscriptSidebar'
import { PreflightDialog } from './PreflightDialog'
import { Presence } from './Presence'
import { PresenceList } from './PresenceList'
import { ReloadDialog } from './ReloadDialog'
import RenameProject from './RenameProject'
import { SuccessModal } from './SuccessModal'

interface ModelObject {
  // [key: string]: ModelObject[keyof ModelObject]
  [key: string]: any // tslint:disable-line:no-any
}

interface State {
  conflictManager?: ConflictManager
  conflicts: LocalConflicts | null
  commentTarget?: string
  dirty: boolean
  doc?: ActualManuscriptNode
  error?: string
  modelIds: {
    [key: string]: Set<string>
  }
  modelMap?: Map<string, Model>
  plugins?: ManuscriptPlugin[]
  popper: PopperManager
  processor?: CiteProc.Engine
  permissions?: Permissions
  selected: Selected | null
  selectedElement?: Selected
  selectedSection?: Selected
  view?: ManuscriptEditorView
  activeEditor?: {
    editor: string
    view: EditorViewType
  }
  submission?: Submission
}

export interface ManuscriptPageContainerProps {
  tags: Tag[]
  comments: CommentAnnotation[]
  keywords: Map<string, Keyword>
  library: Map<string, BibliographyItem>
  manuscripts: Manuscript[]
  manuscript: Manuscript
  project: Project
  projects: Project[]
  user: UserProfileWithAvatar
  collaborators: Map<string, UserProfile>
  collaboratorsById: Map<string, UserProfile>
  projectsCollection: Collection<Project>
  userProjects: UserProject[]
  userProjectsCollection: Collection<UserProject>
  tokenActions: TokenActions
}

interface RouteParams {
  projectID: string
  manuscriptID: string
}

type CombinedProps = ManuscriptPageContainerProps &
  RouteComponentProps<RouteParams> &
  IntlProps &
  ModalProps

class ManuscriptPageContainer extends React.Component<CombinedProps, State> {
  private readonly initialState: Readonly<State>

  private subs: Subscription[] = []

  private collection: Collection<Model>

  private readonly debouncedSaveModels: (state: ManuscriptEditorState) => void

  private requirementFields = [
    'minWordCountRequirement',
    'maxWordCountRequirement',
    'minCharacterCountRequirement',
    'maxCharacterCountRequirement',
  ]

  private readonly preparedManuscriptEditorStateChange: (
    view: EditorViewType,
    docChanged: boolean
  ) => void

  private readonly preparedTitleEditorStateChange: (
    view: EditorViewType,
    docChanged: boolean
  ) => void

  private treeChangeQueue: (modelMap: Map<string, Model>) => void

  private forceEditorUpdate: (parent: string | null, children: string[]) => void

  public constructor(props: CombinedProps) {
    super(props)

    this.state = {
      conflicts: null,
      dirty: false,
      doc: undefined,
      error: undefined,
      modelIds: {
        document: new Set(),
        data: new Set(),
      },
      modelMap: undefined,
      popper: new PopperManager(),
      processor: undefined,
      selected: null,
      view: undefined,
    }

    this.initialState = this.state

    this.debouncedSaveModels = debounce(this.saveModels, 1000, {
      maxWait: 5000,
    })

    this.preparedTitleEditorStateChange = this.handleEditorStateChange(
      EditorType.title
    )

    this.preparedManuscriptEditorStateChange = this.handleEditorStateChange(
      EditorType.manuscript
    )
  }

  public async componentDidMount() {
    const {
      match: {
        params: { projectID, manuscriptID },
      },
    } = this.props

    window.addEventListener('beforeunload', this.unloadListener)

    this.collection = CollectionManager.getCollection<Model>(
      `project-${projectID}`
    )

    this.setPermissions(this.props)

    await this.prepare(projectID, manuscriptID)

    if (config.native) {
      window.dispatchCitation = this.insertNativeCitationSync
    }
  }

  public componentWillReceiveProps(nextProps: CombinedProps) {
    const { params } = this.props.match
    const { params: nextParams } = nextProps.match

    if (
      params.projectID !== nextParams.projectID ||
      params.manuscriptID !== nextParams.manuscriptID
    ) {
      this.subs.forEach(sub => sub.unsubscribe())

      if (params.projectID !== nextParams.projectID) {
        this.collection = CollectionManager.getCollection<Model>(
          `project-${nextParams.projectID}`
        )
      }

      this.setState({ ...this.initialState }, async () => {
        await this.prepare(nextParams.projectID, nextParams.manuscriptID)
      })
    }

    if (
      this.props.project !== nextProps.project ||
      this.props.user !== nextProps.user
    ) {
      this.setPermissions(nextProps)
    }
  }

  public async componentDidUpdate(prevProps: CombinedProps, prevState: State) {
    const { manuscript } = this.props

    if (manuscript !== prevProps.manuscript) {
      if (
        this.shouldUpdateCitationProcessor(manuscript, prevProps.manuscript)
      ) {
        await this.createCitationProcessor(manuscript, this.state.modelMap!)
      }

      this.dispatchUpdate()
    }
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.state.popper.destroy()
    window.removeEventListener('beforeunload', this.unloadListener)
  }

  // tslint:disable:cyclomatic-complexity
  public render() {
    const { projectID } = this.props.match.params

    const {
      dirty,
      modelMap,
      doc,
      activeEditor,
      popper,
      selected,
      view,
      error,
      plugins,
      permissions,
      selectedElement,
      selectedSection,
      commentTarget,
      conflicts,
      submission,
    } = this.state

    const {
      comments,
      manuscript,
      manuscripts,
      project,
      user,
      tokenActions,
    } = this.props

    if (error) {
      return <ReloadDialog message={error} />
    }

    const message = this.props.location.state
      ? this.props.location.state.infoMessage
      : null

    if (!doc || !comments || !plugins || !permissions || !modelMap) {
      return <ManuscriptPlaceholder />
    }

    const section = selectedSection
      ? this.getModel<Section>(selectedSection.node.attrs.id)
      : undefined

    const element = selectedElement
      ? this.getModel<AnyElement>(selectedElement.node.attrs.id)
      : undefined

    const locale = this.getLocale(manuscript)

    const attributes = {
      class: 'manuscript-editor',
      dir: locale === 'ar' ? 'rtl' : 'ltr', // TODO: remove hard-coded locale
      lang: locale,
      spellcheck: 'true',
      tabindex: '2',
    }

    const bundle = this.findBundle()

    return (
      <RequirementsProvider modelMap={modelMap}>
        <ManuscriptSidebar
          openTemplateSelector={this.openTemplateSelector}
          manuscript={manuscript}
          manuscripts={manuscripts}
          project={project}
          doc={doc}
          view={view}
          saveProjectTitle={this.saveProjectTitle}
          selected={selected}
          user={user}
          permissions={permissions}
          tokenActions={tokenActions}
          saveModel={this.saveModel}
        />

        <Main>
          <EditorContainer>
            <EditorContainerInner>
              {config.beacon.http && (
                <Presence
                  containerId={projectID}
                  deviceId={deviceId}
                  manuscriptId={manuscript._id}
                  selectedElementId={element ? element._id : undefined}
                />
              )}

              {view && permissions.write && !config.native && (
                <EditorHeader>
                  <ApplicationMenuContainer>
                    <ApplicationMenu menus={this.buildMenus()} view={view} />
                    {config.beacon.ws && (
                      <PresenceList
                        containerId={projectID}
                        getCollaborator={this.getCollaborator}
                      />
                    )}
                  </ApplicationMenuContainer>

                  {activeEditor && (
                    <ManuscriptPageToolbar
                      editor={activeEditor.editor}
                      view={activeEditor.view}
                      state={activeEditor.view.state}
                    />
                  )}
                </EditorHeader>
              )}

              <EditorBody>
                <MetadataContainer
                  saveManuscript={this.saveManuscript}
                  manuscript={manuscript}
                  saveModel={this.saveModel}
                  deleteModel={this.deleteModel}
                  permissions={permissions}
                  handleTitleStateChange={this.preparedTitleEditorStateChange}
                  tokenActions={this.props.tokenActions}
                  getAttachment={this.collection.getAttachmentAsBlob}
                  putAttachment={this.collection.putAttachment}
                />

                <EditorStyles modelMap={modelMap}>
                  <Editor
                    autoFocus={!!manuscript.title}
                    getCitationProcessor={this.getCitationProcessor}
                    doc={doc}
                    getModel={this.getModel}
                    saveModel={this.saveModel}
                    deleteModel={this.deleteModel}
                    allAttachments={this.collection.allAttachments}
                    putAttachment={this.collection.putAttachment}
                    removeAttachment={this.collection.removeAttachment}
                    setLibraryItem={this.setLibraryItem}
                    getLibraryItem={this.getLibraryItem}
                    matchLibraryItemByIdentifier={
                      this.matchLibraryItemByIdentifier
                    }
                    filterLibraryItems={this.filterLibraryItems}
                    getManuscript={this.getManuscript}
                    getCurrentUser={this.getCurrentUser}
                    history={this.props.history}
                    locale={locale}
                    modelMap={modelMap}
                    plugins={plugins}
                    popper={popper}
                    projectID={projectID}
                    subscribe={this.handleSubscribe}
                    setView={this.setView}
                    attributes={attributes}
                    retrySync={this.retrySync}
                    renderReactComponent={this.renderReactComponent}
                    unmountReactComponent={this.unmountReactComponent}
                    handleStateChange={this.preparedManuscriptEditorStateChange}
                    components={{
                      CitationEditor,
                      CitationViewer,
                    }}
                    jupyterConfig={config.jupyter}
                    permissions={permissions}
                    setCommentTarget={this.setCommentTarget}
                    environment={config.environment}
                  />
                </EditorStyles>
              </EditorBody>
            </EditorContainerInner>
          </EditorContainer>

          <Prompt when={dirty} message={() => false} />

          {message && <Notification message={message} id={manuscript._id} />}

          <ConflictResolver
            conflicts={conflicts}
            modelMap={modelMap}
            conflictManager={this.state.conflictManager!}
            manuscriptID={this.props.match.params.manuscriptID}
            manuscriptTitle={manuscript.title}
          />
        </Main>

        <Panel
          name={'inspector'}
          minSize={400}
          direction={'row'}
          side={'start'}
          hideWhen={'max-width: 900px'}
          forceOpen={commentTarget !== undefined || submission !== undefined}
          resizerButton={ResizingInspectorButton}
        >
          {view && comments && (
            <Inspector
              bundle={bundle}
              comments={comments}
              commentTarget={commentTarget}
              createKeyword={this.createKeyword}
              deleteModel={this.deleteModel}
              dispatchNodeAttrs={this.dispatchNodeAttrs}
              dispatchUpdate={this.dispatchUpdate}
              doc={doc}
              element={element}
              getCollaborator={this.getCollaborator}
              getCollaboratorById={this.getCollaboratorById}
              getCurrentUser={this.getCurrentUser}
              getKeyword={this.getKeyword}
              listCollaborators={this.listCollaborators}
              listKeywords={this.listKeywords}
              manuscript={manuscript}
              modelMap={modelMap}
              openCitationStyleSelector={this.openCitationStyleSelector}
              saveManuscript={this.saveManuscript}
              project={project}
              saveModel={this.saveModel}
              section={section}
              selected={selected}
              selectedSection={selectedSection}
              setCommentTarget={this.setCommentTarget}
              submission={submission}
              view={view}
              tags={this.props.tags}
            />
          )}
        </Panel>
      </RequirementsProvider>
    )
  }

  public handleEditorStateChange = (editor: string) => (
    view: EditorViewType,
    docChanged: boolean
  ): void => {
    this.setState({
      activeEditor: { editor, view },
    })

    switch (editor) {
      case EditorType.manuscript:
        this.handleManuscriptEditorStateChange(
          (view as ManuscriptEditorView).state,
          docChanged
        )
        break

      case EditorType.title:
        this.handleTitleEditorStateChange((view as TitleEditorView).state)
        break
    }
  }

  private findBundle = (): Bundle | undefined => {
    const { manuscript } = this.props
    const { modelMap } = this.state

    if (modelMap && manuscript.bundle) {
      return modelMap.get(manuscript.bundle) as Bundle
    }
  }

  private setPermissions = (props: ManuscriptPageContainerProps) => {
    const { project, user } = props

    this.setState({
      permissions: {
        write: canWrite(project, user.userID),
      },
    })
  }

  private saveUserProject = async (projectID: string, manuscriptID: string) => {
    const {
      userProjects,
      userProjectsCollection,
      user: { userID },
    } = this.props

    const userProject = userProjects.find(
      userProject => userProject.projectID === projectID
    )

    if (!userProject) {
      await userProjectsCollection.create(
        buildUserProject(userID, projectID, manuscriptID, deviceId)
      )
    } else {
      await userProjectsCollection.update(userProject._id, {
        lastOpened: {
          ...userProject.lastOpened,
          [deviceId]: {
            timestamp: timestamp(),
            manuscriptID,
          },
        },
      })
    }
  }

  private prepare = async (projectID: string, manuscriptID: string) => {
    try {
      const conflictManager = new ConflictManager(
        this.collection.getCollection() // TODO: wait for this?
      )

      this.setState({
        conflictManager,
        plugins: syncPlugins.map(plugin =>
          plugin({
            conflictManager,
            popperManager: this.state.popper,
          })
        ),
      })

      const models = await this.loadModels(projectID, manuscriptID)

      // console.log(models.map(doc => [doc.objectType, doc.toJSON()]))

      if (!models.length) {
        throw new Error(
          'Failed to open project for editing due to missing data.'
        )
      }

      const modelMap = await buildModelMap(models)

      try {
        await this.createCitationProcessor(this.props.manuscript, modelMap)
      } catch (error) {
        console.error(error) // tslint:disable-line:no-console
      }

      const decoder = new Decoder(modelMap)

      try {
        const doc = decoder.createArticleNode(
          manuscriptID
        ) as ActualManuscriptNode
        doc.check()

        // encode again here to get doc model ids for comparison
        const encodedModelMap = encode(doc)
        const modelIds = this.buildManuscriptModelIds(encodedModelMap)

        this.setState({ modelIds, modelMap })

        this.setState({ doc })
      } catch (error) {
        console.error(error) // tslint:disable-line:no-console
        throw new Error(
          'Failed to open project for editing due to an error during data preparation.'
        )
      }

      this.treeChangeQueue = createTreeChangeQueue(
        modelMap,
        this.handleTreeChanges
      )

      await this.saveUserProject(projectID, manuscriptID)
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
      this.setState({
        error: error.message,
      })
    }
  }

  private setView = (view: ManuscriptEditorView) => {
    this.setState({ view }, () => {
      this.subscribeToConflicts().catch(err => {
        throw err
      })

      this.subscribeToSyncErrors().catch(err => {
        throw err
      })
    })
  }

  private getOrInsertLocalDocument = async (id: string) => {
    const collection = this.collection.getCollection()

    let localDoc = await collection.getLocal(id)

    if (!localDoc) {
      localDoc = await collection.insertLocal(id, {})
    }

    return localDoc
  }

  private subscribeToSyncErrors = async () => {
    const localDoc = await this.getOrInsertLocalDocument(
      SYNC_ERROR_LOCAL_DOC_ID
    )

    localDoc.$.subscribe((syncErrors: SyncErrors) => {
      const { view } = this.state

      if (!view) {
        throw new Error('View not initialized')
      }

      const tr = view.state.tr.setMeta(syncErrorsKey, syncErrors)

      view.dispatch(tr)
    })
  }

  private retrySync = async (componentIDs: string[]) => {
    for (const componentID of componentIDs) {
      const model = this.getModel(componentID)
      if (!model) {
        throw new Error('Unable to find model for retry')
      }
      // TODO: saveModel doesn't run encode, so fixes to encoders won't work
      // TODO: ideally we wouldn't have to "update" the doc to trigger sync
      await this.saveModel(model)
    }
  }

  private subscribeToConflicts = async () => {
    const { manuscriptID } = this.props.match.params

    let loaded = false

    const localDoc = await this.getOrInsertLocalDocument(manuscriptID)

    localDoc.$.subscribe(async (conflicts: LocalConflicts) => {
      this.setState({ conflicts })

      // when the editor is loaded for the first time, we should check if we
      // have any conflicts to resolve/decorations to create
      if (!loaded) {
        loaded = true

        await this.handleConflicts(conflicts)
      } else {
        const { view } = this.state

        if (!view) {
          throw new Error('View not initialized')
        }

        const tr = view.state.tr.setMeta(conflictsKey, conflicts)

        view.dispatch(tr)
      }
    })
  }

  private getLocale = (manuscript: Manuscript) =>
    manuscript.primaryLanguageCode || this.props.intl.locale || 'en-GB'

  private saveProjectTitle = async (title: string) =>
    this.props.projectsCollection.update(this.props.project._id, {
      title,
    })

  private getManuscript = () => this.props.manuscript

  private saveManuscript = async (data: Partial<Manuscript>) => {
    const previousManuscript = this.getManuscript()

    const manuscript = {
      ...previousManuscript,
      ...data,
    }

    await this.saveModel(manuscript)
  }

  private deleteManuscript = async (id: string) => {
    const { manuscripts, project } = this.props
    const index = manuscripts.findIndex(item => item._id === id)

    const prevManuscript: Manuscript = manuscripts[index === 0 ? 1 : index - 1]

    await this.deleteModel(id)

    if (prevManuscript) {
      this.props.history.push(
        `/projects/${project._id}/manuscripts/${prevManuscript._id}`
      )
    } else {
      this.props.history.push(`/projects/${project._id}`, {
        empty: true,
      })
    }
  }

  private shouldUpdateCitationProcessor = (
    manuscript: Manuscript,
    previousManuscript: Manuscript
  ) => {
    return (
      previousManuscript.bundle !== manuscript.bundle ||
      previousManuscript.primaryLanguageCode !== manuscript.primaryLanguageCode
    )
  }

  private getRecentProjects = (): RecentProject[] => {
    const { projects, userProjects } = this.props
    const { projectID } = this.props.match.params

    return buildRecentProjects(projectID, userProjects, projects)
  }

  private dispatchUpdate = () => {
    const { view } = this.state

    if (view) {
      view.dispatch(view.state.tr.setMeta('update', true))
    }
  }

  private dispatchNodeAttrs = (id: string, attrs: object) => {
    const { view } = this.state

    if (!view) {
      throw new Error('No view!')
    }

    const { tr, doc } = view.state

    doc.descendants((node, pos) => {
      if (node.attrs.id === id) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          ...attrs,
        })

        view.dispatch(tr)
      }
    })
  }

  private addManuscript = async () => {
    const { user } = this.props
    const { projectID } = this.props.match.params

    const manuscript = buildManuscript()
    const manuscriptID = manuscript._id

    const contributor = buildContributor(
      user.bibliographicName,
      'author',
      0,
      user.userID
    )

    await this.collection.create(contributor, {
      containerID: projectID,
      manuscriptID,
    })

    await this.collection.create(manuscript, {
      containerID: projectID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private openTemplateSelector = (newProject?: boolean) => {
    const { addModal, project, user } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        projectID={newProject ? undefined : project._id}
        user={user}
        handleComplete={handleClose}
      />
    ))
  }

  private openCitationStyleSelector = () => {
    const { addModal, project } = this.props

    addModal('citation-style-selector', ({ handleClose }) => (
      <CitationStyleSelector
        collection={this.collection as Collection<ContainedModel>}
        project={project}
        handleComplete={async (bundle?: Bundle, parentBundle?: Bundle) => {
          if (bundle) {
            const { modelMap } = this.state

            if (!modelMap) {
              throw new Error('Missing model map')
            }

            // const modelsToRemove: Model[] = []
            //
            // for (const model of modelMap.values()) {
            //   if (model.objectType === ObjectTypes.Bundle) {
            //     modelsToRemove.push(model)
            //     // modelMap.remove(model._id)
            //   }
            // }

            modelMap.set(bundle._id, bundle)

            if (parentBundle) {
              modelMap.set(parentBundle._id, parentBundle)
            }

            this.setState({ modelMap })

            await this.saveManuscript({ bundle: bundle._id })

            // for (const model of modelsToRemove) {
            //   await this.collection.delete(model._id)
            // }
          }

          handleClose()
        }}
      />
    ))
  }

  private openRenameProject = (project: Project) => {
    const { addModal } = this.props

    addModal('open rename project', ({ handleClose }) => (
      <RenameProject
        project={project}
        handleComplete={handleClose}
        saveProjectTitle={this.saveProjectTitle}
      />
    ))
  }

  private openExporter = (
    format: ExportFormat,
    closeOnSuccess: boolean = true
  ) => {
    const { addModal, match, project } = this.props

    const { submission } = this.state

    addModal('exporter', ({ handleClose }) => (
      <Exporter
        format={format}
        getAttachment={this.collection.getAttachmentAsBlob}
        handleComplete={async (success: boolean) => {
          const { submission } = this.state

          if (submission) {
            if (success) {
              await this.saveModel<Submission>(submission)
            }

            this.setState({ submission: undefined })
          }

          handleClose()
        }}
        modelMap={this.state.modelMap!}
        manuscriptID={match.params.manuscriptID}
        project={project}
        closeOnSuccess={closeOnSuccess}
        submission={submission}
      />
    ))
  }

  private openImporter = () => {
    const { addModal } = this.props

    addModal('importer', ({ handleClose }) => (
      <Importer
        handleComplete={handleClose}
        importManuscript={this.importManuscript}
      />
    ))
  }

  private importManuscript = async (models: Model[], redirect = true) => {
    const { projectID } = this.props.match.params

    const manuscript = models.find(isManuscript)

    if (!manuscript) {
      throw new Error('No manuscript found')
    }

    manuscript.priority = await nextManuscriptPriority(
      this.collection as Collection<Manuscript>
    )

    // TODO: use the imported filename?
    if (!manuscript.pageLayout) {
      const {
        bundles,
        contributorRoles,
        styles,
        statusLabels,
      } = await importBundledData()

      const bundle = createNewBundle(
        manuscript.bundle || DEFAULT_BUNDLE,
        bundles
      )
      manuscript.bundle = bundle._id
      models.push(bundle)

      const parentBundle = createParentBundle(bundle, bundles)
      if (parentBundle) {
        models.push(parentBundle)
      }

      models.push(...contributorRoles.values())
      models.push(...statusLabels.values())
      models.push(...styles.values())

      const pageLayout = updatedPageLayout(styles)
      manuscript.pageLayout = pageLayout._id
      models.push(pageLayout)

      // TODO: apply a template?
    }

    // TODO: save dependencies first, then the manuscript
    // TODO: handle multiple manuscripts in a project bundle

    const items = models.map(model => ({
      ...model,
      containerID: projectID,
      manuscriptID: isManuscriptModel(model) ? manuscript._id : undefined,
    }))

    await this.collection.bulkCreate(items)

    try {
      const bundles = models.filter(hasObjectType<Bundle>(ObjectTypes.Bundle))

      for (const bundle of bundles) {
        await attachStyle(bundle, this.collection as Collection<ContainedModel>)
      }
    } catch (error) {
      console.log(error) // tslint:disable-line:no-console
    }

    if (redirect) {
      this.props.history.push(
        `/projects/${projectID}/manuscripts/${manuscript._id}`
      )
    }
  }

  private createCitationProcessor = async (
    manuscript: Manuscript,
    modelMap: Map<string, Model>
  ) => {
    const bundleID = manuscript.bundle || DEFAULT_BUNDLE
    const bundle = modelMap.get(bundleID) as Bundle | undefined

    const citationStyleData = bundle
      ? await this.collection.getAttachmentAsString(bundle._id, 'csl')
      : undefined

    // TODO: move defaults into method?
    const processor = await createProcessor(
      manuscript.primaryLanguageCode || 'en-GB',
      this.getLibraryItem,
      { bundleID, bundle, citationStyleData }
    )

    this.setState({ processor })
  }

  private getCitationProcessor: GetCitationProcessor = () => {
    return this.state.processor as CiteProc.Engine
  }

  private loadModels = (containerID: string, manuscriptID: string) =>
    this.collection
      .find({
        $and: [
          {
            containerID,
          },
          {
            $or: [
              {
                manuscriptID,
              },
              {
                manuscriptID: {
                  $exists: false,
                },
              },
            ],
          },
        ],
      })
      .exec()

  private setLibraryItem = (item: BibliographyItem) =>
    this.props.library.set(item._id, item) // TODO: move this to the provider?

  private getLibraryItem = (id: string) => this.props.library.get(id)!

  private filterLibraryItems = (query: string) =>
    filterLibrary(this.props.library, query)

  private matchLibraryItemByIdentifier = (
    item: BibliographyItem
  ): BibliographyItem | undefined => {
    const { library } = this.props

    return matchLibraryItemByIdentifier(item, library)
  }

  // ensure that the native app receives a synchronous response
  // while the citation insertion continues in the background
  private insertNativeCitationSync = (
    encodedData: string,
    type: string,
    insert: boolean = false,
    batchId?: string
  ): true => {
    this.insertNativeCitation(encodedData, type, insert)
      .then(imported => {
        if (batchId) {
          postWebkitMessage('taskCallback', {
            batchId,
            imported,
            success: true,
          })
        }
      })
      .catch(error => {
        console.error(error) // tslint:disable-line:no-console

        if (batchId) {
          postWebkitMessage('taskCallback', {
            batchId,
            success: false,
            error: error.message,
          })
        }
      })

    return true
  }

  private insertNativeCitation = async (
    encodedData: string,
    type: string,
    insert: boolean
  ): Promise<number> => {
    const data = window.atob(encodedData)

    const items: Array<Partial<BibliographyItem>> = await transformBibliography(
      data,
      type
    )

    const newItems: BibliographyItem[] = []
    const itemsToCite: BibliographyItem[] = []

    for (const item of items) {
      const existingItem = this.matchLibraryItemByIdentifier(
        item as BibliographyItem
      )

      if (existingItem) {
        itemsToCite.push(existingItem)
      } else {
        const model = buildBibliographyItem(item) as BibliographyItem

        // add the item to the library model map so it's definitely available
        this.setLibraryItem(model)

        newItems.push(model)
        itemsToCite.push(model)
      }
    }

    if (newItems.length) {
      const { projectID } = this.props.match.params

      const containedItems = newItems.map(model => ({
        ...model,
        containerID: projectID,
      }))

      await this.collection.bulkCreate(containedItems)
    }

    if (insert) {
      const { view } = this.state

      if (view && canInsert(schema.nodes.citation)) {
        const { selection } = view.state // old state

        insertInlineCitation(
          view.state,
          view.dispatch,
          view,
          itemsToCite.map(item => item._id)
        )

        const { tr } = view.state // new state

        // restore the selection (close the citation popover)
        view.dispatch(tr.setSelection(selection.map(tr.doc, tr.mapping)))
      }
    }

    return newItems.length
  }

  private getModel = <T extends Model>(id: string): T | undefined =>
    this.state.modelMap!.get(id) as T | undefined

  private saveModel = async <T extends Model>(
    model: T | Build<T> | Partial<T>
  ): Promise<T> => {
    const { manuscriptID, projectID } = this.props.match.params

    if (!model._id) {
      throw new Error('Model ID required')
    }

    const containedModel = model as T & ContainedProps

    // NOTE: this is needed because the local state is updated before saving
    const containerIDs: ContainerIDs = {
      containerID: projectID,
    }

    if (isManuscriptModel(containedModel)) {
      containerIDs.manuscriptID = manuscriptID
    }

    // NOTE: can't set a partial here
    this.setState({
      modelMap: this.state.modelMap!.set(containedModel._id, {
        ...containedModel,
        ...containerIDs,
      }),
    })

    const { src: _src, attachment, ...data } = containedModel as T &
      ContainedProps &
      ModelAttachment

    // TODO: data.contents = serialized DOM wrapper for bibliography

    const result = await this.collection.save(
      data as Partial<ManuscriptModel>,
      containerIDs
    )

    if (attachment) {
      await this.collection.putAttachment(result._id, attachment)
    }

    return result as T
  }

  private deleteModel = (id: string) => {
    if (id.startsWith('MPProject:')) {
      return this.props.projectsCollection.delete(id)
    }

    this.optimisticDelete(id)

    return this.collection.delete(id)
  }

  private optimisticDelete = (id: string) => {
    const { modelMap } = this.state

    if (modelMap!.delete(id)) {
      this.setState({ modelMap })
    }
  }

  // NOTE: can only _return_ the boolean value when using "onbeforeunload"!
  private unloadListener: EventListener = (event: Event) => {
    if (this.state.dirty) {
      event.returnValue = true // can only be set to a boolean
    }
  }

  private isRelevantUpdate = (
    v: Model,
    projectID: string,
    manuscriptID: string,
    sessionID: string
  ) => {
    // ignore changes to local documents
    if (v._id.startsWith('_local/')) {
      return false
    }

    // ignore changes to other projects
    if ((v as ContainedModel).containerID !== projectID) {
      return false
    }

    // ignore changes to other manuscripts
    if (
      (v as ManuscriptModel).manuscriptID &&
      (v as ManuscriptModel).manuscriptID !== manuscriptID
    ) {
      return false
    }

    // only use updates from other sessions
    return v.sessionID !== sessionID
  }

  private processConflictingUpdate = (
    model: Model,
    modelDocument: RxDocument<Model>
  ) => {
    const { conflictManager, conflicts } = this.state

    const decoder = new Decoder(new Map()) // TODO: modelMap?

    return conflictManager!.processConflictingUpdate(
      model,
      modelDocument,
      conflicts!,
      decoder.decode
    )
  }

  private handleSubscribe = (receive: ChangeReceiver) => {
    const { projectID, manuscriptID } = this.props.match.params

    this.forceEditorUpdate = (parent, blocksToUpdate: string[]) => {
      const { modelMap } = this.state
      const decoder = new Decoder(modelMap!)
      const items = blocksToUpdate
        .map(block => {
          const model = modelMap!.get(block)
          return model ? decoder.decode(model) : null
        })
        .filter(Boolean) as ManuscriptNode[]
      receive('ORDER_CHILD_SECTIONS', parent || undefined, null, {
        childSections: items,
      })
    }

    const sub = this.collection
      .getCollection()
      .$.subscribe(async changeEvent => {
        const op = changeEvent.data.op
        const doc = changeEvent.data.doc
        const v = changeEvent.data.v as Model

        if (!(v && doc && op)) {
          throw new Error('Unexpected change event data')
        }

        console.log({ op, doc, v }) // tslint:disable-line:no-console

        // TODO: only subscribe to changes to this project/manuscript?
        if (!this.isRelevantUpdate(v, projectID, manuscriptID, sessionID)) {
          return false
        }

        if (op === 'REMOVE') {
          const { modelMap } = this.state
          modelMap!.delete(doc)
          return receive(op, doc)
        }

        // NOTE: need to load the doc to get attachments
        const modelDocument = await this.collection.findOne(doc).exec()

        if (!modelDocument) {
          return null
        }

        const model = modelDocument.toJSON()

        if (isFigure(model)) {
          model.src = await getAttachment(modelDocument, 'image')
        } else if (isUserProfile(model)) {
          ;(model as UserProfileWithAvatar).avatar = await getAttachment(
            modelDocument,
            PROFILE_IMAGE_ATTACHMENT
          )
        }

        try {
          const {
            updatedConflicts,
            updatedNode,
          } = await this.processConflictingUpdate(model, modelDocument)

          if (updatedConflicts) {
            const { view } = this.state

            // send remaining/updated conflict state to editor plugin
            if (view) {
              view.dispatch(
                view.state.tr.setMeta(conflictsKey, updatedConflicts)
              )
            }
          }

          if (updatedNode) {
            receive(op, doc, updatedNode)
            return
          }
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.warn(`Could not resolve conflict for ${model._id}`, e)
        }

        const { modelMap } = this.state
        if (!modelMap) return

        if (isTreeChange(model, modelMap)) {
          this.treeChangeQueue(modelMap)
        }

        modelMap.set(model._id, model) // TODO: what if this overlaps with saving?

        this.setState({ modelMap })

        // TODO: only call receive once finished syncing?

        // TODO: might not need a new decoder, for data models

        // TODO: set updatedAt on nodes that depend on data models?

        const decoder = new Decoder(modelMap)

        try {
          const node = decoder.decode(model)

          receive(op, doc, node)
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.warn(e)
        }
      })

    this.subs.push(sub)
  }

  private handleTreeChanges = (changes: TreeChanges) => {
    changes.forEach(({ parent, children }) => {
      this.forceEditorUpdate(parent, children)
    })
  }

  private removedModelIds = (
    modelIds: Set<string>,
    newModelIds: Set<string>
  ): string[] =>
    Array.from(modelIds).filter(id => {
      return !newModelIds.has(id)
    })

  private keysForComparison = (model: ModelObject) => {
    const excludedKeys = [
      'id',
      '_id',
      '_rev',
      '_revisions',
      'sessionID',
      'createdAt',
      'updatedAt',
      'owners',
      'manuscriptID',
      'containerID',
      'src',
      ...this.requirementFields,
    ]

    return Object.keys(model).filter(key => !excludedKeys.includes(key))
  }

  private hasChanged = (model: ModelObject): boolean => {
    const previousModel = this.getModel(model._id) as ModelObject

    // TODO: return false if the previous model was a placeholder element?

    if (!previousModel) return true

    const modelKeys = this.keysForComparison(model)
    const previousModelKeys = this.keysForComparison(previousModel)

    // look for different keys
    if (
      modelKeys.length !== new Set([...modelKeys, ...previousModelKeys]).size
    ) {
      return true
    }

    // look for changed values
    for (const key of modelKeys) {
      if (JSON.stringify(model[key]) !== JSON.stringify(previousModel[key])) {
        return true
      }
    }

    return false
  }

  private handleTitleEditorStateChange = (state: TitleEditorState) => {
    this.setState({
      selected: null,
    })

    if (config.native && this.state.activeEditor) {
      window.dispatchToolbarAction = createDispatchTitleToolbarAction(
        this.state.activeEditor.view as TitleEditorView
      )

      postWebkitMessage('toolbar', {
        title: {
          toolbar: titleToolbarState(state),
        },
      })
    }
  }

  private handleManuscriptEditorStateChange = (
    state: ManuscriptEditorState,
    docChanged: boolean
  ) => {
    const selected = findParentNodeWithIdValue(state.selection) || null
    const selectedSection = findParentSection(state.selection)
    const selectedElement = findParentElement(state.selection)

    this.setState(prevState => ({
      ...prevState,
      dirty: prevState.dirty || docChanged,
      doc: state.doc as ActualManuscriptNode,
      selected,
      selectedSection,
      selectedElement,
    }))

    if (docChanged) {
      this.debouncedSaveModels(state)
    }

    if (config.native && this.state.activeEditor) {
      const { view } = this.state.activeEditor

      window.dispatchToolbarAction = createDispatchManuscriptToolbarAction(
        view as ManuscriptEditorView
      )

      const menus = this.buildMenus(true)

      window.dispatchMenuAction = createDispatchMenuAction(
        view as ManuscriptEditorView,
        menus
      )

      window.getMenuState = createGetMenuState(
        view as ManuscriptEditorView,
        menus
      )

      postWebkitMessage('toolbar', {
        manuscript: {
          toolbar: manuscriptToolbarState(state),
        },
      })
    }
  }

  private buildManuscriptModelIds = (modelMap: Map<string, Model>) => {
    const output: { [key: string]: Set<string> } = {
      document: new Set(),
      data: new Set(),
    }

    for (const model of modelMap.values()) {
      if (isManuscriptModel(model)) {
        const type = documentObjectTypes.includes(
          model.objectType as ObjectTypes
        )
          ? 'document'
          : 'data'

        output[type].add(model._id)
      }
    }

    return output
  }

  private copyRequirements = <T extends Model>(model: T) => {
    const previousModel = this.getModel<T>(model._id)

    if (!previousModel) {
      return
    }

    for (const field of this.requirementFields as Array<keyof T>) {
      model[field] = previousModel[field]
    }
  }

  private copySrc = (model: Figure) => {
    const previousModel = this.getModel<Figure>(model._id)

    if (!previousModel) {
      return
    }

    model.src = previousModel.src
  }

  private saveModels = async (state: ManuscriptEditorState) => {
    // TODO: return/queue if already saving?
    const { manuscriptID, projectID } = this.props.match.params

    // NOTE: can't use state.toJSON() as the HTML serializer needs the actual nodes

    const encodedModelMap = encode(state.doc)

    try {
      // save the changed doc models
      // TODO: make sure dependencies are saved first

      const { modelMap } = this.state

      const changedModels = []

      for (const model of encodedModelMap.values()) {
        if (this.hasChanged(model)) {
          changedModels.push(model)

          if (isManuscript(model)) {
            this.copyRequirements<Manuscript>(model)
          } else if (isSection(model)) {
            this.copyRequirements<Section>(model)
          } else if (isFigure(model)) {
            this.copySrc(model)
          }

          modelMap!.set(model._id, model)
        }
      }

      interface ChangedModelsByType {
        dependencies: Model[]
        elements: Model[]
        sections: Model[]
      }

      const changedModelsObject: ChangedModelsByType = {
        dependencies: [],
        elements: [],
        sections: [],
      }

      const changedModelsByType = changedModels.reduce((output, model) => {
        if (model.objectType === ObjectTypes.Section) {
          output.sections.push(model)
        } else if (elementObjects.includes(model.objectType as ObjectTypes)) {
          output.elements.push(model)
        } else {
          output.dependencies.push(model)
        }

        return output
      }, changedModelsObject)

      const saveChangedModel = (model: Model) => {
        const containerIDs: ContainerIDs = {
          containerID: projectID,
        }

        if (isManuscriptModel(model)) {
          containerIDs.manuscriptID = manuscriptID
        }

        // TODO: use collection.create or collection.update as appropriate?
        return this.collection.save(model, containerIDs)
      }

      await Promise.all(changedModelsByType.dependencies.map(saveChangedModel))

      await Promise.all(changedModelsByType.elements.map(saveChangedModel))

      await Promise.all(changedModelsByType.sections.map(saveChangedModel))

      // delete any removed models, children first

      const modelIds = this.buildManuscriptModelIds(encodedModelMap)

      const deleteRemovedModelIds = async (type: 'document' | 'data') => {
        const removedModelIds = this.removedModelIds(
          this.state.modelIds[type],
          modelIds[type]
        )

        // NOTE: reversed, to remove children first
        await Promise.all(
          removedModelIds.reverse().map(id =>
            this.collection.delete(id).catch(error => {
              console.error(error) // tslint:disable-line:no-console
            })
          )
        )

        removedModelIds.map(id => {
          modelMap!.delete(id)
        })
      }

      await deleteRemovedModelIds('document')
      await deleteRemovedModelIds('data')

      this.setState({
        modelIds,
        modelMap, // NOTE: not using encodedModelMap, to keep removed models
        dirty: false,
        // doc: state.doc,
      })

      // reset the the treeChangeQueue to the latest modelMap
      this.treeChangeQueue = createTreeChangeQueue(
        modelMap!,
        this.handleTreeChanges
      )

      console.log('saved') // tslint:disable-line:no-console
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
    }
  }

  private handleConflicts = async (conflicts: LocalConflicts) => {
    const { conflictManager, view } = this.state

    if (!view) {
      throw new Error('EditorView not initialized')
    }

    const decoder = new Decoder(new Map()) // TODO: modelMap?

    const updatedConflicts = conflictManager!.updateConflicts(
      conflicts,
      view.state.doc,
      decoder.decode as (model: Model) => ManuscriptNode // TODO: update types then remove this
    )

    // send remaining/updated conflict state to editor plugin
    view.dispatch(view.state.tr.setMeta(conflictsKey, updatedConflicts))
  }

  private buildMenus = (includeEditorMenus = false): MenuItem[] => {
    const { manuscript, project } = this.props
    const { view } = this.state

    const projectMenu = buildProjectMenu({
      manuscript,
      project,
      addManuscript: this.addManuscript,
      openTemplateSelector: this.openTemplateSelector,
      deleteManuscript: this.deleteManuscript,
      deleteModel: this.deleteModel,
      history: this.props.history,
      openExporter: this.openExporter,
      openImporter: this.openImporter,
      openRenameProject: this.openRenameProject,
      getRecentProjects: this.getRecentProjects,
      publishTemplate: this.publishTemplate,
      submitToReview: this.showPreflightDialog,
    })

    const menus: MenuItem[] = [projectMenu]

    return includeEditorMenus || (view && view.hasFocus())
      ? menus.concat(editorMenus)
      : menus
  }

  private getCurrentUser = (): UserProfile => this.props.user

  private listCollaborators = (): UserProfile[] =>
    Array.from(this.props.collaborators.values())

  private getKeyword = (id: string) => this.props.keywords.get(id)

  private listKeywords = (): Keyword[] =>
    Array.from(this.props.keywords.values())

  private createKeyword = (name: string) => this.saveModel(buildKeyword(name))

  private getCollaborator = (id: string) => this.props.collaborators.get(id)
  private getCollaboratorById = (id: string) =>
    this.props.collaboratorsById.get(id)

  private renderReactComponent = (
    child: React.ReactChild,
    container: HTMLElement
  ) => {
    const { history, location, match } = this.props

    ReactDOM.render(
      <IntlProvider>
        <ThemeProvider>
          <NotificationProvider
            history={history}
            location={location}
            match={match}
          >
            {child}
          </NotificationProvider>
        </ThemeProvider>
      </IntlProvider>,
      container
    )
  }

  private unmountReactComponent = (container: HTMLElement) => {
    ReactDOM.unmountComponentAtNode(container)
  }

  private setCommentTarget = (commentTarget?: string) => {
    this.setState({ commentTarget })
  }

  private publishTemplate = async () => {
    const { manuscript, project } = this.props
    const { modelMap } = this.state

    if (!modelMap) {
      throw new Error('Not ready')
    }

    if (!manuscript.title) {
      throw new Error('The template must have a title')
    }

    // remove any existing template and associated models
    if (manuscript.prototype) {
      const existingTemplate = await this.collection
        .findOne(manuscript.prototype)
        .exec()

      if (existingTemplate) {
        const existingTemplateItems = await this.collection
          .find({
            templateID: existingTemplate._id,
          })
          .exec()

        for (const existingTemplateItem of existingTemplateItems) {
          // TODO: set _deleted: true via bulkDocs?
          await this.collection.delete(existingTemplateItem._id)
        }

        await this.collection.delete(existingTemplate._id)
      }
    }

    // create a new template
    const template: Build<ManuscriptTemplate> = {
      // ...manuscript, // TODO: copy manuscript properties?
      _id: generateID(ObjectTypes.ManuscriptTemplate),
      objectType: ObjectTypes.ManuscriptTemplate,
      title: manuscript.title,
    }

    // build the new template models
    const templateModels = buildTemplateModels(manuscript, template, modelMap)

    // set the new bundle
    if (manuscript.bundle) {
      const bundle = modelMap.get(manuscript.bundle) as Bundle | undefined

      if (bundle) {
        template.bundle = bundle.prototype // should be the id of a built-in bundle
      }
    }

    // save the new template models
    await this.collection.bulkCreate(
      templateModels.map(model => ({
        ...model,
        containerID: project._id,
        manuscriptID: manuscript._id,
        templateID: template._id,
      }))
    )

    // save the template
    ;(template as ManuscriptTemplate).containerID = project._id
    await this.collection.save(template)

    // update the manuscript
    await this.collection.update(manuscript._id, {
      prototype: template._id,
    })

    // update the project
    await this.props.projectsCollection.update(project._id, {
      templateContainer: true,
    })

    this.props.addModal('success', ({ handleClose }) => (
      <SuccessModal
        status={'Template published successfully'}
        handleDone={handleClose}
      />
    ))
  }

  private findManuscriptTemplate = (): ManuscriptTemplate | undefined => {
    const { modelMap } = this.state

    const [template] = getModelsByType<ManuscriptTemplate>(
      modelMap!,
      ObjectTypes.ManuscriptTemplate
    )

    return template
  }

  private buildTemplateISSNs = () => {
    const issns: string[] = []

    const template = this.findManuscriptTemplate()

    if (template) {
      if (template.eISSNs) {
        for (const issn of template.eISSNs) {
          issns.push(issn)
        }
      }

      if (template.ISSNs) {
        for (const issn of template.ISSNs) {
          issns.push(issn)
        }
      }
    }

    return issns
  }

  private buildBundleISSNs = (manuscript: Manuscript) => {
    const issns: string[] = []

    const bundle = manuscript.bundle
      ? this.getModel<Bundle>(manuscript.bundle)
      : undefined

    if (bundle && bundle.csl) {
      if (bundle.csl.eISSNs) {
        for (const issn of bundle.csl.eISSNs) {
          issns.push(issn)
        }
      }

      if (bundle.csl.ISSNs) {
        for (const issn of bundle.csl.ISSNs) {
          issns.push(issn)
        }
      }
    }

    return issns
  }

  private submitToReview = async (submission: Submission) => {
    this.setState({ submission }, () => {
      this.openExporter('submission-for-review', false)
    })
  }

  private showPreflightDialog = async () => {
    const { addModal, manuscript } = this.props
    const { doc, modelMap } = this.state

    if (!doc || !modelMap) {
      throw new Error()
    }

    const templateISSNS = this.buildTemplateISSNs()

    const issns = templateISSNS.length
      ? templateISSNS
      : this.buildBundleISSNs(manuscript)

    const targetJournals = await loadTargetJournals().then(targetJournals =>
      targetJournals.length
        ? targetJournals
        : JSON.parse(window.localStorage.getItem('targetJournals') || '[]')
    )

    addModal('template-selector', ({ handleClose }) => (
      <RequirementsProvider modelMap={modelMap}>
        <PreflightDialog
          doc={doc}
          handleClose={handleClose}
          handleConfirm={(submission: Submission) => {
            handleClose()
            return this.submitToReview(submission)
          }}
          issns={issns}
          targetJournals={targetJournals}
          manuscript={manuscript}
        />
      </RequirementsProvider>
    ))
  }
}

export default withModal(withIntl(ManuscriptPageContainer))
