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

import React from 'react'
import { styled } from '../../theme/styled-components'
import {
  ManuscriptTemplate,
  Publisher,
  TemplateData,
} from '../../types/templates'
import { TemplateInfoLink } from './TemplateInfoLink'

const Heading = styled.div<{ selected?: boolean }>`
  display: flex;
  white-space: ${props => (props.selected ? 'normal' : 'nowrap')};
  text-overflow: ellipsis;
  overflow-x: hidden;
`

const Title = styled.div<{ selected?: boolean }>`
  align-items: center;
  display: flex;
  flex: 1;
  flex-wrap: ${props => (props.selected ? 'wrap' : 'nowrap')};
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: ${props => (props.selected ? 'normal' : 'nowrap')};
`

const Description = styled.div<{ selected?: boolean }>`
  font-weight: ${props => props.theme.font.size.small};
  font-weight: ${props => props.theme.font.weight.light};
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: ${props => (props.selected ? 'normal' : 'nowrap')};
`

const PublisherName = styled.div`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.font.size.normal};
  margin-bottom: ${props => props.theme.grid.unit * 2}px;
  overflow-x: hidden;
  text-overflow: ellipsis;
`

const TemplateActions = styled.div<{ selected?: boolean }>`
  display: ${props => (props.selected ? 'inline' : 'none')};
`

const BundleTitle = styled.span`
  font-weight: ${props => props.theme.font.weight.bold};
  margin-right: 0.5ch;
`

const Container = styled.button<{ selected?: boolean }>`
  border: 0;
  border-bottom: 1px solid;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  font: inherit;
  position: relative;
  background-color: ${props =>
    props.selected ? props.theme.colors.background.secondary : 'transparent'};
  border-color: ${props => props.theme.colors.border.secondary};
  outline: none;
  padding: ${props => props.theme.grid.unit * 4}px;
  padding-bottom: ${props => props.theme.grid.unit * 3}px;
  text-align: unset;
  width: 100%;

  &:hover,
  &:focus {
    background-color: ${props => props.theme.colors.background.secondary};
  }
`

const ArticleType = styled.span<{ selected?: boolean }>`
  color: ${props => props.theme.colors.text.secondary};
  white-space: ${props => (props.selected ? 'normal' : 'nowrap')};
`

const InfoLinkContainer = styled.div`
  position: relative;
  bottom: 0.1rem;
`

interface Props {
  articleType?: string
  item: TemplateData
  publisher?: Publisher
  selected?: boolean
  selectItem: (item: TemplateData) => void
  template?: ManuscriptTemplate
  title: string
}

// tslint:disable:cyclomatic-complexity
export const TemplateListItem: React.FunctionComponent<Props> = ({
  articleType,
  item,
  publisher,
  selected,
  selectItem,
  template,
  title,
}) => (
  <Container onClick={() => selectItem(item)} selected={selected}>
    <Heading selected={selected}>
      <Title selected={selected}>
        <BundleTitle>{title}</BundleTitle>

        {articleType && articleType !== title && (
          <ArticleType selected={selected} data-cy={'article-type'}>
            {articleType}
          </ArticleType>
        )}
      </Title>

      <TemplateActions selected={selected}>
        {item.bundle && (
          <InfoLinkContainer>
            <TemplateInfoLink bundle={item.bundle} />
          </InfoLinkContainer>
        )}
      </TemplateActions>
    </Heading>

    {selected && publisher && publisher.name && (
      <PublisherName>{publisher.name}</PublisherName>
    )}

    {selected && template && (template.desc || template.aim) && (
      <Description selected={selected}>
        {template.desc || template.aim}
      </Description>
    )}
  </Container>
)
