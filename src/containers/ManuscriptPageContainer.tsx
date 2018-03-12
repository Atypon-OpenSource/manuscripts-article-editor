import { debounce } from 'lodash'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import * as React from 'react'
import { Prompt, Route, RouteComponentProps, RouteProps } from 'react-router'
// import { RxDocument } from 'rxdb'
// import { Subscription } from 'rxjs'
import { Db, waitForDB } from '../db'
import Editor from '../editor/Editor'
import Spinner from '../icons/spinner'
import { decode, encode } from '../transformer'
import { Component } from '../types/components'

type ComponentIdSet = Set<string>

interface ManuscriptPageContainerState {
  componentIds: ComponentIdSet | null
  dirty: boolean
  doc: ProsemirrorNode | null
}

interface ManuscriptPageContainerProps {
  id: string
}

interface ManuscriptPageRoute extends Route<RouteProps> {
  id: string
}

type ComponentProps = ManuscriptPageContainerProps &
  RouteComponentProps<ManuscriptPageRoute>

class ManuscriptPageContainer extends React.Component<ComponentProps> {
  public state: ManuscriptPageContainerState = {
    componentIds: null,
    dirty: false,
    doc: null,
  }

  // private subs: Subscription[] = []

  private db: Db

  private debouncedSaveComponents: (doc: ProsemirrorNode) => void

  public constructor(props: ComponentProps) {
    super(props)

    this.debouncedSaveComponents = debounce(this.saveComponents, 1000, {
      maxWait: 5000,
    })
  }

  public componentDidMount() {
    const { id } = this.props.match.params

    window.addEventListener('beforeunload', this.unloadListener)

    waitForDB
      .then(db => {
        this.db = db

        // TODO: subscribe to the query and do _something_ when updates come in

        // this.subs.push(
        db.components
          .find()
          .where('manuscript')
          .eq(id)
          // .$.subscribe(components => {
          .exec()
          .then(components => {
            const doc = decode(components)
            const componentIds = this.buildComponentIdSet(components)

            this.setState({ doc, componentIds })
          })
        // )
      })
      .catch((error: Error) => {
        this.setState({
          error: error.message,
        })
      })
  }

  public componentWillUnmount() {
    // this.subs.forEach(sub => sub.unsubscribe())
    window.removeEventListener('beforeunload', this.unloadListener)
  }

  public render() {
    const { doc, dirty } = this.state

    if (!doc) {
      return <Spinner />
    }

    // TODO: also prompt on beforeunload

    return (
      <React.Fragment>
        <Editor
          autoFocus={true}
          editable={true}
          doc={doc}
          onChange={this.handleChange}
        />
        <Prompt when={dirty} message={() => false} />
      </React.Fragment>
    )
  }

  // NOTE: can only _return_ the boolean value when using "onbeforeunload"!
  private unloadListener: EventListener = (event: Event) => {
    if (this.state.dirty) {
      event.returnValue = true // can only be set to a boolean
    }
  }

  private buildComponentIdSet = (components: Component[]) => {
    return components.reduce((output: ComponentIdSet, component: Component) => {
      output.add(component.id)
      return output
    }, new Set())
  }

  private removedComponentIds = (componentIds: ComponentIdSet) =>
    Array.from(this.state.componentIds as ComponentIdSet).filter(id => {
      return !componentIds.has(id)
    })

  private handleChange = (doc: ProsemirrorNode) => {
    this.setState({ dirty: true })
    this.debouncedSaveComponents(doc)
  }

  private saveComponents = (doc: ProsemirrorNode) => {
    const id = this.props.match.params.id

    // console.log('encoding') // tslint:disable-line

    const components = encode(doc)
    const componentIds = this.buildComponentIdSet(components)

    // console.log(components) // tslint:disable-line

    // TODO: diff with the previous state and only save changed components

    // console.log('saving') // tslint:disable-line

    const collection = this.db.components

    const requests = components.map(component => {
      component.manuscript = id

      return collection.atomicUpsert(component).then(() => true)
    })

    // TODO: mark the document as "deleted" instead of removing it?

    const removeComponent = (id: string) =>
      collection
        .findOne(id)
        .exec()
        .then(component => (component ? component.remove() : false))

    const removedRequests = this.removedComponentIds(componentIds).map(
      removeComponent
    )

    Promise.all([...requests, ...removedRequests])
      .then(() => {
        this.setState({
          componentIds,
          dirty: false,
        })

        console.log('saved') // tslint:disable-line
      })
      .catch((error: Error) => {
        console.error(error) // tslint:disable-line
      })
  }
}

export default ManuscriptPageContainer
