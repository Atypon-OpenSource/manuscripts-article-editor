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

import { Affiliation, Contributor } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { AuthorName } from './AuthorName'

const AuthorNotes = styled.span`
  display: inline-block;
  vertical-align: top;
  font-size: 0.75em;
`

const AuthorAffiliation = styled.a`
  text-decoration: none;
  color: inherit;
`

const AuthorsContainer = styled.div`
  display: inline-flex;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

export interface AuthorAffiliation {
  ordinal: number
  data: Affiliation
}

interface AuthorProps {
  author: Contributor
  affiliations?: AuthorAffiliation[]
  jointFirstAuthor: boolean
  showEditButton: boolean
  selectAuthor: (data: Contributor) => void
  startEditing: () => void
}

export const Author: React.FunctionComponent<AuthorProps> = ({
  author,
  affiliations,
  jointFirstAuthor,
  startEditing,
  selectAuthor,
  showEditButton,
}) => (
  <span key={author._id}>
    {showEditButton ? (
      <AuthorsContainer
        onClick={() => {
          startEditing()
          selectAuthor(author)
        }}
      >
        <AuthorName name={author.bibliographicName} />
      </AuthorsContainer>
    ) : (
      <AuthorName name={author.bibliographicName} />
    )}
    {affiliations && (
      <AuthorNotes>
        {affiliations.map((affiliation, index) => (
          <React.Fragment key={affiliation.data._id}>
            {!!index && ','}
            <AuthorAffiliation href={`#affiliation-${affiliation.ordinal}`}>
              {affiliation.ordinal}
            </AuthorAffiliation>
          </React.Fragment>
        ))}
      </AuthorNotes>
    )}

    {author.isCorresponding && (
      <AuthorNotes title={'Corresponding author'}>*</AuthorNotes>
    )}
    {jointFirstAuthor && (
      <AuthorNotes title={'Joint contributor'}>†</AuthorNotes>
    )}
  </span>
)
