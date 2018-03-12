import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import * as React from 'react'
import 'typeface-charis-sil/index.css'
import { styled } from '../theme'
import { menu, options } from './config'
import './Editor.css'
import MenuBar from './MenuBar'

export interface EditorProps {
  autoFocus?: boolean
  doc: ProsemirrorNode | null
  editable?: boolean
  onChange?: (N: ProsemirrorNode) => void
}

interface ComponentState {
  state: EditorState
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

class Editor extends React.Component<EditorProps> {
  public state: Readonly<ComponentState>

  private view: EditorView

  constructor(props: EditorProps) {
    super(props)

    // TODO: add a plugin that saves new blocks and gives them an id, appending to the transaction. handle removed blocks, too.
    // TODO: do all the saving in this plugin?

    this.state = {
      state: EditorState.create({
        doc: props.doc,
        schema: options.schema,
        plugins: options.plugins,
      }),
    }
  }

  public render() {
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
          <div ref={node => this.createEditorView(node as HTMLDivElement)} />
        </EditorBody>
      </EditorContainer>
    )
  }

  private createEditorView = (node: Node) => {
    const editable = Boolean(this.props.editable)

    if (!this.view) {
      this.view = new EditorView(node, {
        editable: () => editable,
        state: this.state.state,
        dispatchTransaction: this.dispatchTransaction,
        nodeViews: options.nodeViews,
      })

      if (this.props.autoFocus) {
        this.view.focus()
      }
    }
  }

  private dispatchTransaction = (transaction: Transaction) => {
    const state = this.view.state.apply(transaction)
    this.view.updateState(state)
    this.setState({ state })

    if (this.props.onChange) {
      this.props.onChange(state.doc)
    }
  }
}

export default Editor
