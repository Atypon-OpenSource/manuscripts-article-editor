import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { styled } from '../../theme'
import { serialize } from './lib/title'
import { createEditorState, default as Title } from './Title'

export class TitleField extends Title {
  protected createEditorView = (node: HTMLDivElement) => {
    this.view = new EditorView(node, {
      state: createEditorState(this.props.value),
      dispatchTransaction: this.dispatchTransaction,
      attributes: {
        class: 'plain',
        id: `${this.props.id}-title-field`,
      },
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
  & .ProseMirror {
    font-weight: bold;
    cursor: text;
    font-size: 200%;
    font-family: Charter, 'Charis SIL', serif;
    line-height: 1.3;

    &:focus {
      outline: none;
    }

    & .empty-node::before {
      position: absolute;
      color: #aaa;
      cursor: text;
      font-style: italic;
      content: 'Title';
    }
  }
`
