import debounce from 'lodash-es/debounce'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { RxAttachmentCreator, RxCollection, RxLocalDocument } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import { DropSide, TreeItem } from '../components/DraggableTree'
import { Main, Page } from '../components/Page'
import Panel from '../components/Panel'
import Editor, {
  ChangeReceiver,
  DeleteComponent,
  GetComponent,
  SaveComponent,
} from '../editor/Editor'
import PopperManager from '../editor/lib/popper'
import { findParentNodeWithId, Selected } from '../editor/lib/utils'
import Spinner from '../icons/spinner'
import { buildContributor, buildManuscript } from '../lib/commands'
import CitationManager from '../lib/csl'
import { AnyComponentChangeEvent } from '../lib/rxdb'
import sessionID from '../lib/sessionID'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { ComponentObject } from '../store/DataProvider'
import { IntlProps, withIntl } from '../store/IntlProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { Decoder, encode } from '../transformer'
import { buildComponentMap, getComponentFromDoc } from '../transformer/decode'
import { documentObjectTypes } from '../transformer/document-object-types'
import { generateID } from '../transformer/id'
import * as ObjectTypes from '../transformer/object-types'
import {
  AnyComponent,
  AnyContainedComponent,
  Attachments,
  BibliographyItem,
  ComponentAttachment,
  ComponentDocument,
  ComponentIdSet,
  ComponentMap,
  ComponentWithAttachment,
  ContainedComponent,
  Manuscript,
  ManuscriptComponent,
  Project,
  UserProfile,
} from '../types/components'
import { LibraryDocument } from '../types/library'
import {
  AddManuscript,
  ImportManuscript,
  ManuscriptDocument,
} from '../types/manuscript'
import { ProjectDocument } from '../types/project'
import InspectorContainer from './InspectorContainer'
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

  public render() {
    const { projectID } = this.props.match.params
    const {
      dirty,
      componentMap,
      doc,
      manuscript,
      project,
      popper,
      selected,
    } = this.state

    if (!doc || !manuscript || !project) {
      return <Spinner />
    }

    const locale = this.getLocale()

    return (
      <Page projectID={project.id}>
        <ManuscriptSidebar
          manuscript={manuscript}
          project={project}
          doc={doc}
          onDrop={this.handleDrop}
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
            importManuscript={this.importManuscript}
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
          />

          <Prompt when={dirty} message={() => false} />
        </Main>

        <Panel
          name={'inspector'}
          minSize={200}
          direction={'row'}
          side={'start'}
        >
          {this.state.view && (
            <InspectorContainer
              manuscript={manuscript}
              saveManuscript={this.saveManuscript}
              selected={selected}
            />
          )}
        </Panel>
      </Page>
    )
  }

  private prepare = async (projectID: string, manuscriptID: string) => {
    try {
      this.loadLibraryItems(projectID) // TODO: move this to provider

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

      // encode again here to get doc component ids for comparison
      const encodedComponentMap = encode(doc)
      const componentIds = this.buildComponentIds(encodedComponentMap)

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

    const contributor = buildContributor(user.bibliographicName)

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

  private importManuscript: ImportManuscript = async components => {
    const { projectID } = this.props.match.params

    const manuscriptID = generateID('manuscript') as string

    for (const component of components) {
      if (component.objectType === ObjectTypes.MANUSCRIPT) {
        component.id = manuscriptID
      }

      await this.props.components.saveComponent(component, {
        projectID,
        manuscriptID,
      })
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

  private loadLibraryItems = (projectID: string) => {
    this.getCollection()
      .find({
        objectType: ObjectTypes.BIBLIOGRAPHY_ITEM,
        containerID: projectID,
      })
      .sort({
        updatedAt: 'desc',
      })
      .$.subscribe((items: LibraryDocument[]) => {
        const library: Map<string, BibliographyItem> = new Map()

        items.forEach(item => {
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
  ): T => {
    return this.state.componentMap.get(id) as T
  }

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

  // TODO: need to only include document ids in this set, as data ids are handled separately
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
    this.setState(prevState => ({
      ...prevState,
      dirty: prevState.dirty || docChanged,
      doc: state.doc,
      selected: findParentNodeWithId(state.selection) || null,
    }))

    if (docChanged) {
      window.requestIdleCallback(() => this.debouncedSaveComponents(state), {
        timeout: 5000, // maximum wait for idle
      })
    }
  }

  private buildComponentIds = (componentMap: ComponentMap) => {
    const output = {
      document: new Set(),
      data: new Set(),
    }

    for (const component of componentMap.values()) {
      const type = documentObjectTypes.includes(component.objectType)
        ? 'document'
        : 'data'

      output[type].add(component.id)
    }

    return output
  }

  private saveComponents = async (state: EditorState) => {
    // TODO: return if already saving?

    const { manuscriptID, projectID } = this.props.match.params

    // NOTE: can't use state.toJSON() as the HTML serializer needs the actual nodes

    const newComponentMap = encode(state.doc)

    const { deleteComponent, saveComponent } = this.props.components

    try {
      // save the changed doc components
      // TODO: make sure dependencies are saved first

      const { componentMap } = this.state

      const changedComponents = Array.from(newComponentMap.values()).filter(
        component => this.hasChanged(component)
      )

      // TODO: wait for saving?
      changedComponents.forEach((component: AnyComponent) => {
        componentMap.set(component.id, component)
      })

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

      const componentIds = this.buildComponentIds(newComponentMap)

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
      }

      await deleteRemovedComponentIds('document')
      await deleteRemovedComponentIds('data')

      this.setState({
        componentIds,
        componentMap,
        dirty: false,
        // doc: state.doc,
      })

      console.log('saved') // tslint:disable-line:no-console
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
    }
  }

  private handleDrop = (source: TreeItem, target: TreeItem, side: DropSide) => {
    const view = this.state.view as EditorView

    const insertPos =
      side === 'before' ? target.pos - 1 : target.pos + target.node.nodeSize - 1

    let sourcePos = source.pos - 1

    let tr = view.state.tr.insert(insertPos, source.node)

    sourcePos = tr.mapping.map(sourcePos)

    // tr = tr.replaceWith(sourcePos, sourcePos + source.node.nodeSize, [])
    tr = tr.delete(sourcePos, sourcePos + source.node.nodeSize)

    view.dispatch(tr)
  }
}

export default withComponents(withUser(withIntl(ManuscriptPageContainer)))
