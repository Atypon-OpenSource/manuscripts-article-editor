import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import { ManuscriptCategory } from '@manuscripts/manuscripts-json-schema'
import React, { Component } from 'react'
import { VariableSizeList } from 'react-window'
import { altoGrey } from '../../colors'
import { styled, ThemedProps } from '../../theme'
import { ResearchField, TemplateData } from '../../types/templates'
import { PrimaryButton } from '../Button'
import { CloseButton } from '../SimpleModal'
import { TemplateCategorySelector } from './TemplateCategorySelector'
import { TemplateEmpty } from './TemplateEmpty'
import { TemplateSearchInput } from './TemplateSearchInput'
import { TemplateSelectorList } from './TemplateSelectorList'
import { TemplateTopicSelector } from './TemplateTopicSelector'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ListContainer = styled.div`
  flex: 1;
  width: 600px;
  max-width: 100%;
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
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
  border-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 ${altoGrey};
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
  border-top-left-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  border-bottom-left-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.sidebar.background.default};
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
  justify-content: center;
  padding: 20px;
`

interface Props {
  items: TemplateData[]
  categories: ManuscriptCategory[]
  researchFields: ResearchField[]
  projectID?: string
  handleComplete: () => void
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
