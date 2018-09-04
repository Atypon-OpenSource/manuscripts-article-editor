import { EditorState, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { styled } from '../../theme'

import {
  createDoc,
  CreateKeyword,
  GetCollaborators,
  GetKeywords,
  parse,
  plugins,
  serialize,
} from './config'
import { createEditableKeywordView } from './views/KeywordView'
import { createEditableMentionView } from './views/MentionView'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  getCollaborators: GetCollaborators
  getKeywords: GetKeywords
  createKeyword: CreateKeyword
  value: string
  handleChange: (contents: string) => void
}

export class CommentEditor extends React.Component<Props> {
  protected view: EditorView

  public render() {
    return (
      <div
        ref={this.createEditorView}
        className={this.props.className}
        id={this.props.id}
      />
    )
  }

  protected createEditorState = (value: string) => {
    const doc = value ? parse(value) : createDoc()

    // put selection at end of comment
    const selection = TextSelection.create(doc, doc.nodeSize - 2)

    return EditorState.create({
      doc,
      plugins,
      selection,
    })
  }

  protected createEditorView = (node: HTMLDivElement) => {
    if (!this.view) {
      this.view = new EditorView(node, {
        state: this.createEditorState(this.props.value),
        dispatchTransaction: this.dispatchTransaction,
        attributes: {
          class: 'comment-editor',
        },
        nodeViews: {
          keyword: createEditableKeywordView(
            this.props.getKeywords,
            this.props.createKeyword
          ),
          mention: createEditableMentionView(this.props.getCollaborators),
        },
      })

      this.view.focus()
    }
  }

  private dispatchTransaction = (tr: Transaction) => {
    const state = this.view.state.apply(tr)
    this.view.updateState(state)

    if (this.props.handleChange) {
      this.props.handleChange(serialize(state.doc))
    }
  }
}

export const StyledCommentEditor = styled(CommentEditor)`
  flex: 1;

  & .ProseMirror {
    cursor: text;
    font-family: 'Barlow', sans-serif;
    line-height: 1.06;
    letter-spacing: -0.2px;
    color: #444;
    margin: 8px 0;

    &:focus {
      outline: none;
    }

    & p:first-child {
      margin-top: 0;
    }

    & p:last-child {
      margin-bottom: 0;
    }

    & blockquote {
      margin: 10px 0;
      border-left: 4px solid #faed98;
      padding-left: 1em;
      font-size: 12px;
      font-style: italic;
      line-height: 1.17;
      letter-spacing: -0.2px;
      color: #b7b7b7;
    }
  }
`
