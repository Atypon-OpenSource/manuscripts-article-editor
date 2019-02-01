import { BibliographicName } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { initials } from '../../lib/name'
import { styled } from '../../theme/styled-components'

interface Props {
  name: BibliographicName
}

const NameParts = styled.span<{ color?: string }>`
  line-height: 35px;
  font-size: 18px;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.authorName.default};
`

const NamePartsPlaceholder = styled(NameParts)`
  color: ${props => props.theme.colors.authorName.placeholder};
`

const buildNameLiteral = (name: BibliographicName) =>
  [initials(name), name.family, name.suffix].filter(part => part).join(' ')

export const AuthorName: React.FunctionComponent<Props> = ({ name }) =>
  !name.given && !name.family ? (
    <NamePartsPlaceholder>Unknown Author</NamePartsPlaceholder>
  ) : (
    <NameParts>{buildNameLiteral(name)}</NameParts>
  )
