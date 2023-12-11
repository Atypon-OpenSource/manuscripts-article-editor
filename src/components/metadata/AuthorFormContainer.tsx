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
  ContributorRole,
} from '@manuscripts/json-schema'
import {
  AffiliationsEditor,
  AuthorAffiliation,
  AuthorForm,
  AuthorValues,
} from '@manuscripts/style-guide'
import React from 'react'

import { AffiliationMap } from '../../lib/authors'

interface AuthorProps {
  author: Contributor
  affiliations: AffiliationMap
  authorAffiliations: AuthorAffiliation[]
  isRemoveAuthorOpen: boolean
  addAuthorAffiliation: (affiliation: Affiliation | string) => void
  removeAuthorAffiliation: (affiliation: Affiliation) => void
  updateAffiliation: (affiliation: Affiliation) => void
  removeAuthor: (data: Contributor) => void
  handleSave: (values: AuthorValues) => Promise<void>
  handleRemoveAuthor: () => void
  contributorRoles: ContributorRole[]
  createContributorRole: (name: string) => Promise<ContributorRole>
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
  contributorRoles,
  createContributorRole,
}) => (
  <React.Fragment>
    <AuthorForm
      author={author}
      handleSave={handleSave}
      isRemoveAuthorOpen={isRemoveAuthorOpen}
      removeAuthor={removeAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      contributorRoles={contributorRoles}
      createContributorRole={createContributorRole}
    />
    <AffiliationsEditor
      affiliations={affiliations}
      authorAffiliations={authorAffiliations}
      addAuthorAffiliation={addAuthorAffiliation}
      removeAuthorAffiliation={removeAuthorAffiliation}
      updateAffiliation={updateAffiliation}
    />
  </React.Fragment>
)
