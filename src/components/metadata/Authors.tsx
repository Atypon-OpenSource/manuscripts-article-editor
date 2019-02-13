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

import { Contributor } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { isJointFirstAuthor } from '../../lib/authors'
import { styled } from '../../theme/styled-components'
import { Author, AuthorAffiliation } from './Author'
import { EditButton } from './Buttons'

const AuthorsContainer = styled.div<{ isEmpty: boolean }>`
  display: flex;
  align-items: center;

  @media (min-width: 768px) {
    & ${EditButton} {
      display: ${props => (props.isEmpty ? 'initial' : 'none')};
    }

    &:hover ${EditButton} {
      display: initial;
    }
  }
`

const AuthorsActions = styled.div`
  display: flex;
  align-items: center;
`

interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  showEditButton: boolean
  startEditing: () => void
  selectAuthor: (data: Contributor) => void
}

const Authors: React.FunctionComponent<Props> = ({
  authors,
  authorAffiliations,
  startEditing,
  showEditButton,
  selectAuthor,
}) => (
  <AuthorsContainer isEmpty={!authors.length}>
    <div>
      {authors.map((author, index) => (
        <React.Fragment key={author._id}>
          {!!index && ', '}
          <Author
            author={author}
            jointFirstAuthor={isJointFirstAuthor(authors, index)}
            affiliations={authorAffiliations.get(author._id)}
            selectAuthor={selectAuthor}
            startEditing={startEditing}
            showEditButton={showEditButton}
          />
        </React.Fragment>
      ))}
    </div>

    {showEditButton && (
      <AuthorsActions>
        <EditButton onClick={startEditing}>Edit Authors</EditButton>
      </AuthorsActions>
    )}
  </AuthorsContainer>
)

export default Authors
