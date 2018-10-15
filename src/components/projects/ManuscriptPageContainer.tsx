import debounce from 'lodash-es/debounce'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import {
  RxAttachmentCreator,
  RxCollection,
  RxDocument,
  RxLocalDocument,
} from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import {
  GetCollaborators,
  GetKeyword,
  GetKeywords,
  GetUser,
} from '../../editor/comment/config'
import Editor, {
  ChangeReceiver,
  DeleteComponent,
  GetComponent,
  SaveComponent,
} from '../../editor/Editor'
import PopperManager from '../../editor/lib/popper'
import { findParentNodeWithId, Selected } from '../../editor/lib/utils'
import Spinner from '../../icons/spinner'
import {
  buildContributor,
  buildKeyword,
  buildManuscript,
} from '../../lib/commands'
import { buildName } from '../../lib/comments'
import CitationManager from '../../lib/csl'
import { download } from '../../lib/download'
import {
  downloadExtension,
  exportProject,
  generateDownloadFilename,
} from '../../lib/exporter'
import { ContributorRole } from '../../lib/roles'
import { AnyComponentChangeEvent } from '../../lib/rxdb'
import sessionID from '../../lib/sessionID'
import { newestFirst, oldestFirst } from '../../lib/sort'
import { ComponentsProps, withComponents } from '../../store/ComponentsProvider'
import { ComponentObject } from '../../store/DataProvider'
import { IntlProps, withIntl } from '../../store/IntlProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import {
  buildComponentMap,
  getComponentFromDoc,
} from '../../transformer/decode'
import { documentObjectTypes } from '../../transformer/document-object-types'
import { generateID } from '../../transformer/id'
import { Decoder, encode } from '../../transformer/index'
import * as ObjectTypes from '../../transformer/object-types'
import {
  AnyComponent,
  AnyContainedComponent,
  Attachments,
  BibliographyItem,
  CommentAnnotation,
  ComponentAttachment,
  ComponentDocument,
  ComponentIdSet,
  ComponentMap,
  ComponentWithAttachment,
  ContainedComponent,
  Keyword,
  Manuscript,
  ManuscriptComponent,
  Project,
  UserProfile,
} from '../../types/components'
import { LibraryDocument } from '../../types/library'
import {
  AddManuscript,
  ExportManuscript,
  ImportManuscript,
  ManuscriptDocument,
} from '../../types/manuscript'
import { ProjectDocument } from '../../types/project'
import { DebouncedInspector } from '../Inspector'
import { Main, Page } from '../Page'
import Panel from '../Panel'
import { CommentList } from './CommentList'
import ManuscriptForm from './ManuscriptForm'
import ManuscriptSidebar from './ManuscriptSidebar'

interface ComponentIdSets {
  [key: string]: ComponentIdSet
}

interface State {
  componentIds: ComponentIdSets
  componentMap: ComponentMap
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
  ComponentsProps &
  RouteComponentProps<RouteParams> &
  IntlProps

class ManuscriptPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    componentIds: {
      document: new Set(),
      data: new Set(),
    },
    componentMap: new Map(),
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

  private readonly debouncedSaveComponents: (state: EditorState) => void

