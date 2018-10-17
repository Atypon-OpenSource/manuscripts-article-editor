import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { serialize } from './config'
import { createEditorState, default as Title } from './Title'

export class TitleField extends Title {
  protected createEditorView = (node: HTMLDivElement) => {
    const attributes: { [name: string]: string } = {
      class: 'plain title-editor',
    }

    if (typeof this.props.tabIndex !== 'undefined') {
      attributes.tabindex = String(this.props.tabIndex)
    }

    this.view = new EditorView(node, {
      state: createEditorState(this.props.value || ''),
      dispatchTransaction: this.dispatchTransaction,
      attributes,
      handleDOMEvents: {
        focus: this.handleFocus,
      },
      handleKeyDown: this.handleKeyDown,
    })

    if (this.props.autoFocus) {
      this.view.focus()
    }
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

  private handleFocus = (view: EditorView, event: Event) => {
    return this.props.handleFocus ? this.props.handleFocus(view, event) : false
  }

  private handleKeyDown = (view: EditorView, event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      ;(this.view.dom as HTMLDivElement).blur()
      return true
    }

    return false
  }
}
