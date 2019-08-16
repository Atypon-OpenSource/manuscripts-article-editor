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
  Affiliation,
  Contributor,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import {
  AffiliationsEditor,
  AlertMessage,
  AlertMessageType,
  AuthorAffiliation,
  AuthorForm,
  AuthorValues,
} from '@manuscripts/style-guide'
import React from 'react'
import { TokenActions } from '../../data/TokenData'
import { AffiliationMap } from '../../lib/authors'
import { styled } from '../../theme/styled-components'
import InviteAuthorButton from './InviteAuthorButton'

const FormMessage = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 450px;
`

interface AuthorProps {
  project: Project
  author: Contributor
  affiliations: AffiliationMap
  authorAffiliations: AuthorAffiliation[]
  isRemoveAuthorOpen: boolean
  addAuthorAffiliation: (affiliation: Affiliation | string) => void
  removeAuthorAffiliation: (affiliation: Affiliation) => void
  updateAffiliation: (affiliation: Affiliation) => void
  removeAuthor: (data: Contributor) => void
  isRejected: (invitationID: string) => boolean
  updateAuthor: (author: Contributor, email: string) => void
  getAuthorName: (author: Contributor) => string
  handleSave: (values: AuthorValues) => Promise<void>
  handleRemoveAuthor: () => void
  tokenActions: TokenActions
}

export const AuthorFormContainer: React.FunctionComponent<AuthorProps> = ({
  author,
  affiliations,
  authorAffiliations,
  handleSave,
  addAuthorAffiliation,
  removeAuthorAffiliation,
  updateAffiliation,
  removeAuthor,
  isRemoveAuthorOpen,
  handleRemoveAuthor,
  isRejected,
  project,
  updateAuthor,
  getAuthorName,
  tokenActions,
}) => (
  <React.Fragment>
    <AuthorForm
      author={author}
      affiliations={affiliations}
      authorAffiliations={authorAffiliations}
      handleSave={handleSave}
      isRemoveAuthorOpen={isRemoveAuthorOpen}
      removeAuthor={removeAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
    />
    <AffiliationsEditor
      affiliations={affiliations}
      authorAffiliations={authorAffiliations}
      addAuthorAffiliation={addAuthorAffiliation}
      removeAuthorAffiliation={removeAuthorAffiliation}
      updateAffiliation={updateAffiliation}
    />
    {!author.userID && !author.invitationID && (
      <FormMessage>
        <AlertMessage type={AlertMessageType.info} hideCloseButton={true}>
          {getAuthorName(author) + ' '}
          does not have access to the project.
          <InviteAuthorButton
            author={author}
            project={project}
            updateAuthor={updateAuthor}
            tokenActions={tokenActions}
          />
        </AlertMessage>
      </FormMessage>
    )}
    {author.invitationID && isRejected(author.invitationID) && (
      <FormMessage>
        <AlertMessage type={AlertMessageType.info} hideCloseButton={true}>
          {getAuthorName(author) + ' '}
          does not have access to the project.
          <InviteAuthorButton
            author={author}
            project={project}
            updateAuthor={updateAuthor}
            tokenActions={tokenActions}
          />
        </AlertMessage>
      </FormMessage>
    )}
  </React.Fragment>
)
