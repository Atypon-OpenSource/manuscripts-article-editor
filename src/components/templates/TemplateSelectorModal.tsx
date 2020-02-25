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

import { ManuscriptCategory, Model } from '@manuscripts/manuscripts-json-schema'
import fuzzysort from 'fuzzysort'
import React, { Component } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList } from 'react-window'
import { styled } from '../../theme/styled-components'
import { ResearchField, TemplateData } from '../../types/templates'
import Search from '../Search'
import { TemplateCategorySelector } from './TemplateCategorySelector'
import { TemplateEmpty } from './TemplateEmpty'
import { TemplateModalClose } from './TemplateModalClose'
import { TemplateModalFooter } from './TemplateModalFooter'
import { TemplateModalHeader } from './TemplateModalHeader'
import { TemplateSelectorList } from './TemplateSelectorList'
import { TemplateTopicSelector } from './TemplateTopicSelector'

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.grid.radius.default};
  box-shadow: ${props => props.theme.shadow.dropShadow};
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.font.family.sans};
  margin: ${props => props.theme.grid.unit * 3}px;
  overflow: hidden;
  height: 80vh;
  max-height: 900px;
`

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  max-width: 626px;
  position: relative;
  margin-top: ${props => props.theme.grid.unit * 3}px;
`

const FiltersContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.border.secondary};
  border-radius: ${props => props.theme.grid.radius.small};
  display: flex;
  margin: 0 30px ${props => props.theme.grid.unit * 4}px;

  input {
    border: none;
  }

  @media (max-width: 450px) {
    margin-left: ${props => props.theme.grid.unit * 4}px;
    margin-right: ${props => props.theme.grid.unit * 4}px;
  }
`

const TemplatesContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.border.secondary};
  border-radius: ${props => props.theme.grid.radius.small};
  list-style: none;
  margin: 0 30px ${props => props.theme.grid.unit * 4}px;
  flex-grow: 1;
  overflow: hidden;
  padding: 0;

  @media (max-width: 450px) {
    margin: 0 ${props => props.theme.grid.unit * 4}px;
  }
`

const EmptyTemplateContainer = styled.div`
  margin: 0 30px ${props => props.theme.grid.unit * 4}px;
`

interface Props {
  items: TemplateData[]
  categories: ManuscriptCategory[]
  researchFields: ResearchField[]
  handleComplete: () => void
  importManuscript: (models: Model[]) => Promise<void>
  selectTemplate: (template: TemplateData) => Promise<void>
  createEmpty: () => Promise<void>
}

interface State {
  creatingManuscript: boolean
  selectedCategory: string
  selectedField?: ResearchField
  selectedItem?: TemplateData
  searchText: string
}

export class TemplateSelectorModal extends Component<Props, State> {
  public state: Readonly<State> = {
    creatingManuscript: false,
    selectedCategory: 'MPManuscriptCategory:research-article',
    searchText: '',
  }

  private listRef = React.createRef<VariableSizeList>()

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.selectedItem === this.state.selectedItem) {
      this.resetScroll()
    }
  }

  public render() {
    const {
      categories,
      handleComplete,
      importManuscript,
      researchFields,
    } = this.props

    const {
      creatingManuscript,
      selectedCategory,
      selectedItem,
      selectedField,
      searchText,
    } = this.state

    const filteredItems = this.filterTemplates()

    this.resetList()

    return (
      <ModalBody>
        <TemplateModalClose handleComplete={handleComplete} />
        <ModalContainer>
          <TemplateModalHeader title={'Add Manuscript to Project'} />

          <TemplateCategorySelector
            options={categories}
            value={selectedCategory}
            handleChange={(selectedCategory: string) =>
              this.setState({
                selectedCategory,
                searchText: '',
                selectedItem: undefined,
              })
            }
          />

          {(searchText || filteredItems.length !== 0) && (
            <FiltersContainer>
              <Search
                autoComplete={'off'}
                autoFocus={true}
                handleSearchChange={this.handleSearchChange}
                placeholder={'Search'}
                type={'search'}
                value={searchText}
              />

              <TemplateTopicSelector
                handleChange={selectedField => this.setState({ selectedField })}
                options={researchFields}
                value={selectedField}
              />
            </FiltersContainer>
          )}

          {filteredItems.length ? (
            <TemplatesContainer>
              <AutoSizer>
                {({ height, width }) => (
                  <TemplateSelectorList
                    filteredItems={filteredItems}
                    height={height}
                    listRef={this.listRef}
                    resetList={this.resetList}
                    selectItem={this.setSelectedTemplate}
                    width={width}
                  />
                )}
              </AutoSizer>
            </TemplatesContainer>
          ) : (
            <EmptyTemplateContainer>
              <TemplateEmpty
                createEmpty={this.createEmpty}
                searchText={this.state.searchText}
                selectedCategoryName={this.selectedCategoryName()}
              />
            </EmptyTemplateContainer>
          )}

          <TemplateModalFooter
            createEmpty={this.createEmpty}
            importManuscript={importManuscript}
            selectTemplate={this.selectTemplate}
            selectedTemplate={selectedItem}
            creatingManuscript={creatingManuscript}
            noTemplate={filteredItems.length === 0}
          />
        </ModalContainer>
      </ModalBody>
    )
  }

  private handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    const searchText = event.currentTarget.value
    this.setState({ searchText })
  }

  private createEmpty = async () => {
    this.setState({ creatingManuscript: true })
    try {
      await this.props.createEmpty()
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error)
    }
    this.setState({ creatingManuscript: false })
  }

  private selectTemplate = async () => {
    if (this.state.selectedItem) {
      this.setState({ creatingManuscript: true })
      try {
        await this.props.selectTemplate(this.state.selectedItem)
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(error)
      }
      this.setState({ creatingManuscript: false })
    }
  }

  private setSelectedTemplate = (selectedItem: TemplateData) => {
    this.setState({ selectedItem })
  }

  private selectedCategoryName = (): string => {
    const { selectedCategory } = this.state

    const category = this.props.categories.find(
      category => category._id === selectedCategory
    )

    return category && category.name ? category.name : 'selected'
  }

  private hasSelectedCategory = (item: TemplateData) =>
    item.category === this.state.selectedCategory

  private hasSelectedField = (item: TemplateData) => {
    const { selectedField } = this.state

    if (!selectedField) return true

    if (!item.bundle || !item.bundle.csl || !item.bundle.csl.fields) {
      return false
    }

    for (const field of item.bundle.csl.fields) {
      if (field === selectedField._id) {
        return true
      }
    }
  }

  private resetScroll = () => {
    if (this.listRef.current) {
      this.listRef.current.scrollToItem(0)
    }
  }

  private resetList = (index: number = 0) => {
    if (this.listRef.current) {
      this.listRef.current.resetAfterIndex(index, true)
    }
  }

  private filterTemplates = () => {
    const { items } = this.props
    const { searchText } = this.state

    const filteredItems = items.filter(
      item => this.hasSelectedCategory(item) && this.hasSelectedField(item)
    )

    if (searchText) {
      const results = fuzzysort.go<TemplateData>(searchText, filteredItems, {
        keys: ['title'],
        limit: 100,
        allowTypo: false,
        threshold: -1000,
      })

      return results.map(result => result.obj)
    }

    return filteredItems
  }
}
