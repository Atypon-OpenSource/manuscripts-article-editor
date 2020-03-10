/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import { buildKeywordsContents } from '@manuscripts/manuscript-editor'
import {
  buildManuscriptKeyword,
  ManuscriptEditorView,
  ManuscriptNode,
} from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  ManuscriptKeyword,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import CreatableSelect from 'react-select/creatable'
import { selectStyles } from '../../lib/select-styles'
import { SaveModel } from './ManuscriptInspector'

export const KeywordsInput: React.FC<{
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  saveModel: SaveModel
  view: ManuscriptEditorView
}> = ({ manuscript, modelMap, saveManuscript, saveModel, view }) => {
  const keywordIDs = manuscript.keywordIDs || []

  const manuscriptKeywords: ManuscriptKeyword[] = keywordIDs
    .map(id => modelMap.get(id) as ManuscriptKeyword | undefined)
    .filter(Boolean) as ManuscriptKeyword[]

  const updateKeywordsElement = (manuscriptKeywords: ManuscriptKeyword[]) => {
    const keywordsElements: Array<{
      node: ManuscriptNode
      pos: number
    }> = []

    const { tr } = view.state

    tr.doc.descendants((node, pos) => {
      if (node.type === node.type.schema.nodes.keywords_element) {
        keywordsElements.push({
          node,
          pos,
        })
      }
    })

    if (keywordsElements.length) {
      const contents = buildKeywordsContents(manuscript, manuscriptKeywords)

      for (const { node, pos } of keywordsElements) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          contents,
        })
      }

      view.dispatch(tr)
    }
  }

  return (
    <CreatableSelect<ManuscriptKeyword>
      isMulti={true}
      noOptionsMessage={() => null}
      getNewOptionData={inputValue => {
        const option = {
          name: `Add "${inputValue}"`,
        }

        return option as ManuscriptKeyword
      }}
      onCreateOption={async inputValue => {
        const keyword = buildManuscriptKeyword(inputValue)

        await saveModel<ManuscriptKeyword>(keyword)

        await saveManuscript({
          keywordIDs: [...keywordIDs, keyword._id],
        })

        updateKeywordsElement([
          ...manuscriptKeywords,
          keyword as ManuscriptKeyword,
        ])
      }}
      options={manuscriptKeywords}
      value={manuscriptKeywords}
      getOptionValue={option => option._id}
      getOptionLabel={option => option.name}
      onChange={async (manuscriptKeywords: ManuscriptKeyword[]) => {
        await saveManuscript({
          keywordIDs: manuscriptKeywords.map(item => item._id),
        })

        updateKeywordsElement(manuscriptKeywords)
      }}
      styles={selectStyles}
      menuPortalTarget={document.body}
    />
  )
}
