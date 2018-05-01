import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { parseContents } from '../transformer/decode'
import schema from './config/schema'

interface Props {
  title: string
}

class Title extends React.Component<Props> {
  private view: EditorView

  public render() {
    return <div ref={node => this.createEditorView(node as HTMLDivElement)} />
  }

  private createEditorView = (node: Node) => {
    const { title } = this.props

    const doc = title
      ? parseContents(`<h1>${title}</h1>`, {
          topNode: schema.nodes.title.create(),
        })
      : schema.nodes.title.create()

    const state = EditorState.create({ doc, schema })

    if (this.view) {
      this.view.updateState(state)
    } else {
      this.view = new EditorView(node, {
        editable: () => false,
        state,
        attributes: {
          class: 'plain',
        },
      })
    }
  }
}

export default Title
