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

import {
  buildInlineStyle,
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptTransaction,
} from '@manuscripts/manuscript-transform'
import { InlineStyle } from '@manuscripts/manuscripts-json-schema'
import React, { useCallback } from 'react'
import { styled } from '../../theme/styled-components'
import { AddButton } from '../AddButton'
import { InspectorSection } from '../InspectorSection'
import { SaveModel } from '../projects/ManuscriptInspector'
import { InlineStyleItem } from './InlineStyleItem'

type Dispatch = (tr: ManuscriptTransaction) => void

const buildActiveStyleIDs = (state: ManuscriptEditorState): Set<string> => {
  const {
    schema,
    selection: { $from },
  } = state

  const output = new Set<string>()

  // TODO: stored marks?

  for (const mark of $from.marks()) {
    if (mark.type === schema.marks.styled) {
      output.add(mark.attrs.rid)
    }
  }

  return output
}

const addStyleMark = (
  rid: string,
  state: ManuscriptEditorState,
  dispatch: Dispatch
) => {
  const { tr, schema, selection } = state

  const { from, to } = selection

  // TODO: stored marks?

  // tr.removeMark(from, to, schema.marks.styled)

  // remove any existing mark
  // for (const mark of $from.marks()) {
  //   if (mark.type === schema.marks.styled) {
  //     tr.removeMark($from.start(), $from.end(), mark)
  //   }
  // }

  dispatch(tr.addMark(from, to, schema.marks.styled.create({ rid })))
}

const removeStyleMark = (
  rid: string,
  state: ManuscriptEditorState,
  dispatch: Dispatch
) => {
  const { tr, schema, selection } = state

  const { $from } = selection

  // TODO: stored marks?

  // TODO: need to look further up and remove the whole mark

  for (const mark of $from.marks()) {
    if (mark.type === schema.marks.styled && mark.attrs.rid === rid) {
      tr.removeMark($from.start(), $from.end(), mark)
    }
  }

  dispatch(tr)
}

const nextPriority = (inlineStyles: InlineStyle[]) =>
  inlineStyles.reduce((max, style) => {
    return Math.max(max, style.priority || 0)
  }, 0)

export const InlineStyles: React.FC<{
  inlineStyles: InlineStyle[]
  deleteModel: (id: string) => Promise<string>
  saveModel: SaveModel
  view: ManuscriptEditorView
}> = ({ inlineStyles, saveModel, deleteModel, view }) => {
  const activeStyles = buildActiveStyleIDs(view.state)

  const addInlineStyle = useCallback(() => {
    const priority = nextPriority(inlineStyles)
    const inlineStyle = buildInlineStyle(priority)
    saveModel(inlineStyle).catch(error => {
      console.error(error) // tslint:disable-line:no-console
    })
  }, [inlineStyles, saveModel])

  const applyStyle = useCallback(
    (id: string) => {
      addStyleMark(id, view.state, view.dispatch)
    },
    [view]
  )

  const removeStyle = useCallback(
    (id: string) => {
      removeStyleMark(id, view.state, view.dispatch)
    },
    [view]
  )

  return (
    <InspectorSection title={'Inline Styles'}>
      <InlineStylesList>
        {inlineStyles.map(inlineStyle => (
          <InlineStyleItem
            isActive={activeStyles.has(inlineStyle._id)}
            applyStyle={applyStyle}
            removeStyle={removeStyle}
            inlineStyle={inlineStyle}
            deleteInlineStyle={deleteModel}
            saveInlineStyle={async values => {
              await saveModel({
                ...inlineStyle,
                ...values,
              })
            }}
          />
        ))}
      </InlineStylesList>

      <AddButtonContainer>
        <AddButton action={addInlineStyle} size={'small'} title={'New Style'} />
      </AddButtonContainer>
    </InspectorSection>
  )
}

const InlineStylesList = styled.div`
  margin: 16px 0;
`

const AddButtonContainer = styled.div`
  margin: 16px 0;
`
