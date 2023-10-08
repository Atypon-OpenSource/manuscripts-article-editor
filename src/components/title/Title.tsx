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
import { schema } from './Schema'

export interface TitleProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string
  value?: string
}

export class Title<Props extends TitleProps> extends React.Component<Props> {
  protected editorRef: React.RefObject<HTMLDivElement>
  protected view: EditorView

  public constructor(props: Props) {
    super(props)

    this.editorRef = React.createRef()

    const attributes: { [name: string]: string } = {
      class: 'plain',
    }

    this.view = new EditorView(null, {
      attributes,
      editable: () => false,
      state: EditorState.create({
        doc: parse(props.value),
        schema,
      }),
    })
  }

  public componentDidMount() {
    if (this.editorRef.current) {
      this.editorRef.current.appendChild(this.view.dom)
    }

    this.updateClassList()
  }

  // eslint-disable-next-line react/no-deprecated
  public componentWillReceiveProps(nextProps: Props) {
    this.view.updateState(
      EditorState.create({
        doc: parse(nextProps.value),
        schema: this.view.state.schema,
      })
    )
    this.updateClassList()
  }

  public render() {
    return (
      <div
        className={this.props.className}
        id={this.props.id}
        ref={this.editorRef}
      />
    )
  }

  protected updateClassList() {
    this.view.dom.classList.toggle(
      'empty-node',
      this.view.state.doc.childCount === 0
    )
  }
}
