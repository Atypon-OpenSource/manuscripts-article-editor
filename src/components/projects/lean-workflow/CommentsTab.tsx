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
import { buildKeyword, Selected } from '@manuscripts/manuscript-transform'
import { Keyword, UserProfile } from '@manuscripts/manuscripts-json-schema'
import {
  InspectorSection,
  ManuscriptNoteList,
  usePermissions,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import config from '../../../config'
import { useComments } from '../../../hooks/use-comments'
import { useStore } from '../../../store'
import { CommentsList } from './CommentsList'

export const CommentsTab: React.FC<{
  commentController: ReturnType<typeof useComments>
  selected: Selected | undefined
}> = ({ commentController, selected }) => {
  const [
    {
      notes,
      user,
      collaborators,
      collaboratorsById,
      keywords,
      saveModel,
      deleteModel,
    },
  ] = useStore((store) => ({
    notes: store.notes,
    user: store.user,
    collaborators: store.collaborators || new Map(),
    collaboratorsById: store.collaboratorsById,
    keywords: store.keywords,
    saveModel: store.saveModel,
    deleteModel: store.deleteModel,
  }))
  const createKeyword = (name: string) => saveModel(buildKeyword(name))

  const getCollaboratorById = (id: string) =>
    collaboratorsById && collaboratorsById.get(id)

  const getKeyword = (id: string) => keywords.get(id)

  const listCollaborators = (): UserProfile[] =>
    Array.from(collaborators.values())

  const listKeywords = (): Keyword[] => Array.from(keywords.values())

  const can = usePermissions()

  return (
    <CommentsContainer>
      {config.features.commenting && (
        <InspectorSection
          title={'Comments'}
          contentStyles={{ margin: '0 25px 24px 0' }}
        >
          <CommentsList
            commentController={commentController}
            createKeyword={createKeyword}
            getCollaboratorById={getCollaboratorById}
            getKeyword={getKeyword}
            listCollaborators={listCollaborators}
            listKeywords={listKeywords}
          />
        </InspectorSection>
      )}
      {config.features.productionNotes && (
        <InspectorSection
          title={'Notes'}
          contentStyles={{ margin: '0 25px 24px 0' }}
        >
          <ManuscriptNoteList
            createKeyword={createKeyword}
            notes={notes || []}
            can={can}
            currentUserId={user._id}
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
    </CommentsContainer>
  )
}

const CommentsContainer = styled.div`
  margin-top: ${(props) => props.theme.grid.unit * 4}px;
`
