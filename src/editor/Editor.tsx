import { History, UnregisterCallback } from 'history'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import {
  EditorState,
  NodeSelection,
  TextSelection,
  Transaction,
} from 'prosemirror-state'
import { Step } from 'prosemirror-transform'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import React from 'react'
import MetadataContainer from '../components/metadata/MetadataContainer'
import { ApplicationMenu } from '../components/projects/ApplicationMenu'
import { Build } from '../lib/commands'
import { Conflict, LocalConflicts } from '../lib/conflicts'
import { styled } from '../theme'
import {
  BibliographyItem,
  Manuscript,
  Model,
  UserProfile,
} from '../types/models'
import menus from './config/menus'
import plugins from './config/plugins'
import schema from './config/schema'
import toolbar from './config/toolbar'
import views from './config/views'
import { transformPasted } from './lib/paste'
import PopperManager from './lib/popper'
import './styles/Editor.css'
import './styles/popper.css'
import Toolbar from './Toolbar'

export type ChangeReceiver = (
  op: string,
  id: string,
  data?: ProsemirrorNode | null
) => void

export interface HydratedNodes {
  current: ProsemirrorNode
  ancestor: ProsemirrorNode
  local: ProsemirrorNode
}

export type ApplyLocalStep = (
  conflict: Conflict,
  isFinalConflict: boolean
) => Promise<LocalConflicts>

export type ApplyRemoteStep = (
  conflict: Conflict,
  hydratedNodes: HydratedNodes,
  step: Step,
  isFinalConflict: boolean
) => Promise<LocalConflicts>

export interface EditorProps {
  attributes?: { [key: string]: string }
  autoFocus?: boolean
  getCitationProcessor: () => Citeproc.Processor
  doc: ProsemirrorNode
  editable?: boolean
  getModel: <T extends Model>(id: string) => T | undefined
  saveModel: <T extends Model>(model: Build<T>) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  applyLocalStep: ApplyLocalStep
  applyRemoteStep: ApplyRemoteStep
  getLibraryItem: (id: string) => BibliographyItem
  getManuscript: () => Manuscript
  saveManuscript?: (manuscript: Partial<Manuscript>) => Promise<void>
  addManuscript?: () => Promise<void>
  deleteManuscript: (id: string) => Promise<void>
  importManuscript: (models: Model[]) => Promise<void>
  exportManuscript: (format: string) => Promise<void>
  locale: string
  onChange?: (state: EditorState, docChanged: boolean) => void
  subscribe?: (receive: ChangeReceiver) => void
  modelMap: Map<string, Model>
  popper: PopperManager
  setView?: (view: EditorView) => void
  manuscript: Manuscript
  projectID: string
  getCurrentUser: () => UserProfile
  history: History
  handleSectionChange: (section: string) => void
}

interface State {
  state: EditorState | null
}

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 16px;
  overflow: hidden;
  padding-left: 30px;
`

const EditorHeader = styled.div`
  width: 100%;
  padding: 5px 24px;
  background: white;
`

const EditorBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
`

// TODO: pass updated components from the database to plugins, without re-rendering the editor

class Editor extends React.Component<EditorProps, State> {
  public state: Readonly<State> = {
    state: null,
  }

  private view: EditorView

  private unregisterHistoryListener: UnregisterCallback

  constructor(props: EditorProps) {
    super(props)
  }

  public componentDidMount() {
    this.setState({
      state: EditorState.create({
        doc: this.props.doc,
        schema,
        plugins: plugins(this.props),
      }),
    })

    this.unregisterHistoryListener = this.props.history.listen(
      this.handleHistoryChange
    )
  }

  public componentWillUnmount() {
    this.unregisterHistoryListener()
  }

  public render() {
    const { state } = this.state

    if (!state) return null

    return (
      <EditorContainer>
        {this.props.editable && (
          <EditorHeader>
            <ApplicationMenu
              menus={menus(this.props)}
              state={state}
              view={this.view}
            />

            <Toolbar toolbar={toolbar} state={state} view={this.view} />
          </EditorHeader>
        )}

        <EditorBody>
          <MetadataContainer
            modelMap={this.props.modelMap}
            saveManuscript={this.props.saveManuscript}
            manuscript={this.props.manuscript}
            saveModel={this.props.saveModel}
            deleteModel={this.props.deleteModel}
            handleSectionChange={this.props.handleSectionChange}
          />
          <div ref={this.createEditorView} />
        </EditorBody>
      </EditorContainer>
    )
  }

