import React from 'react'
import { isJointFirstAuthor } from '../../lib/authors'
import { Contributor } from '../../types/models'
import { Author, AuthorAffiliation } from './Author'
import { EditButton } from './Buttons'

interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  showEditButton: boolean
  startEditing: () => void
  selectAuthor: (data: Contributor) => void
}

const Authors: React.SFC<Props> = ({
  authors,
  authorAffiliations,
  startEditing,
  showEditButton,
  selectAuthor,
}) => (
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

    {showEditButton && <EditButton onClick={startEditing}>EDIT</EditButton>}
  </div>
)

export default Authors
