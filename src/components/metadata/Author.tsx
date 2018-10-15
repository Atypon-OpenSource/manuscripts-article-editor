import React from 'react'
import { styled } from '../../theme'
import { Affiliation, Contributor } from '../../types/components'
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

export const Author: React.SFC<AuthorProps> = ({
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
