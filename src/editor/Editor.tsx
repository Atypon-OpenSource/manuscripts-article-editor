import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import * as React from 'react'
import 'typeface-charis-sil/index.css'
import { options } from './config'
import { Dispatch } from './config/types'
import './Editor.css'

export interface EditorProps {
  value: string | null
  onChange: (f: string) => void
  autoFocus?: boolean
  setActive: (s: EditorState, d: Dispatch) => void
}

interface ComponentState {
  state: EditorState
  active: boolean
}

class Editor extends React.Component<EditorProps> {
  public state: Readonly<ComponentState>

  private view: EditorView

  constructor(props: EditorProps) {
    super(props)

    this.state = {
      state: EditorState.create({
        ...options,
        doc: this.deserialize(props.value),
      }),
      active: Boolean(props.autoFocus),
    }
  }

  public createEditorView = (node: Node) => {
    if (!this.view) {
      this.view = new EditorView(node, {
        state: this.state.state,
        dispatchTransaction: this.dispatchTransaction,
      })

      if (this.props.autoFocus) {
        this.view.focus()
        this.props.setActive(this.state.state, this.dispatchTransaction)
      }
    }
  }

  public dispatchTransaction = (transaction: Transaction) => {
    const state = this.view.state.apply(transaction)
    this.view.updateState(state)
    this.setState({ state })

    if (this.state.active) {
      this.props.setActive(state, this.dispatchTransaction)
    }

    this.props.onChange(this.serialize(state))
  }

  public render() {
    return (
      <div
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        ref={node => this.createEditorView(node as HTMLDivElement)}
      />
    )
  }

  private handleFocus = () => {
    this.setState({
      active: true,
    })
  }

  private handleBlur = () => {
    this.setState({
      active: false,
    })
  }

  private deserialize = (value: string | null) => {
    if (!value) return null

    return ProsemirrorNode.fromJSON(options.schema, JSON.parse(value))
  }

  private serialize = (state: EditorState) => {
    return JSON.stringify(state.doc.toJSON())
  }
}

export default Editor
