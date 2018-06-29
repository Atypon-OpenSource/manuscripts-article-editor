import React from 'react'
import { styled } from '../../theme'
import { BibliographicName } from '../../types/components'

interface Props {
  name: BibliographicName
}

const NameParts = styled.span`
  margin-left: 12px;
  line-height: 35px;
  font-size: 18px;
  letter-spacing: -0.3px;
  color: #353535;
`
// const GivenName = styled.span``

const FamilyName = styled.span`
  font-weight: 500;
`

const Initials = styled.span``

const Suffix = styled.span``

const initials = (name: BibliographicName): string =>
  name.given
    ? name.given
        .split(' ')
        .map(part => part.substr(0, 1).toUpperCase() + '.')
        .join('')
    : ''

export const AuthorName: React.SFC<Props> = ({ name }) => (
  <NameParts>
    <Initials>{initials(name)}</Initials>{' '}
    {/*<GivenName>{name.given}</GivenName> */}
    <FamilyName>{name.family}</FamilyName> <Suffix>{name.suffix}</Suffix>
  </NameParts>
)
