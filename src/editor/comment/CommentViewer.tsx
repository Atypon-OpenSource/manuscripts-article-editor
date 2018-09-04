import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { styled } from '../../theme'
import { createDoc, GetKeyword, GetUser, parse } from './config'
import { createKeywordView } from './views/KeywordView'
import { createMentionView } from './views/MentionView'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string
  value: string
  getUser: GetUser
  getKeyword: GetKeyword
}

export class CommentViewer extends React.Component<Props> {
  protected view: EditorView

  public componentWillReceiveProps(nextProps: Props) {
    if (this.view && nextProps.value !== this.props.value) {
      const state = this.createEditorState(nextProps.value)
      this.view.updateState(state)
    }
  }

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

    return EditorState.create({ doc })
  }

  protected createEditorView = (node: HTMLDivElement) => {
    if (!node) return

    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }

    this.view = new EditorView(node, {
      state: this.createEditorState(this.props.value),
      editable: () => false,
      attributes: {
        class: 'comment-viewer',
      },
      nodeViews: {
        keyword: createKeywordView(this.props.getKeyword),
        mention: createMentionView(this.props.getUser),
      },
    })
  }
}

export const StyledCommentViewer = styled(CommentViewer)`
  flex: 1;

  & .ProseMirror {
    font-family: 'Barlow', sans-serif;
    line-height: 1.06;
    letter-spacing: -0.2px;
    color: #666;
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
