import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { serialize } from './lib/title'
import { createEditorState, default as Title } from './Title'

class TitleField extends Title {
  protected createEditorView = (node: HTMLDivElement) => {
    this.view = new EditorView(node, {
      state: createEditorState(this.props.value),
      dispatchTransaction: this.dispatchTransaction,
      attributes: {
        class: 'plain',
      },
    })
  }

  private dispatchTransaction = (tr: Transaction) => {
    const state = this.view.state.apply(tr)
    this.view.updateState(state)

    const value = serialize(state.doc.firstChild as ProsemirrorNode)
    this.setState({ value })

    if (this.props.handleChange) {
      this.props.handleChange(value)
    }
  }
}

export default TitleField
