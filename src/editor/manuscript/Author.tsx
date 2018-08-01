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

export interface AuthorAffiliation {
  ordinal: number
  data: Affiliation
}

interface AuthorProps {
  author: Contributor
  affiliations?: AuthorAffiliation[]
  jointFirstAuthor: boolean
}

export const Author: React.SFC<AuthorProps> = ({
  author,
  affiliations,
  jointFirstAuthor,
}) => (
  <span key={author.id}>
    <AuthorName name={author.bibliographicName} />

    {affiliations && (
      <AuthorNotes>
        {affiliations.map((affiliation, index) => (
          <React.Fragment key={affiliation.data.id}>
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
