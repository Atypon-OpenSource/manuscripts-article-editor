import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { styled } from '../../theme'
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
      state: createEditorState(this.props.value),
      dispatchTransaction: this.dispatchTransaction,
      attributes,
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
}

export const StyledTitleField = styled(TitleField)`
  flex: 1;

  & .ProseMirror {
    cursor: text;
    font-family: 'IBM Plex Sans', sans-serif;
    line-height: 1.3;

    &:focus {
      outline: none;
    }

    & .empty-node::before {
      position: absolute;
      color: #ccc;
      cursor: text;
      content: 'Title';
      pointer-events: none;
    }

    & .empty-node:hover::before {
      color: #999;
    }
  }
`
