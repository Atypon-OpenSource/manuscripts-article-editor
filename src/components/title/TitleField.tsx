/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'

import { parse } from './Parse'
import { plugins } from './Plugins'
import { schema, TitleEditorView } from './Schema'
import { serialize } from './Serialize'
import { Title, TitleProps } from './Title'

interface Props extends TitleProps {
  handleChange?: (value: string) => void
  handleFocused?: (focused: boolean) => void
  handleStateChange?: (view: TitleEditorView, docChanged: boolean) => void
  editable?: boolean
}

export class TitleField extends Title<Props> {
  public constructor(props: Props) {
    super(props)

    this.editorRef = React.createRef()

    const attributes: { [name: string]: string } = {
      class: 'plain title-editor',
    }

    if ('tabIndex' in this.props) {
      attributes.tabindex = String(this.props.tabIndex)
    }

    this.view = new EditorView(null, {
      attributes,
      editable: () =>
        this.props.editable === undefined ? true : this.props.editable,
      dispatchTransaction: (transaction) => {
        const { state, transactions } =
          this.view.state.applyTransaction(transaction)

        this.view.updateState(state)
        this.updateClassList()

        const docChanged = transactions.some((tr) => tr.docChanged)

        if (this.props.handleStateChange) {
          this.props.handleStateChange(this.view, docChanged)
        }

        // TODO: debounce this to reduce serialization
        if (this.props.handleChange && docChanged) {
          this.props.handleChange(serialize(state.doc))
        }
      },
      handleDOMEvents: {
        blur: () => {
          if (this.props.handleFocused) {
            this.props.handleFocused(false)
          }

          return false
        },
        focus: (view) => {
          if (this.props.handleStateChange) {
            this.props.handleStateChange(view, false)
          }

          if (this.props.handleFocused) {
            this.props.handleFocused(true)
          }

          return false
        },
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter') {
          const element = this.view.dom as HTMLDivElement
          element.blur()
          return true
        }

        return false
      },
      state: EditorState.create({
        doc: parse(props.value),
        plugins,
        schema,
      }),
    })
  }

  public componentDidMount() {
    if (this.editorRef.current) {
      this.editorRef.current.appendChild(this.view.dom)
    }

    this.updateClassList()

    if (this.props.autoFocus) {
      this.view.focus()
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (!this.view.hasFocus()) {
      this.view.updateState(
        EditorState.create({
          doc: parse(nextProps.value),
          plugins: this.view.state.plugins,
          schema: this.view.state.schema,
        })
      )
      this.updateClassList()
    }
  }
}
