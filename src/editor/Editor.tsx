import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import React from 'react'
import 'typeface-charis-sil/index.css'
import { styled } from '../theme'
import {
  AnyComponent,
  BibliographyItem,
  Component,
  ComponentMap,
  Manuscript,
} from '../types/components'
import { menu, options } from './config'
import PopperManager from './lib/popper'
import MenuBar from './MenuBar'
import './styles/Editor.css'
import './styles/popper.css'

export type ChangeReceiver = (
  op: string,
  id: string,
  data?: ProsemirrorNode | null
) => void
export type GetComponent = <T extends AnyComponent>(id: string) => T
export type SaveComponent = (component: Component) => Promise<void>
export type DeleteComponent = (id: string) => Promise<string>

export interface EditorProps {
  attributes?: { [key: string]: string }
  autoFocus?: boolean
  getCitationProcessor: () => Citeproc.Processor
  doc: ProsemirrorNode
  editable?: boolean
  getComponent: GetComponent
  saveComponent?: SaveComponent
  deleteComponent?: DeleteComponent
  getLibraryItem: (id: string) => BibliographyItem
  getManuscript: () => Manuscript
  locale: string
  onChange?: (state: EditorState) => void
  subscribe?: (receive: ChangeReceiver) => void
  componentMap: ComponentMap
  popper: PopperManager
  setView?: (view: EditorView) => void
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
  right: 0;
  overflow: hidden;
`

const EditorHeader = styled.div`
  width: 100%;
  padding: 5px;
  background: white;
`

const EditorBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 40px;
`

// TODO: pass updated components from the database to plugins, without re-rendering the editor

class Editor extends React.Component<EditorProps, State> {
  public state: Readonly<State> = {
    state: null,
  }

  private view: EditorView

  constructor(props: EditorProps) {
    super(props)
  }

  public componentDidMount() {
    this.setState({
      state: EditorState.create({
        doc: this.props.doc,
        schema: options.schema,
        plugins: options.plugins(this.props),
      }),
    })
  }

  public render() {
    if (!this.state.state) return null

    return (
      <EditorContainer>
        {this.props.editable && (
          <EditorHeader>
            <MenuBar
              menu={menu}
              state={this.state.state}
              dispatch={this.dispatchTransaction}
            />
          </EditorHeader>
        )}

        <EditorBody>
          <div ref={this.createEditorView} />
        </EditorBody>
      </EditorContainer>
    )
  }

  private createEditorView = (node: HTMLDivElement) => {
    const editable = Boolean(this.props.editable)
    const state = this.state.state as EditorState

    if (!this.view) {
      this.view = new EditorView(node, {
        editable: () => editable,
        state,
        dispatchTransaction: this.dispatchTransaction,
        nodeViews: options.nodeViews(this.props),
        attributes: this.props.attributes,
      })

      // dispatch a transaction so that plugins run
      this.view.dispatch(this.view.state.tr.setMeta('update', true))

      if (this.props.autoFocus) {
        this.view.focus()
      }

      if (this.props.subscribe) {
        this.props.subscribe(this.receive)
      }

      if (this.props.onChange) {
        this.props.onChange(state)
      }

      if (this.props.setView) {
        this.props.setView(this.view)
      }
    }
  }

  private dispatchTransaction = (
    transaction: Transaction,
    external: boolean = false
  ) => {
    const state = this.view.state.apply(transaction)
    this.view.updateState(state)
    this.setState({ state })

    if (this.props.onChange) {
      if (!external && transaction.docChanged) {
        this.props.onChange(state)
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
              const diffEnd = newNode.content.findDiffEnd(node.content as any) // tslint:disable-line:no-any - TODO: remove once types are fixed

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
}

export default Editor
