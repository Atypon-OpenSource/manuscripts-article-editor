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

import { PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import {
  ManuscriptTemplate,
  Publisher,
  TemplateData,
} from '../../types/templates'
import { TemplateInfoLink } from './TemplateInfoLink'

const CreateButton = styled(PrimaryButton)`
  padding: 0 4px;
  font-size: 14px;

  &:focus {
    outline: none;
  }
`

const Heading = styled.div<{ selected?: boolean }>`
  margin-bottom: 2px;
  white-space: ${props => (props.selected ? 'normal' : 'nowrap')};
  text-overflow: ellipsis;
  overflow-x: hidden;
`

const Title = styled.div<{ selected?: boolean }>`
  color: ${props => props.theme.colors.global.text.primary};
  white-space: ${props => (props.selected ? 'normal' : 'nowrap')};
  text-overflow: ellipsis;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  flex-wrap: ${props => (props.selected ? 'wrap' : 'nowrap')};
`

const Description = styled.div<{ selected?: boolean }>`
  color: ${props => props.theme.colors.global.text.secondary};
  font-size: 90%;
  white-space: ${props => (props.selected ? 'normal' : 'nowrap')};
  text-overflow: ellipsis;
  overflow-x: hidden;
`

const PublisherName = styled.div`
  font-size: 90%;
  margin-bottom: 2px;
  text-overflow: ellipsis;
  overflow-x: hidden;
`

const TemplateActions = styled.div<{ selected?: boolean }>`
  display: ${props => (props.selected ? 'inline' : 'none')};
  position: absolute;
  top: 0;
  right: 0;
  background: ${props =>
    props.theme.colors.templateSelector.item.actions.background};
  padding: 8px;
`

const BundleTitle = styled.span`
  font-weight: bold;
  margin-right: 0.5ch;
`

const Container = styled.div<{ selected?: boolean }>`
  padding: 12px;
  margin: 0 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  position: relative;
  background-color: ${props =>
    props.selected
      ? props.theme.colors.templateSelector.item.container.background.selected
      : props.theme.colors.templateSelector.item.container.background.default};

  &:hover {
    background-color: ${props =>
      props.theme.colors.templateSelector.item.container.background.hovered};
  }
`

const ArticleType = styled.span<{ selected?: boolean }>`
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
  selectTemplate: (item: TemplateData) => void
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
  selectTemplate,
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

        {selected && item.bundle && (
          <InfoLinkContainer>
            <TemplateInfoLink bundle={item.bundle} />
          </InfoLinkContainer>
        )}
      </Title>

      <TemplateActions selected={selected}>
        <CreateButton
          onClick={event => {
            event.stopPropagation()
            selectTemplate(item)
          }}
          data-cy={'create-button'}
        >
          Create
        </CreateButton>
      </TemplateActions>
    </Heading>

    {selected && publisher && publisher.name && (
      <PublisherName>{publisher.name}</PublisherName>
    )}

    {template && (template.desc || template.aim) && (
      <Description selected={selected}>
        {template.desc || template.aim}
      </Description>
    )}
  </Container>
)
