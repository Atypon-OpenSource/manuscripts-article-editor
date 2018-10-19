import debounce from 'lodash-es/debounce'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument, RxLocalDocument } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import {
  GetCollaborators,
  GetKeyword,
  GetKeywords,
  GetUser,
} from '../../editor/comment/config'
import { conflictsKey } from '../../editor/config/plugins/conflicts'
import Editor, { ChangeReceiver } from '../../editor/Editor'
import PopperManager from '../../editor/lib/popper'
import { findParentNodeWithId, Selected } from '../../editor/lib/utils'
import Spinner from '../../icons/spinner'
import {
  Build,
  buildContributor,
  buildKeyword,
  buildManuscript,
} from '../../lib/commands'
import { buildName } from '../../lib/comments'
import {
  applyLocalStep,
  applyRemoteStep,
  Conflict,
  getRevNumber,
  LocalConflicts,
  removeConflictLocally,
} from '../../lib/conflicts'
import CitationManager, { DEFAULT_BUNDLE } from '../../lib/csl'
import { download } from '../../lib/download'
import {
  downloadExtension,
  exportProject,
  generateDownloadFilename,
} from '../../lib/exporter'
import {
  createMerge,
  hydrateConflictNodes,
  iterateConflicts,
} from '../../lib/merge'
import { ContributorRole } from '../../lib/roles'
import { ModelChangeEvent } from '../../lib/rxdb'
import sessionID from '../../lib/sessionID'
import { newestFirst, oldestFirst } from '../../lib/sort'
import { ModelObject } from '../../store/DataProvider'
import { IntlProps, withIntl } from '../../store/IntlProvider'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { buildModelMap, getModelFromDoc } from '../../transformer/decode'
import { documentObjectTypes } from '../../transformer/document-object-types'
import { generateID } from '../../transformer/id'
import { Decoder, encode } from '../../transformer/index'
import * as ObjectTypes from '../../transformer/object-types'
import {
  Attachments,
  BibliographyItem,
  CommentAnnotation,
  ContainedModel,
  ContainedProps,
  Keyword,
  Manuscript,
  ManuscriptModel,
  Model,
  ModelAttachment,
  Project,
  UserProfile,
} from '../../types/models'

import { DebouncedInspector } from '../Inspector'
import { Main, Page } from '../Page'
import Panel from '../Panel'
import { CommentList } from './CommentList'
import ManuscriptForm from './ManuscriptForm'
import ManuscriptSidebar from './ManuscriptSidebar'
import { ReloadDialog } from './ReloadDialog'

interface State {
  modelIds: {
    [key: string]: Set<string>
  }
  modelMap: Map<string, Model>
  conflicts: LocalConflicts | null
  dirty: boolean
  doc: ProsemirrorNode | null
  error: string | null
  popper: PopperManager
  selected: Selected | null
  view: EditorView | null
  library: Map<string, BibliographyItem>
  comments: CommentAnnotation[] | null
  manuscripts: Manuscript[] | null
  keywords: Map<string, Keyword> | null
  users: Map<string, UserProfile> | null
  manuscript: Manuscript | null
  project: Project | null
  processor: Citeproc.Processor | null
}

interface RouteParams {
  projectID: string
  manuscriptID: string
}

type CombinedProps = UserProps &
  ModelsProps &
  RouteComponentProps<RouteParams> &
  IntlProps

class ManuscriptPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    modelIds: {
      document: new Set(),
      data: new Set(),
    },
    modelMap: new Map(),
    conflicts: null,
    dirty: false,
    doc: null,
    error: null,
    popper: new PopperManager(),
    view: null,
    library: new Map(),
    comments: null,
    manuscripts: null,
    keywords: null,
    users: null,
    manuscript: null,
    project: null,
    processor: null,
    selected: null,
  }

  private readonly initialState: Readonly<State>

  private subs: Subscription[] = []

  private readonly debouncedSaveModels: (state: EditorState) => void

  public constructor(props: CombinedProps) {
    super(props)

    this.initialState = this.state

    this.debouncedSaveModels = debounce(this.saveModels, 1000, {
      maxWait: 5000,
    })
  }

  public async componentDidMount() {
    const { params } = this.props.match

    window.addEventListener('beforeunload', this.unloadListener)

    await this.prepare(params.projectID, params.manuscriptID)
  }

  public componentWillReceiveProps(nextProps: CombinedProps) {
    const { params } = this.props.match
    const { params: nextParams } = nextProps.match

    if (
      params.projectID !== nextParams.projectID ||
      params.manuscriptID !== nextParams.manuscriptID
    ) {
      this.setState(this.initialState, async () => {
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
      manuscript,
      manuscripts,
      project,
      popper,
      selected,
      comments,
      view,
      error,
    } = this.state

    if (error) {
      return <ReloadDialog message={error} />
    }

    if (!doc || !manuscript || !manuscripts || !project || !comments) {
      return <Spinner />
    }

    const locale = this.getLocale()

    const attributes = {
      class: 'manuscript-editor',
      dir: locale === 'ar' ? 'rtl' : 'ltr', // TODO: remove hard-coded locale
      tabindex: '2',
    }

    return (
      <Page project={project}>
        <ManuscriptSidebar
          addManuscript={this.addManuscript}
          manuscript={manuscript}
          manuscripts={manuscripts}
          project={project}
          doc={doc}
          view={view}
          saveProject={this.saveProject}
          selected={selected}
        />

        <Main>
          <Editor
            autoFocus={!!manuscript.title}
            getCitationProcessor={this.getCitationProcessor}
            doc={doc}
            editable={true}
            getModel={this.getModel}
            saveModel={this.saveModel}
            deleteModel={this.deleteModel}
            applyLocalStep={applyLocalStep(this.getCollection())}
            applyRemoteStep={applyRemoteStep(this.getCollection())}
            getLibraryItem={this.getLibraryItem}
            getManuscript={this.getManuscript}
            saveManuscript={this.saveManuscript}
            addManuscript={this.addManuscript}
            deleteManuscript={this.deleteManuscript}
            exportManuscript={this.exportManuscript}
            importManuscript={this.importManuscript}
            getCurrentUser={this.getCurrentUser}
            history={this.props.history}
            locale={locale}
            manuscript={manuscript}
            onChange={this.handleChange}
            modelMap={modelMap}
            popper={popper}
            projectID={projectID}
            subscribe={this.handleSubscribe}
            setView={this.setView}
            attributes={attributes}
            handleSectionChange={this.handleSectionChange}
          />

          <Prompt when={dirty} message={() => false} />
        </Main>

        <Panel
          name={'inspector'}
          minSize={200}
          direction={'row'}
          side={'start'}
        >
          {this.state.view &&
            comments && (
              <DebouncedInspector>
                <ManuscriptForm
                  manuscript={manuscript}
                  saveManuscript={this.saveManuscript}
                />
                <CommentList
                  comments={comments}
                  doc={doc}
                  getCurrentUser={this.getCurrentUser}
                  getUser={this.getUser}
                  getCollaborators={this.getCollaborators}
                  getKeyword={this.getKeyword}
                  getKeywords={this.getKeywords}
                  deleteModel={this.deleteModel}
                  saveModel={this.saveModel}
                  createKeyword={this.createKeyword}
                  selected={selected}
                />
              </DebouncedInspector>
            )}
        </Panel>
      </Page>
    )
  }

  private prepare = async (projectID: string, manuscriptID: string) => {
    try {
      this.loadUsers() // TODO: move this to provider
      this.loadManuscripts(projectID) // TODO: move this to provider
      this.loadKeywords(projectID) // TODO: move this to provider
      this.loadLibraryItems(projectID) // TODO: move this to provider
      this.loadComments(projectID, manuscriptID) // TODO: move this to provider

      const project = await this.loadProject(projectID)

      if (!project) {
        throw new Error(
          'Failed to open project for editing as the project could not be found.'
        )
      }

      const manuscript = await this.loadManuscript(manuscriptID)

      if (!manuscript) {
        throw new Error(
          'Failed to open manuscript for editing as the manuscript could not be found.'
        )
      }

      try {
        await this.createCitationProcessor(manuscript)
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
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
      this.setState({
        error: error.message,
      })
    }
  }

  private setView = (view: EditorView) => {
    this.setState({ view })

    this.subscribeToConflicts().catch(err => {
      throw err
    })
  }

  private getOrInsertLocalDocument = async (manuscriptID: string) => {
    const collection = this.getCollection() as RxCollection<{}>

    let localDoc = await collection.getLocal(manuscriptID)

    if (!localDoc) {
      localDoc = await collection.insertLocal(manuscriptID, {})
    }

    return localDoc as RxLocalDocument<RxCollection<LocalConflicts>>
  }

  private subscribeToConflicts = async () => {
    const { manuscriptID } = this.props.match.params

    let loaded = false

    const localDoc = await this.getOrInsertLocalDocument(manuscriptID)

    localDoc.$.subscribe((conflicts: LocalConflicts) => {
      this.setState({ conflicts })

      // when the editor is loaded for the first time, we should check if we
      // have any conflicts to resolve/decorations to create
      if (!loaded) {
        loaded = true

        this.handleConflicts(conflicts).catch(err => {
          throw err
        })
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

  private getCollection = () => {
    return this.props.models.collection as RxCollection<Model>
  }

  private getLocale = () => {
    const manuscript = this.getManuscript()

    return manuscript.primaryLanguageCode || this.props.intl.locale || 'en-GB'
  }

  // FIXME: this shouldn't need a project ID
  private saveProject = async (project: Project) => {
    await this.props.models.saveModel(project, {
      projectID: project._id,
    })
  }

  private getManuscript = () => {
    return this.state.manuscript as Manuscript
  }

  private saveManuscript = async (data: Partial<Manuscript>) => {
    const previousManuscript = this.state.manuscript!

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
    const { project, manuscripts } = this.state
    const index = manuscripts!.findIndex(item => item._id === id)

    const prevManuscript: Manuscript = manuscripts![index === 0 ? 1 : index - 1]

    await this.deleteModel(id)

    this.props.history.push(
      `/projects/${project!._id}/manuscripts/${prevManuscript._id}`
    )
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

  private dispatchUpdate = () => {
    const { view } = this.state

    if (view) {
      view.dispatch(view.state.tr.setMeta('update', true))
    }
  }

  private addManuscript = async () => {
    // TODO: open up the template modal

    const { projectID } = this.props.match.params

    const user = this.props.user.data as UserProfile

    const manuscript = buildManuscript()
    const manuscriptID = manuscript._id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await this.props.models.saveModel(contributor, {
      projectID,
      manuscriptID,
    })

    await this.props.models.saveModel(manuscript, {
      projectID,
      manuscriptID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private exportManuscript = async (format: string): Promise<void> => {
    const { modelMap } = this.state
    const { manuscriptID } = this.props.match.params

    try {
      const blob = await exportProject(modelMap, manuscriptID, format)
      const manuscript = modelMap.get(manuscriptID) as Manuscript

      const filename =
        generateDownloadFilename(manuscript.title || 'Untitled') +
        downloadExtension(format)

      download(blob, filename)
    } catch (e) {
      alert('Something went wrong: ' + e.message)
    }
  }

  private importManuscript = async (models: Model[]) => {
    const { projectID } = this.props.match.params

    const manuscriptID = generateID('manuscript') as string

    for (const model of models) {
      if (model.objectType === ObjectTypes.MANUSCRIPT) {
        model._id = manuscriptID
      }

      const { attachment, ...data } = model as Model & ModelAttachment

      const result = await this.props.models.saveModel(data, {
        projectID,
        manuscriptID,
      })

      if (attachment) {
        await this.props.models.putAttachment(result._id, attachment)
      }
    }

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private createCitationProcessor = async (manuscript: Manuscript) => {
    const citationManager = new CitationManager()

    // TODO: move defaults into method?
    const processor = await citationManager.createProcessor(
      manuscript.bundle || DEFAULT_BUNDLE,
      manuscript.primaryLanguageCode || 'en-GB',
      this.getLibraryItem
    )

    this.setState({ processor })
  }

  private getCitationProcessor = () => {
    return this.state.processor as Citeproc.Processor
  }

  private loadManuscript = (id: string): Promise<Manuscript> => {
    return new Promise(resolve => {
      this.getCollection()
        .findOne(id)
        .$.subscribe((doc: RxDocument<Manuscript>) => {
          if (doc) {
            const manuscript = doc.toJSON()
            this.setState({ manuscript })
            resolve(manuscript)
          }
        })
    })
  }

  private loadProject = (projectID: string): Promise<Project> => {
    return new Promise(resolve => {
      this.getCollection()
        .findOne(projectID)
        .$.subscribe((doc: RxDocument<Project>) => {
          if (!doc) return
          const project = doc.toJSON()
          this.setState({ project })
          resolve(project)
        })
    })
  }

  private loadModels = (
    projectID: string,
    manuscriptID: string
  ): Promise<Array<RxDocument<ContainedModel | ManuscriptModel>>> => {
    return this.getCollection()
      .find({
        $and: [
          {
            containerID: projectID,
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
      .exec() as Promise<Array<RxDocument<ContainedModel | ManuscriptModel>>>
  }

  private loadKeywords = (projectID: string) =>
    this.getCollection()
      .find({
        objectType: ObjectTypes.KEYWORD,
        containerID: projectID,
      })
      .$.subscribe(async (docs: Array<RxDocument<Keyword>>) => {
        const keywords = new Map()

        for (const doc of docs) {
          keywords.set(doc._id, doc.toJSON())
        }

        this.setState({ keywords })
      })

  private loadUsers = () =>
    this.getCollection()
      .find({
        objectType: ObjectTypes.USER_PROFILE,
      })
      .$.subscribe(
        async (docs: Array<RxDocument<UserProfile & Attachments>>) => {
          const items = await Promise.all(
            docs.map(doc => getModelFromDoc<UserProfile>(doc))
          )

          const users = items.reduce((output, user) => {
            output.set(user._id, user)
            return output
          }, new Map())

          this.setState({ users })
        }
      )

  private loadComments = (projectID: string, manuscriptID: string) => {
    this.getCollection()
      .find({
        objectType: ObjectTypes.COMMENT_ANNOTATION,
        containerID: projectID,
        manuscriptID,
      })
      .$.subscribe((docs: Array<RxDocument<CommentAnnotation>>) => {
        if (docs) {
          this.setState({
            comments: docs.map(doc => doc.toJSON()),
          })
        }
      })
  }

  private loadManuscripts = (projectID: string) => {
    this.getCollection()
      .find({
        objectType: ObjectTypes.MANUSCRIPT,
        containerID: projectID,
      })
      .$.subscribe((docs: Array<RxDocument<Manuscript>>) => {
        this.setState({
          manuscripts: docs.sort(oldestFirst).map(doc => doc.toJSON()),
        })
      })
  }

  private loadLibraryItems = (projectID: string) => {
    this.getCollection()
      .find({
        objectType: ObjectTypes.BIBLIOGRAPHY_ITEM,
        containerID: projectID,
      })
      .$.subscribe((items: Array<RxDocument<BibliographyItem>>) => {
        const library: Map<string, BibliographyItem> = new Map()

        items.sort(newestFirst).forEach(item => {
          library.set(item._id, item.toJSON())
        })

        this.setState({ library })
      })
  }

  private getLibraryItem = (id: string) => {
    return this.state.library.get(id) as BibliographyItem
  }

  private getModel = <T extends Model>(id: string): T | undefined =>
    this.state.modelMap.get(id) as T | undefined

  private saveModel = async <T extends Model>(model: Build<T>): Promise<T> => {
    const { manuscriptID, projectID } = this.props.match.params
    const { saveModel, putAttachment } = this.props.models

    // TODO: encode?

    if (!model._id) {
      throw new Error('Model ID required')
    }

    const containedModel = model as T & ContainedProps

    // TODO: remove this?
    containedModel.containerID = projectID

    if (
      containedModel.objectType &&
      ObjectTypes.isManuscriptModel(containedModel)
    ) {
      containedModel.manuscriptID = manuscriptID
    }

    // NOTE: can't set a partial here
    this.setState({
      modelMap: this.state.modelMap.set(containedModel._id, containedModel),
    })

    const {
      src: _src,
      attachment,
      ...data
    } = containedModel as ContainedModel & ModelAttachment

    // TODO: data.contents = serialized DOM wrapper for bibliography

    const result = await saveModel(data, {
      manuscriptID,
      projectID,
    })

    if (attachment) {
      await putAttachment(result._id, attachment)
    }

    return result as T
  }

  private deleteModel = (id: string) => {
    const { modelMap } = this.state

    modelMap.delete(id)

    this.setState({ modelMap })

    return this.props.models.deleteModel(id)
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

  private conflictForComponent = (componentId: string) => {
    const { conflicts } = this.state

    // If this update is a component which has conflicts
    if (conflicts && componentId in conflicts) {
      const conflictsForNode = Object.values(conflicts[componentId])
      if (conflictsForNode.length > 1) {
        // TODO: what do we do here
        throw new Error('Multiple conflicts for same element')
      }
      return conflictsForNode[0]
    }

    return null
  }

  private handleSubscribe = (receive: ChangeReceiver) => {
    const { projectID, manuscriptID } = this.props.match.params

    const collection = this.getCollection()

    const isValidChangeEvent = (changeEvent: ModelChangeEvent) => {
      const { v, doc, op } = changeEvent.data

      return v && doc && op
    }

    const sub = collection.$.subscribe(
      async (changeEvent: ModelChangeEvent) => {
        if (!isValidChangeEvent(changeEvent)) {
          throw new Error('Unexpected change event data')
        }

        const op = changeEvent.data.op
        const doc = changeEvent.data.doc
        const v = changeEvent.data.v as Model

        console.log({ op, doc, v }) // tslint:disable-line:no-console

        // TODO: only subscribe to changes to this project/manuscript?
        if (!this.isRelevantUpdate(v, projectID, manuscriptID, sessionID)) {
          return false
        }

        if (op === 'REMOVE') {
          return receive(op, doc)
        }

        // NOTE: need to load the doc to get attachments
        const modelDocument = (await collection
          .findOne(doc)
          .exec()) as RxDocument<Model & Attachments> | null

        if (!modelDocument) {
          return null
        }

        const model = (await getModelFromDoc(modelDocument)) as Model &
          Attachments

        const conflict = this.conflictForComponent(modelDocument._id)

        if (conflict) {
          const updatedRevNumber = getRevNumber(modelDocument._rev)
          const remoteConflictRevNumber = getRevNumber(conflict.remote._rev)

          // Check to see if the node is either the one we initially conflicted
          // with, or descendant of it.
          if (updatedRevNumber >= remoteConflictRevNumber) {
            // TODO: this following check shouldn't be needed
            // Maybe there's an issue with the sessionID check
            if (modelDocument._rev !== conflict.local._rev) {
              const updatedNode = await this.processConflict(model, conflict)

              receive(op, doc, updatedNode)
              return
            }
          }
        }

        const { modelMap } = this.state

        modelMap.set(model._id, model) // TODO: what if this overlaps with saving?

        this.setState({ modelMap })

        // TODO: only call receive once finished syncing?

        // TODO: might not need a new decoder, for data models

        // TODO: set updatedAt on nodes that depend on data models?

        const decoder = new Decoder(modelMap)

        const node = decoder.decode(model)

        receive(op, doc, node)
      }
    )

    this.subs.push(sub)
  }

  private processConflict = async (
    component: Model & Attachments,
    conflict: Conflict
  ) => {
    const decoder = new Decoder(new Map())

    const { localNode, ancestorNode } = hydrateConflictNodes(
      conflict,
      decoder.decode
    )

    let updatedNode = decoder.decode(component)

    const { merge, tr: transform } = createMerge(
      updatedNode,
      localNode,
      ancestorNode,
      conflict
    )

    if (transform.steps.length) {
      const mergedStep = transform.steps.reduce((acc, step) => {
        const newStep = acc.merge(step)
        if (!newStep) {
          return acc
        } else {
          return newStep
        }
      })

      const result = mergedStep.apply(updatedNode)
      if (result.doc) {
        updatedNode = result.doc
      }
    }

    // if we have a conflict then this will be set
    let updatedConflicts = this.state.conflicts!

    // This removes conflicts that can be (completely) automerged
    // It is possible the user could manually/coincidentally have the same
    // content, so we want to delete even when there were no automerged steps.
    if (merge.conflictingSteps2.length === 0) {
      updatedConflicts = await removeConflictLocally(
        this.getCollection(),
        conflict
      )
    }

    // send remaining/updated conflict state to editor plugin
    const { view } = this.state

    if (!view) {
      throw new Error('No view initialized')
    }

    const tr = view.state.tr.setMeta(conflictsKey, updatedConflicts)
    view.dispatch(tr)

    return updatedNode
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

  private handleChange = (state: EditorState, docChanged: boolean) => {
    const selected = findParentNodeWithId(state.selection) || null

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
      if (ObjectTypes.isManuscriptModel(model)) {
        const type = documentObjectTypes.includes(model.objectType)
          ? 'document'
          : 'data'

        output[type].add(model._id)
      }
    }

    return output
  }

  private saveModels = async (state: EditorState) => {
    // TODO: return/queue if already saving?
    const { manuscriptID, projectID } = this.props.match.params

    // NOTE: can't use state.toJSON() as the HTML serializer needs the actual nodes

    const encodedModelMap = encode(state.doc)

    const { deleteModel, saveModel } = this.props.models

    try {
      // save the changed doc models
      // TODO: make sure dependencies are saved first

      const { modelMap } = this.state

      const changedModels = []

      for (const model of encodedModelMap.values()) {
        if (this.hasChanged(model)) {
          changedModels.push(model)
          modelMap.set(model._id, model)
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
        if (model.objectType === ObjectTypes.SECTION) {
          output.sections.push(model)
        } else if (ObjectTypes.elementObjects.includes(model.objectType)) {
          output.elements.push(model)
        } else {
          output.dependencies.push(model)
        }

        return output
      }, changedModelsObject)

      await Promise.all(
        changedModelsByType.dependencies.map((model: Model) =>
          saveModel(model, {
            projectID,
            manuscriptID,
          })
        )
      )

      await Promise.all(
        changedModelsByType.elements.map((model: Model) =>
          saveModel(model, {
            projectID,
            manuscriptID,
          })
        )
      )

      await Promise.all(
        changedModelsByType.sections.map((model: Model) =>
          saveModel(model, {
            projectID,
            manuscriptID,
          })
        )
      )

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
            deleteModel(id).catch(error => {
              console.error(error) // tslint:disable-line:no-console
            })
          )
        )

        removedModelIds.map(id => {
          modelMap.delete(id)
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
    const { view } = this.state

    if (!view) {
      throw new Error('EditorView not initialized')
    }

    const decoder = new Decoder(new Map())

    let tr = view.state.tr

    const conflictsToDelete: Conflict[] = []

    // Iterate conflicts, cleaning up resolved conflicts
    iterateConflicts(
      conflicts,
      view.state.doc,
      decoder.decode,
      (current, local, ancestor, pos, conflict) => {
        const { merge } = createMerge(current, local, ancestor, conflict)

        // This removes conflicts that can be (completely) automerged
        // Automerging is currently turned off, so this will just cases where
        // the remote state matches the local conflict.
        if (merge.conflictingSteps2.length === 0) {
          conflictsToDelete.push(conflict)
        }
        return
      }
    )

    let updatedConflicts = conflicts

    for (const c of conflictsToDelete) {
      updatedConflicts = await removeConflictLocally(this.getCollection(), c)
    }

    // send remaining/updated conflict state to editor plugin
    tr = tr.setMeta(conflictsKey, updatedConflicts)

    view.dispatch(tr)
  }

  private getCurrentUser = (): UserProfile => this.props.user.data!

  private getUser: GetUser = id => this.state.users!.get(id)

  // TODO: build this in advance
  private getCollaborators: GetCollaborators = () =>
    Array.from(this.state.users!.values()).map(person => ({
      ...person,
      name: buildName(person.bibliographicName),
    }))

  private getKeyword: GetKeyword = id => this.state.keywords!.get(id)

  private getKeywords: GetKeywords = () =>
    Array.from(this.state.keywords!.values())

  private createKeyword = (name: string) => {
    const keyword = buildKeyword(name)

    return this.saveModel(keyword)
  }

  private handleSectionChange = (section: string) => {
    if (section !== 'manuscript') {
      this.setState({ selected: null })
    }
  }
}

export default withModels(withUser(withIntl(ManuscriptPageContainer)))
