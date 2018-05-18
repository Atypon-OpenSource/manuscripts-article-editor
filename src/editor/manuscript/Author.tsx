import React from 'react'
import { styled } from '../../theme'
import {
  Affiliation,
  BibliographicName,
  Contributor,
} from '../../types/components'

interface AuthorNameProps {
  name: BibliographicName
}

const AuthorName: React.SFC<AuthorNameProps> = ({ name }) => (
  <span>
    {name.given} {name.family} {name.suffix}
  </span>
)

const AuthorAffiliations = styled.span`
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
}

export const Author: React.SFC<AuthorProps> = ({ author, affiliations }) => (
  <span key={author.id}>
    <AuthorName name={author.bibliographicName} />

    {affiliations && (
      <AuthorAffiliations>
        {affiliations.map((affiliation, index) => (
          <React.Fragment key={affiliation.data.id}>
            {!!index && ','}
            <AuthorAffiliation href={`#affiliation-${affiliation.ordinal}`}>
              {affiliation.ordinal}
            </AuthorAffiliation>
          </React.Fragment>
        ))}
      </AuthorAffiliations>
    )}
  </span>
)
