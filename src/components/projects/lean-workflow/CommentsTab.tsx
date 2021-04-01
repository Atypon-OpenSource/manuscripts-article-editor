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
  buildKeyword,
  ManuscriptNode,
  Selected,
} from '@manuscripts/manuscript-transform'
import {
  CommentAnnotation,
  Keyword,
  ManuscriptNote,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { ManuscriptNoteList } from '@manuscripts/style-guide'
import { EditorState, Transaction } from 'prosemirror-state'
import React, { useState } from 'react'

import config from '../../../config'
import { InspectorSection } from '../../InspectorSection'
import { CommentFilter } from '../CommentList'
import { SaveModel } from '../ManuscriptInspector'

export const CommentsTab: React.FC<{
  comments: CommentAnnotation[]
  notes: ManuscriptNote[]
  state: EditorState
  dispatch: (tr: Transaction) => EditorState
  doc: ManuscriptNode
  user: UserProfile
  collaborators: Map<string, UserProfile>
  collaboratorsById: Map<string, UserProfile>
  keywords: Map<string, Keyword>
  saveModel: SaveModel
  deleteModel: (id: string) => Promise<string>
  selected: Selected | undefined
  commentTarget?: string
  setCommentTarget: (commentTarget?: string) => void
}> = ({
  comments,
  notes,
  state,
  dispatch,
  doc,
  user,
  collaborators,
  collaboratorsById,
  keywords,
  saveModel,
  deleteModel,
  selected,
  setCommentTarget,
  commentTarget,
}) => {
  // @ts-ignore
  const [commentFilter, setCommentFilter] = useState<CommentFilter>(
    CommentFilter.ALL
  )

  const getCurrentUser = (): UserProfile => user

  const createKeyword = (name: string) => saveModel(buildKeyword(name))
  // @ts-ignore
  const getCollaborator = (id: string) => collaborators.get(id)

  const getCollaboratorById = (id: string) => collaboratorsById.get(id)

  const getKeyword = (id: string) => keywords.get(id)

  const listCollaborators = (): UserProfile[] =>
    Array.from(collaborators.values())

  const listKeywords = (): Keyword[] => Array.from(keywords.values())

  return (
    <div>
      {/* TODO:: will comment out this part when we figure out a solution to the snapshot with Comments*/}
      {/* {config.features.commenting && (
        <InspectorSection title={'Comments'}>
          <CommentList
            comments={comments || []}
            doc={doc}
            getCurrentUser={getCurrentUser}
            selected={selected || null}
            createKeyword={createKeyword}
            deleteModel={deleteModel}
            getCollaborator={getCollaborator}
            getCollaboratorById={getCollaboratorById}
            getKeyword={getKeyword}
            listCollaborators={listCollaborators}
            listKeywords={listKeywords}
            saveModel={saveModel}
            commentTarget={commentTarget}
            setCommentTarget={setCommentTarget}
            state={state}
            dispatch={dispatch}
            setCommentFilter={setCommentFilter}
            commentFilter={commentFilter}
          />
        </InspectorSection>
      )} */}
      {config.features.productionNotes && (
        <InspectorSection title={'Notes'}>
          <ManuscriptNoteList
            createKeyword={createKeyword}
            notes={notes || []}
            currentUserId={getCurrentUser()._id}
            getKeyword={getKeyword}
            listKeywords={listKeywords}
            selected={selected || null}
            getCollaboratorById={getCollaboratorById}
            listCollaborators={listCollaborators}
            saveModel={saveModel}
            deleteModel={deleteModel}
            noteSource={'EDITOR'}
          />
        </InspectorSection>
      )}
    </div>
  )
}
