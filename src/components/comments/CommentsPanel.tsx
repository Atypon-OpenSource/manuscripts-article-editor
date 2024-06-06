/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */
import { updateNodeAttrs } from '@manuscripts/body-editor'
import { CheckboxField, CheckboxLabel } from '@manuscripts/style-guide'
import { schema } from '@manuscripts/transform'
import React, { useMemo, useState } from 'react'

import {
  buildCommentTrees,
  CommentAttrs,
  getComments,
} from '../../lib/comments'
import { useStore } from '../../store'
import { CommentThread } from './CommentThread'
import styled from "styled-components";

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px;
`

const CheckboxLabelText = styled.div`
  color: ${(props) => props.theme.colors.text.primary} !important;
`

export const CommentsPanel: React.FC = () => {
  const [{ doc, view, newComments }] = useStore((state) => ({
    doc: state.doc,
    view: state.view,
    newComments: state.newComments,
  }))

  const [selection, setSelection] = useState<string>()
  const [showResolved, setShowResolved] = useState(true)

  const comments = useMemo(() => getComments(doc), [doc])
  const trees = useMemo(
    () => [
    ...Array.from(newComments.values()).map((c) => ({
        comment: {
          id: c._id,
          target: c.target,
          selector: c.selector || {from: 0, to: 0},
          contributions: c.contributions,
          originalText: c.originalText,
          contents: c.contents,
          resolved: false
        },
        isNew: true,
        children: []
      })),
      ...buildCommentTrees([...comments.values()])],
    [comments, newComments]
  )

  const handleSave = (comment: CommentAttrs) => {
    updateNodeAttrs(view, schema.nodes.comments, comment)
  }

  const handleDelete = (id: string) => {
    const comment = comments.get(id)
    if (!comment) {
      return
    }
    const tr = view.state.tr
    tr.delete(comment.pos, comment.pos + comment.node.nodeSize)
    view.dispatch(tr)
  }

  return (
    <>
      <Header>
        <CheckboxLabel>
          <CheckboxField
            name={'show-resolved'}
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
          />
          <CheckboxLabelText>See resolved</CheckboxLabelText>
        </CheckboxLabel>
      </Header>
      {trees.filter((c) => showResolved || !c.comment.resolved).map((c) => (
        <CommentThread
          key={c.comment.id}
          tree={c}
          isSelected={selection === c.comment.id}
          onSelect={() => setSelection(c.comment.id)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      ))}
    </>
  )
}
