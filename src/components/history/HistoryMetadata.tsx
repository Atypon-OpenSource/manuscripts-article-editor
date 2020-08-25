/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { AffiliationsList, AuthorsList } from '@manuscripts/style-guide'

import {
  Affiliation,
  Contributor,
  Manuscript,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import styled from 'styled-components'
import { buildAuthorsAndAffiliations } from '../../lib/authors'

interface Props {
  manuscript: Manuscript
  modelMap: Map<string, Model>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledTitle = styled(Title)`
  & .ProseMirror {
    font-family: 'PT Serif', serif;
    font-size: 28px;
    font-weight: ${props => props.theme.font.weight.bold};
    line-height: 1.43;

    &.empty-node::before {
      position: absolute;
      color: ${props => props.theme.colors.text.muted};
      cursor: text;
      content: 'Untitled Manuscript';
      pointer-events: none;
    }

    &.empty-node:hover::before {
      color: ${props => props.theme.colors.text.secondary};
    }
  }
`

export const HistoryMetadata: React.FC<Props> = ({ manuscript, modelMap }) => {
  const models = Array.from(modelMap).map(([_, model]) => model)
  const authorData = buildAuthorsAndAffiliations(
    models as Array<Affiliation | Contributor>
  )

  return (
    <Container>
      <StyledTitle value={manuscript.title} />
      <AuthorsList
        authors={authorData.authors}
        authorAffiliations={authorData.authorAffiliations}
        showEditButton={false}
      />
      <AffiliationsList affiliations={authorData.affiliations} />
    </Container>
  )
}