  public constructor(props: CombinedProps) {
    super(props)

    this.initialState = this.state

    this.debouncedSaveComponents = debounce(this.saveComponents, 1000, {
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
      componentMap,
      doc,
      manuscript,
      manuscripts,
      project,
      popper,
      selected,
      comments,
      view,
    } = this.state

    if (!doc || !manuscript || !manuscripts || !project || !comments) {
      return <Spinner />
    }

    const locale = this.getLocale()

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
            getComponent={this.getComponent}
            saveComponent={this.saveComponent}
            deleteComponent={this.deleteComponent}
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
            componentMap={componentMap}
            popper={popper}
            projectID={projectID}
            subscribe={this.handleSubscribe}
            setView={this.setView}
            attributes={{
              class: 'manuscript-editor',
              dir: locale === 'ar' ? 'rtl' : 'ltr', // TODO: remove hard-coded locale
              tabindex: '2',
            }}
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
                  deleteComponent={this.deleteComponent}
                  saveComponent={this.saveComponent}
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
        throw new Error('Project not found')
      }

      const manuscript = await this.loadManuscript(manuscriptID)

      if (!manuscript) {
        throw new Error('Manuscript not found')
      }

      await this.createCitationProcessor(manuscript)

      const components = await this.loadComponents(projectID, manuscriptID)

      // console.log(components.map(doc => [doc.objectType, doc.toJSON()]))

      if (!components.length) {
        throw new Error('No components found')
      }

      // tslint:disable-next-line:no-any
      let localDoc: RxLocalDocument<any> = await this.getCollection().getLocal(
        manuscriptID
      )

      // TODO: move this
      // tslint:disable-next-line:strict-type-predicates
      if (localDoc === null) {
        localDoc = await this.getCollection().insertLocal(manuscriptID, {})
      }

      localDoc.$.subscribe(doc => {
        console.log('Conflicts:', doc) // tslint:disable-line:no-console
      })

      const componentMap = await buildComponentMap(components)

      const decoder = new Decoder(componentMap)

      const doc = decoder.createArticleNode()
      doc.check()

      // encode again here to get doc component ids for comparison
      const encodedComponentMap = encode(doc)
      const componentIds = this.buildManuscriptComponentIds(encodedComponentMap)

      this.setState({ componentIds, componentMap })

      this.setState({ doc })
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
      this.setState({
        error: error.message,
      })
    }
  }

  private setView = (view: EditorView) => {
    this.setState({ view })
  }

  private getCollection = () => {
    return this.props.components.collection as RxCollection<{}>
  }

  private getLocale = () => {
    const manuscript = this.getManuscript()

    return manuscript.primaryLanguageCode || this.props.intl.locale || 'en-GB'
  }

  // FIXME: this shouldn't need a project ID
  private saveProject = async (project: Project) => {
    await this.props.components.saveComponent(project, {
      projectID: project.id,
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

    await this.saveComponent(manuscript)

    if (this.shouldUpdateCitationProcessor(manuscript, previousManuscript)) {
      await this.createCitationProcessor(manuscript)

      this.dispatchUpdate()
    }
  }

  private deleteManuscript = async (id: string) => {
    const { project, manuscripts } = this.state
    const index = manuscripts!.findIndex(item => item.id === id)

    const prevManuscript: Manuscript = manuscripts![
      index - 1 >= 0 ? index - 1 : 1
    ]

    await this.deleteComponent(id)

    this.props.history.push(
      `/projects/${project!.id}/manuscripts/${prevManuscript.id}`
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

  private addManuscript: AddManuscript = async () => {
    // TODO: open up the template modal

    const { projectID } = this.props.match.params

    const user = this.props.user.data as UserProfile

    const manuscript = buildManuscript()
    const manuscriptID = manuscript.id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await this.props.components.saveComponent(contributor, {
      projectID,
      manuscriptID,
    })

    await this.props.components.saveComponent(manuscript, {
      projectID,
      manuscriptID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private exportManuscript: ExportManuscript = async format => {
    const { componentMap } = this.state
    const { manuscriptID } = this.props.match.params

    try {
      const blob = await exportProject(componentMap, manuscriptID, format)
      const manuscript = componentMap.get(manuscriptID) as Manuscript

      const filename =
        generateDownloadFilename(manuscript.title) + downloadExtension(format)

      download(blob, filename)
    } catch (e) {
      alert('Something went wrong: ' + e.message)
    }
  }

  private importManuscript: ImportManuscript = async components => {
    const { projectID } = this.props.match.params

    const manuscriptID = generateID('manuscript') as string

    for (const component of components) {
      if (component.objectType === ObjectTypes.MANUSCRIPT) {
        component.id = manuscriptID
      }

      const { attachment, ...data } = component as Partial<
        ComponentWithAttachment
      >

      const result = await this.props.components.saveComponent(data, {
        projectID,
        manuscriptID,
      })

      if (attachment) {
        await this.props.components.putAttachment(
          result.id,
          attachment as RxAttachmentCreator
        )
      }
    }

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private createCitationProcessor = async (manuscript: Manuscript) => {
    const citationManager = new CitationManager()

    const processor = await citationManager.createProcessor(
      manuscript.bundle,
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
        .$.subscribe((doc: ManuscriptDocument) => {
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
        .$.subscribe((doc: ProjectDocument) => {
          const project = doc.toJSON()
          this.setState({ project })
          resolve(project)
        })
    })
  }

  private loadComponents = (
    projectID: string,
    manuscriptID: string
  ): Promise<ComponentDocument[]> => {
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
      .exec() as Promise<ComponentDocument[]>
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
          keywords.set(doc.id, doc.toJSON())
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
            docs.map(doc => getComponentFromDoc<UserProfile>(doc))
          )

          const users = items.reduce((output, user) => {
            output.set(user.id, user)
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
      .$.subscribe((items: LibraryDocument[]) => {
        const library: Map<string, BibliographyItem> = new Map()

        items.sort(newestFirst).forEach(item => {
          library.set(item.id, item.toJSON())
        })

        this.setState({ library })
      })
  }

  private getLibraryItem = (id: string) => {
    return this.state.library.get(id) as BibliographyItem
  }

  private getComponent: GetComponent = <T extends AnyComponent>(
    id: string
  ): T | undefined => this.state.componentMap.get(id) as T | undefined

  private saveComponent: SaveComponent = async <
    T extends AnyContainedComponent
  >(
    component: (T & ComponentAttachment) | Partial<T>
  ) => {
    const { manuscriptID, projectID } = this.props.match.params
    const { saveComponent, putAttachment } = this.props.components

    // TODO: encode?

    if (!component.id) {
      throw new Error('Component ID required')
    }

    // TODO: remove this?
    component.containerID = projectID

    if (component.objectType && ObjectTypes.isManuscriptComponent(component)) {
      component.manuscriptID = manuscriptID
    }

    this.setState({
      componentMap: this.state.componentMap.set(
        component.id as string,
        component as ComponentWithAttachment
      ),
    })

    // tslint:disable-next-line:no-unused-variable
    const { src, attachment, ...data } = component as Partial<
      ComponentWithAttachment
    >

    // TODO: data.contents = serialized DOM wrapper for bibliography

    const result = (await saveComponent(data, {
      manuscriptID,
      projectID,
    })) as T & Attachments

    if (attachment) {
      await putAttachment(result.id, attachment as RxAttachmentCreator)
    }

    return result
  }

  private deleteComponent: DeleteComponent = (id: string) => {
    const { componentMap } = this.state

    componentMap.delete(id)

    this.setState({ componentMap })

    return this.props.components.deleteComponent(id)
  }

  // NOTE: can only _return_ the boolean value when using "onbeforeunload"!
  private unloadListener: EventListener = (event: Event) => {
    if (this.state.dirty) {
      event.returnValue = true // can only be set to a boolean
    }
  }

  private isRelevantUpdate = (
    v: AnyComponent,
    projectID: string,
    manuscriptID: string,
    sessionID: string
  ) => {
    // ignore changes to other projects
    if ((v as ContainedComponent).containerID !== projectID) {
      return false
    }

    // ignore changes to other manuscripts
    if (
      (v as ManuscriptComponent).manuscriptID &&
      (v as ManuscriptComponent).manuscriptID !== manuscriptID
    ) {
      return false
    }

    // only use updates from other sessions
    return v.sessionID !== sessionID
  }

  private handleSubscribe = (receive: ChangeReceiver) => {
    const { projectID, manuscriptID } = this.props.match.params

    const collection = this.getCollection()

    const isValidChangeEvent = (changeEvent: AnyComponentChangeEvent) => {
      const { v, doc, op } = changeEvent.data

      return v && doc && op
    }

    const sub = collection.$.subscribe(
      async (changeEvent: AnyComponentChangeEvent) => {
        if (!isValidChangeEvent(changeEvent)) {
          throw new Error('Unexpected change event data')
        }

        const op = changeEvent.data.op
        const doc = changeEvent.data.doc
        const v = changeEvent.data.v as AnyComponent

        console.log({ op, doc, v }) // tslint:disable-line:no-console

        // TODO: only subscribe to changes to this project/manuscript?
        if (!this.isRelevantUpdate(v, projectID, manuscriptID, sessionID)) {
          return false
        }

        if (op === 'REMOVE') {
          return receive(op, doc)
        }

        // NOTE: need to load the doc to get attachments
        const componentDocument = (await collection
          .findOne(doc)
          .exec()) as ComponentDocument | null

        if (!componentDocument) {
          return null
        }

        const component = (await getComponentFromDoc(
          componentDocument
        )) as AnyContainedComponent & Attachments

        const { componentMap } = this.state

        componentMap.set(component.id, component) // TODO: what if this overlaps with saving?

        this.setState({ componentMap })

        // TODO: only call receive once finished syncing?

        // TODO: might not need a new decoder, for data components

        // TODO: set updatedAt on nodes that depend on data components?

        const decoder = new Decoder(componentMap)

        const node = decoder.decode(component)

        receive(op, doc, node)
      }
    )

    this.subs.push(sub)
  }

  private removedComponentIds = (
    componentIds: ComponentIdSet,
    newComponentIds: ComponentIdSet
  ) =>
    Array.from(componentIds).filter(id => {
      return !newComponentIds.has(id)
    })

  private keysForComparison = (component: ComponentObject) => {
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

    return Object.keys(component).filter(key => !excludedKeys.includes(key))
  }

  private hasChanged = (component: ComponentObject): boolean => {
    const previousComponent = this.getComponent(component.id) as ComponentObject

    // TODO: return false if the previous component was a placeholder element?

    if (!previousComponent) return true

    const componentKeys = this.keysForComparison(component)
    const previousComponentKeys = this.keysForComparison(previousComponent)

    // look for different keys
    if (
      componentKeys.length !==
      new Set([...componentKeys, ...previousComponentKeys]).size
    ) {
      return true
    }

    // look for changed values
    for (const key of componentKeys) {
      if (
        JSON.stringify(component[key]) !==
        JSON.stringify(previousComponent[key])
      ) {
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
        window.requestIdleCallback(() => this.debouncedSaveComponents(state), {
          timeout: 5000, // maximum wait for idle
        })
      } else {
        this.debouncedSaveComponents(state)
      }
    }
  }

  private buildManuscriptComponentIds = (componentMap: ComponentMap) => {
    const output = {
      document: new Set(),
      data: new Set(),
    }

    for (const component of componentMap.values()) {
      if (ObjectTypes.isManuscriptComponent(component)) {
        const type = documentObjectTypes.includes(component.objectType)
          ? 'document'
          : 'data'

        output[type].add(component.id)
      }
    }

    return output
  }

  private saveComponents = async (state: EditorState) => {
    // TODO: return/queue if already saving?
    const { manuscriptID, projectID } = this.props.match.params

    // NOTE: can't use state.toJSON() as the HTML serializer needs the actual nodes

    const encodedComponentMap = encode(state.doc)

    const { deleteComponent, saveComponent } = this.props.components

    try {
      // save the changed doc components
      // TODO: make sure dependencies are saved first

      const { componentMap } = this.state

      const changedComponents = []

      for (const component of encodedComponentMap.values()) {
        if (this.hasChanged(component)) {
          changedComponents.push(component)
          componentMap.set(component.id, component)
        }
      }

      interface ChangedComponentsByType {
        dependencies: AnyComponent[]
        elements: AnyComponent[]
        sections: AnyComponent[]
      }

      const changedComponentsObject: ChangedComponentsByType = {
        dependencies: [],
        elements: [],
        sections: [],
      }

      const changedComponentsByType = changedComponents.reduce(
        (output, component) => {
          if (component.objectType === ObjectTypes.SECTION) {
            output.sections.push(component)
          } else if (
            ObjectTypes.elementObjects.includes(component.objectType)
          ) {
            output.elements.push(component)
          } else {
            output.dependencies.push(component)
          }

          return output
        },
        changedComponentsObject
      )

      await Promise.all(
        changedComponentsByType.dependencies.map((component: AnyComponent) =>
          saveComponent(component, {
            projectID,
            manuscriptID,
          })
        )
      )

      await Promise.all(
        changedComponentsByType.elements.map((component: AnyComponent) =>
          saveComponent(component, {
            projectID,
            manuscriptID,
          })
        )
      )

      await Promise.all(
        changedComponentsByType.sections.map((component: AnyComponent) =>
          saveComponent(component, {
            projectID,
            manuscriptID,
          })
        )
      )

      // delete any removed components, children first

      const componentIds = this.buildManuscriptComponentIds(encodedComponentMap)

      const deleteRemovedComponentIds = async (type: 'document' | 'data') => {
        const removedComponentIds = this.removedComponentIds(
          this.state.componentIds[type],
          componentIds[type]
        )

        // NOTE: reversed, to remove children first
        await Promise.all(
          removedComponentIds.reverse().map(id =>
            deleteComponent(id).catch(error => {
              console.error(error) // tslint:disable-line:no-console
            })
          )
        )

        removedComponentIds.map(id => {
          componentMap.delete(id)
        })
      }

      await deleteRemovedComponentIds('document')
      await deleteRemovedComponentIds('data')

      this.setState({
        componentIds,
        componentMap, // NOTE: not using encodedComponentMap, to keep removed components
        dirty: false,
        // doc: state.doc,
      })

      console.log('saved') // tslint:disable-line:no-console
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
    }
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

    return this.saveComponent<Keyword>(keyword)
  }

  private handleSectionChange = (section: string) => {
    if (section !== 'manuscript') {
      this.setState({ selected: null })
    }
  }
}

export default withComponents(withUser(withIntl(ManuscriptPageContainer)))
