import debounce from 'lodash-es/debounce'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { Prompt, RouteComponentProps } from 'react-router'
import { RxCollection } from 'rxdb'
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
import * as ObjectTypes from '../transformer/object-types'
import {
  AnyComponent,
  BibliographyItem,
  ComponentDocument,
  ComponentIdSet,
  ComponentMap,
  ComponentWithAttachment,
  Manuscript,
  Project,
  UserProfile,
} from '../types/components'
import { LibraryDocument } from '../types/library'
import { AddManuscript, ManuscriptDocument } from '../types/manuscript'
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
  view: EditorView | null
  library: Map<string, BibliographyItem>
  manuscript: Manuscript | null
  project: Project | null
  processor: Citeproc.Processor | null
}

interface Props {
  id: string
}

interface RouteParams {
  project: string
  id: string
}

type CombinedProps = Props &
  UserProps &
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

    await this.prepare(params.project, params.id)
  }

  public componentWillReceiveProps(nextProps: CombinedProps) {
    const { params } = this.props.match
    const { params: nextParams } = nextProps.match

    if (params.project !== nextParams.project || params.id !== nextParams.id) {
      this.setState(this.initialState, async () => {
        await this.prepare(nextParams.project, nextParams.id)
      })
    }
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.state.popper.destroy()
    window.removeEventListener('beforeunload', this.unloadListener)
  }

  public render() {
    const { dirty, componentMap, doc, manuscript, project, popper } = this.state

    if (!doc || !manuscript || !project) {
      return <Spinner />
    }

    const locale = this.getLocale()

    return (
      <Page>
        <ManuscriptSidebar
          manuscript={manuscript}
          project={project}
          doc={doc}
          onDrop={this.handleDrop}
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
            locale={locale}
            manuscript={manuscript}
            onChange={this.handleChange}
            componentMap={componentMap}
            popper={popper}
            subscribe={this.handleSubscribe}
            setView={this.setView}
            attributes={{
              dir: locale === 'ar' ? 'rtl' : 'ltr', // TODO: remove hard-coded locale
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
          {manuscript && (
            <InspectorContainer
              manuscript={manuscript}
              saveManuscript={this.saveManuscript}
            />
          )}
        </Panel>
      </Page>
    )
  }

  private prepare = async (project: string, id: string) => {
    try {
      this.loadLibraryItems() // TODO: move this to provider

      await this.loadProject(project)

      const manuscript = await this.loadManuscript(id)
      await this.createCitationProcessor(manuscript)

      const components = (await this.getCollection()
        .find({ manuscript: id })
        .exec()) as ComponentDocument[]

      if (!components.length) {
        throw new Error('Manuscript not found')
      }

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
    return this.props.components.collection as RxCollection<AnyComponent>
  }

  private getLocale = () => {
    const manuscript = this.getManuscript()

    return manuscript.locale || this.props.intl.locale || 'en-GB'
  }

  private getManuscript = () => {
    return this.state.manuscript as Manuscript
  }

  private saveManuscript = async (manuscript: Manuscript) => {
    this.setState({ manuscript })
    await this.createCitationProcessor(manuscript)
    await this.saveComponent(manuscript)
  }

  private addManuscript: AddManuscript = async () => {
    // TODO: open up the template modal

    const { project } = this.props.match.params

    const user = this.props.user.data as UserProfile

    const owner = user.id.replace('|', '_')

    const contributor = buildContributor(user)
    const manuscript = buildManuscript(project, owner)

    await this.props.components.saveComponent(manuscript.id, contributor)
    await this.props.components.saveComponent(manuscript.id, manuscript)

    this.props.history.push(`/projects/${project}/manuscripts/${manuscript.id}`)
  }

  private createCitationProcessor = async (manuscript: Manuscript) => {
    // TODO: only regenerate the processor when citationStyle or locale change

    const citationManager = new CitationManager()

    const processor = await citationManager.createProcessor(
      manuscript.citationStyle || 'nature',
      manuscript.locale || 'en-GB',
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
          const manuscript = doc.toJSON()
          this.setState({ manuscript })
          resolve(manuscript)
        })
    })
  }

  private loadProject = (id: string): Promise<Manuscript> => {
    return new Promise(resolve => {
      this.getCollection()
        .findOne(id)
        .$.subscribe((doc: ProjectDocument) => {
          const project = doc.toJSON()
          this.setState({ project })
          resolve(project)
        })
    })
  }

  private loadLibraryItems = () => {
    this.getCollection()
      .find({
        objectType: ObjectTypes.BIBLIOGRAPHY_ITEM,
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

  private saveComponent: SaveComponent = async (
    component: ComponentWithAttachment
  ) => {
    const { id } = this.props.match.params
    const { saveComponent } = this.props.components

    // TODO: encode?

    // TODO: wait for successful saving first?
    this.setState({
      componentMap: this.state.componentMap.set(component.id, component),
    })

    // tslint:disable-next-line:no-unused-variable
    const { src, attachment, ...data } = component

    // TODO: data.contents = serialized DOM wrapper for bibliography

    const savedDoc = await saveComponent(id, data)

    if (attachment) {
      await savedDoc.putAttachment(attachment)
      delete component.attachment // TODO: is this really deleted now?
    }
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

  private handleSubscribe = (receive: ChangeReceiver) => {
    const { id } = this.props.match.params

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

        // updated shared data or library
        if (!v.manuscript) {
          return receive('UPDATE', doc, null)
        }

        if (v.manuscript !== id) return false // ignore changes to other manuscripts

        if (v.sessionID === sessionID) return false // ignore our changes

        if (op === 'REMOVE') {
          return receive(op, doc)
        }

        // NOTE: need to load the doc to get attachments
        const componentDocument = (await collection
          .findOne(doc)
          .exec()) as ComponentDocument

        if (!componentDocument) {
          return null
        }

        const component = await getComponentFromDoc(componentDocument)

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
      'sessionID',
      'createdAt',
      'updatedAt',
      'project',
      'manuscript',
      'owners',
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
      JSON.stringify(componentKeys) !== JSON.stringify(previousComponentKeys)
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

  private handleChange = (state: EditorState) => {
    // if (!this.state.dirty) {
    //   this.setState({ dirty: true })
    // }

    this.setState({
      dirty: true,
      doc: state.doc,
    })

    window.requestIdleCallback(() => this.debouncedSaveComponents(state), {
      timeout: 5000, // maximum wait for idle
    })
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

    const id = this.props.match.params.id

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
          switch (component.objectType) {
            case ObjectTypes.SECTION:
              output.sections.push(component)
              break

            case ObjectTypes.BIBLIOGRAPHY_ELEMENT:
            case ObjectTypes.PARAGRAPH_ELEMENT:
            case ObjectTypes.LIST_ELEMENT:
            case ObjectTypes.LISTING_ELEMENT:
            case ObjectTypes.EQUATION_ELEMENT:
            case ObjectTypes.FIGURE_ELEMENT:
            case ObjectTypes.TABLE_ELEMENT:
              output.elements.push(component)
              break

            default:
              output.dependencies.push(component)
              break
          }

          return output
        },
        changedComponentsObject
      )

      await Promise.all(
        changedComponentsByType.dependencies.map((component: AnyComponent) =>
          saveComponent(id, component)
        )
      )

      await Promise.all(
        changedComponentsByType.elements.map((component: AnyComponent) =>
          saveComponent(id, component)
        )
      )

      await Promise.all(
        changedComponentsByType.sections.map((component: AnyComponent) =>
          saveComponent(id, component)
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
