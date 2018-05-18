import React from 'react'
import { styled } from '../../theme'
import { BibliographicName } from '../../types/components'

interface Props {
  name: BibliographicName
}

const NameParts = styled.span`
  margin-bottom: 5px;
  line-height: 35px;
`
const GivenName = styled.span``

const FamilyName = styled.span`
  font-weight: 600;
`

const Suffix = styled.span``

export const AuthorName: React.SFC<Props> = ({ name }) => (
  <NameParts>
    <GivenName>{name.given}</GivenName> <FamilyName>{name.family}</FamilyName>{' '}
    <Suffix>{name.suffix}</Suffix>
  </NameParts>
)
