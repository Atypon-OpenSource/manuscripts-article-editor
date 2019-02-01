import React from 'react'
import { styled } from '../../theme/styled-components'
import {
  ManuscriptTemplate,
  Publisher,
  TemplateData,
} from '../../types/templates'
import { PrimaryButton } from '../Button'
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

        {articleType &&
          articleType !== title && (
            <ArticleType selected={selected} data-cy={'article-type'}>
              {articleType}
            </ArticleType>
          )}

        {selected && <TemplateInfoLink bundle={item.bundle} />}
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

    {selected &&
      publisher &&
      publisher.name && <PublisherName>{publisher.name}</PublisherName>}

    {template &&
      template.desc && (
        <Description selected={selected}>{template.desc}</Description>
      )}
  </Container>
)
