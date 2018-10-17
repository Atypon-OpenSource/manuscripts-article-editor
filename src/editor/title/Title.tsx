import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { parse, plugins, schema } from './config'

export const createEditorState = (value: string) =>
  EditorState.create({
    doc: parse(value),
    schema,
    plugins,
  })

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string
  value?: string
  handleChange?: (value: string) => void
  handleFocus?: (view: EditorView, event: Event) => boolean
}

// interface State {
//   value: string
// }

class Title extends React.Component<Props> {
  // public state = {
  //   value: this.props.value,
  // }

  protected view: EditorView

  // public componentDidMount() {
  //   this.setState({
  //     value: this.props.value,
  //   })
  // }

  // TODO: enable this once it doesn't conflict with editing
  // public componentWillReceiveProps(nextProps: Props) {
  //   const value = nextProps.value
  //
  //   if (value !== this.state.value) {
  //     this.setState({ value })
  //
  //     if (this.view) {
  //       const state = createEditorState(value)
  //       this.view.updateState(state)
  //     }
  //   }
  // }

  public render() {
    return (
      <div
        ref={this.createEditorView}
        className={this.props.className}
        id={this.props.id}
      />
    )
  }

  protected createEditorView = (node: HTMLDivElement) => {
    if (!node) return

    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }

    this.view = new EditorView(node, {
      state: createEditorState(this.props.value || ''),
      editable: () => false,
      attributes: {
        class: 'plain',
      },
    })
  }
}

export default Title