  private createEditorView = (node: HTMLDivElement) => {
    if (!this.view) {
      const editable = Boolean(this.props.editable)
      const state = this.state.state as EditorState

      this.view = new EditorView(node, {
        editable: () => editable,
        state,
        dispatchTransaction: this.dispatchTransaction,
        nodeViews: views(this.props),
        attributes: this.props.attributes,
        transformPasted,
      })

      if (this.props.subscribe) {
        this.props.subscribe(this.receive)
      }

      if (this.props.onChange) {
        this.props.onChange(state, false)
      }

      if (this.props.setView) {
        this.props.setView(this.view)
      }

      // dispatch a transaction so that plugins run
      this.view.dispatch(state.tr.setMeta('update', true))

      if (this.props.autoFocus) {
        this.view.focus()
      }

      this.handleHistoryChange()
    }
  }

  private dispatchTransaction = (
    transaction: Transaction,
    external: boolean = false
  ) => {
    const { state, transactions } = this.view.state.applyTransaction(
      transaction
    )
    this.view.updateState(state)
    this.setState({ state })

    if (!external) {
      if (this.props.onChange) {
        this.props.onChange(state, transactions.some(tr => tr.docChanged))
      }
    }
  }

  private receive: ChangeReceiver = (op, id, newNode) => {
    const { state } = this.view

    if (!id) {
      return
    }

    console.log({ op, id, newNode }) // tslint:disable-line:no-console

    switch (op) {
      case 'INSERT':
        if (!newNode) {
          // tell the editor to update
          return this.dispatchTransaction(
            state.tr.setMeta('update', true),
            true
          )
        }

        switch (newNode.type.name) {
          // TODO: can anything else be inserted by itself?
          // TODO: subsections! need to use the path
          case 'section':
            // +1 for manuscript
            const sectionIndex = newNode.attrs.priority + 1

            state.doc.forEach((node, offset, index) => {
              if (index === sectionIndex) {
                this.dispatchTransaction(state.tr.insert(offset, newNode), true)
                return false
              }
            })

            // TODO: insert at the end if no matching index? Should already be ok because of bibliography section?
            break
        }
        break

      case 'UPDATE':
        if (!newNode) {
          // tell the editor to update
          return this.dispatchTransaction(
            state.tr.setMeta('update', true),
            true
          )
        }

        // TODO: add to a waitlist if child nodes aren't in the map yet?
        // TODO: make sure there aren't any local edits since saving?
        state.doc.descendants((node, pos) => {
          let tr = state.tr

          if (node.attrs.id === id) {
            // TODO: only do this if attributes changed?
            tr = tr.setNodeMarkup(pos, undefined, newNode.attrs) // TODO: merge attrs?

            // from https://prosemirror.net/examples/footnote/
            const start = newNode.content.findDiffStart(node.content)

            if (typeof start === 'number') {
              // tslint:disable-next-line:no-any - TODO: remove once types are fixed
              const diffEnd = newNode.content.findDiffEnd(node.content as any)

              if (diffEnd) {
                let { a: newNodeDiffEnd, b: nodeDiffEnd } = diffEnd

                const overlap = start - Math.min(nodeDiffEnd, newNodeDiffEnd)

                if (overlap > 0) {
                  nodeDiffEnd += overlap
                  newNodeDiffEnd += overlap
                }

                tr = state.tr.replace(
                  pos + start + 1,
                  pos + nodeDiffEnd + 1,
                  newNode.slice(start, newNodeDiffEnd)
                )
              }
            }

            // tr = tr.replaceWith(pos, pos + node.nodeSize, newNode)

            tr = tr.setMeta('addToHistory', false)

            this.dispatchTransaction(tr, true)
            // this.view.dispatch(tr)

            return false
          }
        })
        break

      case 'REMOVE':
        state.doc.descendants((node, pos) => {
          if (node.attrs.id === id) {
            const tr = state.tr
              .delete(pos, pos + node.nodeSize)
              .setMeta('addToHistory', false)

            this.dispatchTransaction(tr, true)
            // this.view.dispatch(tr)

            return false
          }
        })
        break
    }

    // TODO: find the updated node and replace it
    // TODO: find the deleted node and delete it
    // TODO: add an added component
  }

  private handleHistoryChange = () => {
    this.focusNodeWithId(location.hash.substring(1))
  }

  private focusNodeWithId(id: string) {
    if (!id || !this.view) return

    const { state } = this.view

    state.doc.descendants((node, pos) => {
      if (node.attrs.id === id) {
        this.view.focus()

        const selection = node.isAtom
          ? NodeSelection.create(state.doc, pos)
          : TextSelection.near(state.doc.resolve(pos + 1))

        this.dispatchTransaction(state.tr.setSelection(selection))

        const dom = this.view.domAtPos(pos + 1)

        if (dom.node instanceof Element) {
          dom.node.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          })
        }

        return false
      }
    })
  }
}

export default Editor
