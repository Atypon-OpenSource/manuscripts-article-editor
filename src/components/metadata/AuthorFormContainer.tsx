/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Affiliation,
  Contributor,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import {
  AffiliationsEditor,
  AuthorAffiliation,
  AuthorForm,
  AuthorValues,
} from '@manuscripts/style-guide'
import React from 'react'
import AlertMessage, { AlertMessageType } from '../../components/AlertMessage'
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
          />
        </AlertMessage>
      </FormMessage>
    )}
  </React.Fragment>
)
