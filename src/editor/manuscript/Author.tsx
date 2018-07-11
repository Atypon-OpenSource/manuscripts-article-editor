import React from 'react'
import { initials } from '../../lib/name'
import { styled } from '../../theme'
import {
  Affiliation,
  BibliographicName,
  Contributor,
} from '../../types/components'

const buildNameLiteral = (name: BibliographicName) =>
  [initials(name), name.family, name.suffix].filter(part => part).join(' ')

interface AuthorNameProps {
  name: BibliographicName
}

const AuthorName: React.SFC<AuthorNameProps> = ({ name }) => (
  <span>{buildNameLiteral(name)}</span>
)

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
