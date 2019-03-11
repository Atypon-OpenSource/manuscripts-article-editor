/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ApplicationMenu,
  ChangeReceiver,
  CitationManager,
  Editor,
  findParentNodeWithIdValue,
  MenuItem,
  menus as editorMenus,
  PopperManager,
} from '@manuscripts/manuscript-editor'
import '@manuscripts/manuscript-editor/styles/Editor.css'
import '@manuscripts/manuscript-editor/styles/popper.css'
import {
  Build,
  buildContributor,
  buildKeyword,
  buildManuscript,
  buildModelMap,
  CommentAnnotation,
  ContainedModel,
  ContainedProps,
  Decoder,
  DEFAULT_BUNDLE,
  documentObjectTypes,
  elementObjects,
  encode,
  getImageAttachment,
  isFigure,
  isManuscriptModel,
  isUserProfile,
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptModel,
  ManuscriptNode,
  ManuscriptPlugin,
  ModelAttachment,
  Selected,
  timestamp,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Keyword,
  Manuscript,
  Model,
  ObjectTypes,
  Project,
  UserProfile,
  UserProject,
} from '@manuscripts/manuscripts-json-schema'
import {
  ConflictManager,
  conflictsKey,
  LocalConflicts,
  plugins as syncPlugins,
  SYNC_ERROR_LOCAL_DOC_ID,
  SyncErrors,
  syncErrorsKey,
} from '@manuscripts/sync-client'
import CiteProc from 'citeproc'
import debounce from 'lodash-es/debounce'
import React from 'react'
import ReactDOM from 'react-dom'
import { Prompt, RouteComponentProps } from 'react-router'
import { RxDocument } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import config from '../../config'
import deviceId from '../../lib/device-id'
import { filterLibrary } from '../../lib/library'
import { isManuscript, nextManuscriptPriority } from '../../lib/manuscript'
import { buildProjectMenu } from '../../lib/project-menu'
import { ContributorRole } from '../../lib/roles'
import sessionID from '../../lib/session-id'
import {
  buildRecentProjects,
  buildUserProject,
  RecentProject,
} from '../../lib/user-project'
import { Collection, ContainerIDs } from '../../sync/Collection'
import CollectionManager from '../../sync/CollectionManager'
// import { newestFirst, oldestFirst } from '../../lib/sort'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { DebouncedInspector } from '../Inspector'
import IntlProvider, { IntlProps, withIntl } from '../IntlProvider'
import CitationEditor from '../library/CitationEditor'
import MetadataContainer from '../metadata/MetadataContainer'
import { ModalProps, withModal } from '../ModalProvider'
import { Main } from '../Page'
import Panel from '../Panel'
import { ManuscriptPlaceholder } from '../Placeholders'
import TemplateSelector from '../templates/TemplateSelector'
import { CommentList } from './CommentList'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
  EditorHeader,
} from './EditorContainer'
import { Exporter } from './Exporter'
import { Importer } from './Importer'
import {
  EditorType,
  EditorViewType,
  ManuscriptPageToolbar,
} from './ManuscriptPageToolbar'
import ManuscriptSidebar from './ManuscriptSidebar'
import { ReloadDialog } from './ReloadDialog'
import RenameProject from './RenameProject'

interface ModelObject {
  // [key: string]: ModelObject[keyof ModelObject]
  [key: string]: any // tslint:disable-line:no-any
}

interface State {
  conflictManager?: ConflictManager
  conflicts: LocalConflicts | null
  dirty: boolean
  doc?: ManuscriptNode
  error?: string
  manuscript: Manuscript
  modelIds: {
    [key: string]: Set<string>
  }
  modelMap?: Map<string, Model>
  plugins?: ManuscriptPlugin[]
  popper: PopperManager
  processor?: CiteProc.Engine
  selected: Selected | null
  view?: ManuscriptEditorView
  activeEditor?: {
    editor: string
    view: EditorViewType
  }
}

interface Props {
  comments: CommentAnnotation[]
  keywords: Map<string, Keyword>
  library: Map<string, BibliographyItem>
  manuscripts: Manuscript[]
  manuscript: Manuscript
  project: Project
  projects: Project[]
  user: UserProfileWithAvatar
  collaborators: Map<string, UserProfileWithAvatar>
  projectsCollection: Collection<Project>
  userProjects: UserProject[]
  userProjectsCollection: Collection<UserProject>
}

interface RouteParams {
  projectID: string
  manuscriptID: string
}

type CombinedProps = Props &
  RouteComponentProps<RouteParams> &
  IntlProps &
  ModalProps

class ManuscriptPageContainer extends React.Component<CombinedProps, State> {
  private readonly initialState: Readonly<State>

  private subs: Subscription[] = []

  private collection: Collection<Model>

  private readonly debouncedSaveModels: (state: ManuscriptEditorState) => void

