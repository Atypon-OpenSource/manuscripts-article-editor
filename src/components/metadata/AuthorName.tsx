import { BibliographicName } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { dustyGrey } from '../../colors'
import { initials } from '../../lib/name'
import { styled, ThemedProps } from '../../theme'

interface Props {
  name: BibliographicName
}

interface NamePartsProps {
  color?: string
}

const NameParts = styled.span`
  line-height: 35px;
  font-size: 18px;
  letter-spacing: -0.3px;
  color: ${(props: NamePartsProps & ThemedProps<HTMLDivElement>) =>
    props.color || props.theme.colors.global.text.primary};
`

const buildNameLiteral = (name: BibliographicName) =>
  [initials(name), name.family, name.suffix].filter(part => part).join(' ')

export const AuthorName: React.FunctionComponent<Props> = ({ name }) =>
  !name.given && !name.family ? (
    <NameParts color={dustyGrey}>Unknown Author</NameParts>
  ) : (
    <NameParts>{buildNameLiteral(name)}</NameParts>
  )
