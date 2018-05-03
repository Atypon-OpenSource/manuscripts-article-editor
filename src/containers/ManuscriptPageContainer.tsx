import debounce from 'lodash-es/debounce'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { Prompt, Route, RouteComponentProps, RouteProps } from 'react-router'
import { Subscription } from 'rxjs/Subscription'
import { DropSide, TreeItem } from '../components/DraggableTree'
import { IconBar, Main, Page } from '../components/Page'
import Panel from '../components/Panel'
import Editor, {
  ChangeReceiver,
  DeleteComponent,
  GetComponent,
  SaveComponent,
} from '../editor/Editor'
import PopperManager from '../editor/lib/popper'
import Spinner from '../icons/spinner'
import CitationManager from '../lib/csl'
import { AnyComponentChangeEvent } from '../lib/rxdb'
import sessionID from '../lib/sessionID'
import {
  ComponentObject,
  ComponentsProps,
  withComponents,
} from '../store/ComponentsProvider'
import { IntlProps, withIntl } from '../store/IntlProvider'
import { Decoder, encode } from '../transformer'
import { buildComponentMap, getComponentFromDoc } from '../transformer/decode'
import { documentObjectTypes } from '../transformer/document-object-types'
import * as ObjectTypes from '../transformer/object-types'
import {
  AnyComponent,
  ComponentCollection,
  ComponentDocument,
  ComponentIdSet,
  ComponentMap,
  ComponentWithAttachment,
} from '../types/components'
import InspectorContainer from './InspectorContainer'
import ManuscriptSidebarContainer from './ManuscriptSidebarContainer'

interface ComponentIdSets {
  [key: string]: ComponentIdSet
}

interface State {
  citationProcessor: Citeproc.Processor | null
  citationStyle: string
  componentIds: ComponentIdSets
  componentMap: ComponentMap
  dirty: boolean
  doc: ProsemirrorNode | null
  error: string | null
  locale: string
  popper: PopperManager
  view: EditorView | null
}

interface ComponentProps {
  id: string
}

interface ComponentRoute extends Route<RouteProps> {
  id: string
}

type Props = ComponentProps &
  ComponentsProps &
  RouteComponentProps<ComponentRoute> &
  IntlProps

class ManuscriptPageContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    citationProcessor: null,
    citationStyle: 'apa', // TODO: citation style switcher
    componentIds: {
      document: new Set(),
      data: new Set(),
    },
    componentMap: new Map(),
    dirty: false,
    doc: null,
    error: null,
    locale: 'en-GB', // TODO: per-document locale switcher
    popper: new PopperManager(),
    view: null,
  }

  private subs: Subscription[] = []

  private readonly debouncedSaveComponents: (state: EditorState) => void

  public constructor(props: Props) {
    super(props)

    this.debouncedSaveComponents = debounce(this.saveComponents, 1000, {
      maxWait: 5000,
    })
  }

  public async componentDidMount() {
    const { id } = this.props.match.params
    const { locale } = this.props.intl
    const { findManuscriptComponents } = this.props.components
    const { citationStyle } = this.state

    window.addEventListener('beforeunload', this.unloadListener)

    try {
      const components = (await findManuscriptComponents(
        id
      ).exec()) as ComponentDocument[]

      if (!components.length) {
        throw new Error('Manuscript not found')
      }

      const componentMap = await buildComponentMap(components)

      const decoder = new Decoder(componentMap)

      const citationManager = new CitationManager()

      const doc = decoder.createArticleNode()

      // encode again here to get doc component ids for comparison
      const encodedComponentMap = encode(doc)
      const componentIds = this.buildComponentIds(encodedComponentMap)

      this.setState({
        citationProcessor: await citationManager.createProcessor(
          citationStyle,
          locale,
          this.getComponent
        ),
        componentIds,
        componentMap,
        doc,
      })
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
      this.setState({
        error: error.message,
      })
    }
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.state.popper.destroy()
    window.removeEventListener('beforeunload', this.unloadListener)
  }

  public render() {
    const {
      dirty,
      citationProcessor,
      componentMap,
      doc,
      locale,
      popper,
    } = this.state

    if (!doc || !citationProcessor) {
      return <Spinner />
    }

    return (
      <Page>
        <IconBar />

        <ManuscriptSidebarContainer doc={doc} onDrop={this.handleDrop} />

        <Main>
          <Editor
            autoFocus={true}
            citationProcessor={citationProcessor}
            doc={doc}
            editable={true}
            getComponent={this.getComponent}
            saveComponent={this.saveComponent}
            deleteComponent={this.deleteComponent}
            locale={locale}
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
          <InspectorContainer />
        </Panel>
      </Page>
    )
  }

  private setView = (view: EditorView) => {
    this.setState({ view })
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

    const { src, attachment, ...data } = component

    // TODO: data.contents = serialized DOM wrapper for bibliography

    const savedDoc = await saveComponent(id, data)

    if (attachment) {
      await savedDoc.putAttachment(attachment)
      delete component.attachment // TODO: is this really deleted now?
    }
  }

  private deleteComponent: DeleteComponent = (id: string) => {
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

    const collection = this.props.components.collection as ComponentCollection

    const sub = collection.$.subscribe(
      async (changeEvent: AnyComponentChangeEvent) => {
        const op = changeEvent.data.op
        const doc = changeEvent.data.doc
        const v = changeEvent.data.v as AnyComponent

        if (!v || !doc || !op) {
          throw new Error('Unexpected change event data')
        }

        if (v.manuscript !== id) return false // ignore changes to other manuscripts

        if (v.sessionID === sessionID) return false // ignore our changes

        console.log({ op, doc }) // tslint:disable-line:no-console

        if (op === 'REMOVE') {
          return receive(op, doc)
        }

        // NOTE: need to load the doc to get attachments
        const componentDocument = (await collection
          .findOne(doc)
          .exec()) as ComponentDocument

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

  private hasChanged = (component: ComponentObject): boolean => {
    const previousComponent = this.getComponent(component.id) as ComponentObject

    if (!previousComponent) return true

    const componentKeys = Object.keys(component)
    const previousComponentKeys = Object.keys(previousComponent)

    // TODO: ignore keys not stored in the component: createdAt, updatedAt, etc

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

    // TODO: make sure the manuscript element's ID doesn't change

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

export default withComponents(withIntl(ManuscriptPageContainer))
