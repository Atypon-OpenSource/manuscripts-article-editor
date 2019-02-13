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
