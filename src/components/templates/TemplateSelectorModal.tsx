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

import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import { ManuscriptCategory, Model } from '@manuscripts/manuscripts-json-schema'
import { Button, CloseButton, PrimaryButton } from '@manuscripts/style-guide'
import React, { Component } from 'react'
import { VariableSizeList } from 'react-window'
import { styled } from '../../theme/styled-components'
import { ResearchField, TemplateData } from '../../types/templates'
import { ModalContext } from '../ModalProvider'
import { Importer } from '../projects/Importer'
import { TemplateCategorySelector } from './TemplateCategorySelector'
import { TemplateEmpty } from './TemplateEmpty'
import { TemplateSearchInput } from './TemplateSearchInput'
import { TemplateSelectorList } from './TemplateSelectorList'
import { TemplateTopicSelector } from './TemplateTopicSelector'

const ListContainer = styled.div`
  flex: 1;
  width: 600px;
  max-width: 100%;
`

const FadingEdge = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  height: 30px;
  background-image: linear-gradient(
    transparent,
    ${props => props.theme.colors.modal.background}
  );
`

const TemplateSearch = styled.div`
  margin-left: 8px;
  flex-shrink: 0;
`

const ModalContainer = styled.div`
  height: 70vh;
  max-width: 70vw;
  min-width: 600px;
  display: flex;
  background: white;
  opacity: 1;
  font-family: ${props => props.theme.fontFamily};
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 ${props => props.theme.colors.modal.shadow};
`

const ModalHeader = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 8px;
`

const ModalSidebar = styled.div`
  display: flex;
  flex-direction: column;
  border-top-left-radius: ${props => props.theme.radius}px;
  border-bottom-left-radius: ${props => props.theme.radius}px;
  background-color: ${props => props.theme.colors.sidebar.background.default};
`

const ModalMain = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
`

const SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;

  & button {
    margin: 4px 0;
    display: flex;
  }
`

interface Props {
  items: TemplateData[]
  categories: ManuscriptCategory[]
  researchFields: ResearchField[]
  projectID?: string
  handleComplete: () => void
  importManuscript: (models: Model[]) => Promise<void>
  selectTemplate: (template?: TemplateData) => void
  createEmpty: () => void
}

interface State {
  selectedCategory: string
  selectedField: ResearchField | null
  searchText: string
}

export class TemplateSelectorModal extends Component<Props, State> {
  public state: Readonly<State> = {
    selectedCategory: 'MPManuscriptCategory:research-article',
    selectedField: null,
    searchText: '',
  }

  private listRef = React.createRef<VariableSizeList>()

  public render() {
    const {
      categories,
      createEmpty,
      handleComplete,
      importManuscript,
      researchFields,
      selectTemplate,
    } = this.props

    const { selectedCategory, selectedField, searchText } = this.state

    const filteredItems = this.filterTemplates()

    this.resetScroll()
    this.resetList()

    return (
      <ModalBody>
        <ModalHeader>
          <CloseButton onClick={handleComplete}>
            <CloseIconDark />
          </CloseButton>
        </ModalHeader>
        <ModalContainer>
          <ModalSidebar>
            <TemplateTopicSelector
              handleChange={selectedField => this.setState({ selectedField })}
              options={researchFields}
              value={selectedField}
            />

            <TemplateCategorySelector
              options={categories}
              value={selectedCategory}
              handleChange={(selectedCategory: string) =>
                this.setState({ selectedCategory })
              }
            />

            <SidebarFooter>
              <ModalContext.Consumer>
                {({ addModal }) => (
                  <Button
                    onClick={() =>
                      addModal('importer', ({ handleClose }) => (
                        <Importer
                          handleComplete={handleClose}
                          importManuscript={importManuscript}
                        />
                      ))
                    }
                  >
                    Import manuscript from file
                  </Button>
                )}
              </ModalContext.Consumer>

              <PrimaryButton onClick={createEmpty}>
                Create empty manuscript
              </PrimaryButton>
            </SidebarFooter>
          </ModalSidebar>

          <ModalMain>
            <TemplateSearch>
              <TemplateSearchInput
                value={searchText}
                handleChange={(searchText: string) => {
                  this.setState({ searchText })
                }}
              />
            </TemplateSearch>

            {filteredItems.length ? (
              <ListContainer>
                <TemplateSelectorList
                  filteredItems={filteredItems}
                  listRef={this.listRef}
                  selectTemplate={selectTemplate}
                  resetList={this.resetList}
                />
                <FadingEdge />
              </ListContainer>
            ) : (
              <TemplateEmpty
                createEmpty={createEmpty}
                searchText={this.state.searchText}
                selectedCategoryName={this.selectedCategoryName()}
              />
            )}
          </ModalMain>
        </ModalContainer>
      </ModalBody>
    )
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
      const lowercaseSearch = searchText
        .split(/\s+/)
        .map(item => item.toLowerCase())

      return filteredItems.filter(item => {
        const lowercaseTitle = item.title.toLowerCase()

        return lowercaseSearch.every(lowercaseSearchText =>
          lowercaseTitle.includes(lowercaseSearchText)
        )
      })
    }

    return filteredItems
  }
}