  public constructor(props: CombinedProps) {
    super(props)

    this.state = {
      conflicts: null,
      dirty: false,
      doc: undefined,
      error: undefined,
      manuscript: props.manuscript,
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

    await this.prepare(projectID, manuscriptID)
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
    } = this.state

    const { comments, manuscripts, manuscript, project, user } = this.props

    if (error) {
      return <ReloadDialog message={error} />
    }

    if (!doc || !manuscript || !project || !comments || !plugins) {
      return <ManuscriptPlaceholder />
    }

    const locale = this.getLocale(manuscript)

    const attributes = {
      class: 'manuscript-editor',
      dir: locale === 'ar' ? 'rtl' : 'ltr', // TODO: remove hard-coded locale
      lang: locale,
      spellcheck: 'true',
      tabindex: '2',
    }

    const collection = this.collection.getCollection()

    return (
      <>
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
        />

        <Main>
          <EditorContainer>
            <EditorContainerInner>
              {view && !config.native && (
                <EditorHeader>
                  <ApplicationMenu menus={this.buildMenus()} view={view} />

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
                  collection={collection}
                  modelMap={modelMap!}
                  saveManuscript={this.saveManuscript}
                  manuscript={manuscript}
                  saveModel={this.saveModel}
                  deleteModel={this.deleteModel}
                  handleTitleStateChange={this.handleEditorStateChange(
                    EditorType.title
                  )}
                />

                <Editor
                  autoFocus={!!manuscript.title}
                  getCitationProcessor={this.getCitationProcessor}
                  doc={doc}
                  editable={true}
                  getModel={this.getModel}
                  saveModel={this.saveModel}
                  deleteModel={this.deleteModel}
                  allAttachments={this.collection.allAttachments}
                  putAttachment={this.collection.putAttachment}
                  removeAttachment={this.collection.removeAttachment}
                  addLibraryItem={this.addLibraryItem}
                  getLibraryItem={this.getLibraryItem}
                  filterLibraryItems={this.filterLibraryItems}
                  getManuscript={this.getManuscript}
                  saveManuscript={this.saveManuscript}
                  deleteManuscript={this.deleteManuscript}
                  getCurrentUser={this.getCurrentUser}
                  history={this.props.history}
                  locale={locale}
                  manuscript={manuscript}
                  modelMap={modelMap!}
                  plugins={plugins}
                  popper={popper}
                  projectID={projectID}
                  subscribe={this.handleSubscribe}
                  setView={this.setView}
                  attributes={attributes}
                  retrySync={this.retrySync}
                  renderReactComponent={this.renderReactComponent}
                  handleStateChange={this.handleEditorStateChange(
                    EditorType.manuscript
                  )}
                  CitationEditor={CitationEditor}
                />
              </EditorBody>
            </EditorContainerInner>
          </EditorContainer>

          <Prompt when={dirty} message={() => false} />
        </Main>

        <Panel
          name={'inspector'}
          minSize={200}
          direction={'row'}
          side={'start'}
        >
          {this.state.view && comments && (
            <DebouncedInspector>
              <CommentList
                comments={comments}
                doc={doc}
                getCurrentUser={this.getCurrentUser}
                selected={selected}
                createKeyword={this.createKeyword}
                deleteComment={this.deleteModel}
                getCollaborator={this.getCollaborator}
                getKeyword={this.getKeyword}
                listCollaborators={this.listCollaborators}
                listKeywords={this.listKeywords}
                saveComment={this.saveModel}
              />
            </DebouncedInspector>
          )}
        </Panel>
      </>
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

      default:
        this.setState({
          selected: null,
        })
        break
    }
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

      try {
        await this.createCitationProcessor(this.props.manuscript)
      } catch (error) {
        console.error(error) // tslint:disable-line:no-console
        throw new Error(
          'Failed to open project for editing due to the citation processor failing to start.'
        )
      }

      const models = await this.loadModels(projectID, manuscriptID)

      // console.log(models.map(doc => [doc.objectType, doc.toJSON()]))

      if (!models.length) {
        throw new Error(
          'Failed to open project for editing due to missing data.'
        )
      }

      const modelMap = await buildModelMap(models)

      const decoder = new Decoder(modelMap)

      try {
        const doc = decoder.createArticleNode()
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

      await this.saveUserProject(projectID, manuscriptID)
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
      this.setState({
        error: error.message,
      })
    }
  }

  private setView = (view: ManuscriptEditorView) => {
    this.setState({ view })

    this.subscribeToConflicts().catch(err => {
      throw err
    })

    this.subscribeToSyncErrors().catch(err => {
      throw err
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

  private getManuscript = () => this.state.manuscript

  private saveManuscript = async (data: Partial<Manuscript>) => {
    const previousManuscript = this.state.manuscript

    const manuscript = {
      ...previousManuscript,
      ...data,
    }

    this.setState({ manuscript })

    await this.saveModel(manuscript)

    if (this.shouldUpdateCitationProcessor(manuscript, previousManuscript)) {
      await this.createCitationProcessor(manuscript)

      this.dispatchUpdate()
    }
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

    return buildRecentProjects(projectID, userProjects, projects, deviceId)
  }

  private dispatchUpdate = () => {
    const { view } = this.state

    if (view) {
      view.dispatch(view.state.tr.setMeta('update', true))
    }
  }

  private addManuscript = async () => {
    const { user } = this.props
    const { projectID } = this.props.match.params

    const manuscript = buildManuscript()
    const manuscriptID = manuscript._id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
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

  private openTemplateSelector = () => {
    const { addModal, project, user } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        projectID={project._id}
        user={user}
        handleComplete={handleClose}
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

  private openExporter = (format: string) => {
    const { addModal, match, project } = this.props

    addModal('exporter', ({ handleClose }) => (
      <Exporter
        format={format}
        handleComplete={handleClose}
        modelMap={this.state.modelMap!}
        manuscriptID={match.params.manuscriptID}
        project={project}
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

  private importManuscript = async (models: Model[]) => {
    const { projectID } = this.props.match.params

    const manuscript = models.find(isManuscript)

    if (!manuscript) {
      throw new Error('No manuscript found')
    }

    manuscript.priority = await nextManuscriptPriority(this
      .collection as Collection<Manuscript>)

    // TODO: save dependencies first, then the manuscript
    // TODO: handle multiple manuscripts in a project bundle

    const items = models.map(model => ({
      ...model,
      containerID: projectID,
      manuscriptID: isManuscriptModel(model) ? manuscript._id : undefined,
    }))

    await this.collection.bulkCreate(items)

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscript._id}`
    )
  }

  private createCitationProcessor = async (manuscript: Manuscript) => {
    const citationManager = new CitationManager(config.data.url)

    // TODO: move defaults into method?
    const processor = await citationManager.createProcessor(
      manuscript.bundle || DEFAULT_BUNDLE,
      manuscript.primaryLanguageCode || 'en-GB',
      this.getLibraryItem
    )

    this.setState({ processor })
  }

  private getCitationProcessor = () => {
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

  private addLibraryItem = (item: BibliographyItem) =>
    this.props.library.set(item._id, item) // TODO: move this to the provider?

  private getLibraryItem = (id: string) => this.props.library.get(id)!

  private filterLibraryItems = (query: string) =>
    filterLibrary(this.props.library, query)

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
          return receive(op, doc)
        }

        // NOTE: need to load the doc to get attachments
        const modelDocument = await this.collection.findOne(doc).exec()

        if (!modelDocument) {
          return null
        }

        const model = modelDocument.toJSON()

        if (isFigure(model)) {
          model.src = await getImageAttachment(modelDocument)
        } else if (isUserProfile(model)) {
          ;(model as UserProfileWithAvatar).avatar = await getImageAttachment(
            modelDocument
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

        modelMap!.set(model._id, model) // TODO: what if this overlaps with saving?

        this.setState({ modelMap })

        // TODO: only call receive once finished syncing?

        // TODO: might not need a new decoder, for data models

        // TODO: set updatedAt on nodes that depend on data models?

        const decoder = new Decoder(modelMap!)

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

  private handleManuscriptEditorStateChange = (
    state: ManuscriptEditorState,
    docChanged: boolean
  ) => {
    const selected = findParentNodeWithIdValue(state.selection) || null

    this.setState(prevState => ({
      ...prevState,
      dirty: prevState.dirty || docChanged,
      doc: state.doc,
      selected,
    }))

    if (docChanged) {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => this.debouncedSaveModels(state), {
          timeout: 5000, // maximum wait for idle
        })
      } else {
        this.debouncedSaveModels(state)
      }
    }
  }

  private buildManuscriptModelIds = (modelMap: Map<string, Model>) => {
    const output = {
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
      decoder.decode
    )

    // send remaining/updated conflict state to editor plugin
    view.dispatch(view.state.tr.setMeta(conflictsKey, updatedConflicts))
  }

  private buildMenus = (): MenuItem[] => {
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
    })

    const menus: MenuItem[] = [projectMenu]

    return view && view.hasFocus() ? menus.concat(editorMenus) : menus
  }

  private getCurrentUser = (): UserProfile => this.props.user

  private listCollaborators = (): UserProfileWithAvatar[] =>
    Array.from(this.props.collaborators.values())

  private getKeyword = (id: string) => this.props.keywords.get(id)

  private listKeywords = (): Keyword[] =>
    Array.from(this.props.keywords.values())

  private createKeyword = (name: string) => this.saveModel(buildKeyword(name))

  private getCollaborator = (id: string) => this.props.collaborators.get(id)

  // TODO: unmount
  private renderReactComponent = (
    child: React.ReactChild,
    container: HTMLElement
  ) => {
    ReactDOM.render(
      <IntlProvider>
        <ThemeProvider>{child}</ThemeProvider>
      </IntlProvider>,
      container
    )
  }
}

export default withModal<Props>(
  withIntl<Props & ModalProps>(ManuscriptPageContainer)
)
