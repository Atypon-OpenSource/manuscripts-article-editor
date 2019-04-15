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

import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import { Bundle } from '@manuscripts/manuscripts-json-schema'
import { CloseButton } from '@manuscripts/style-guide'
import fuzzysort from 'fuzzysort'
import React, { Component } from 'react'
import { FixedSizeList } from 'react-window'
import { styled } from '../../theme/styled-components'
import { CitationStyleEmpty } from './CitationStyleEmpty'
import { CitationStyleSelectorList } from './CitationStyleSelectorList'
import { TemplateSearchInput } from './TemplateSearchInput'

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

interface Props {
  items: Bundle[]
  handleComplete: () => void
  selectBundle: (bundle?: Bundle) => void
}

interface State {
  filteredItems: Bundle[]
  searchText: string
}

export class CitationStyleSelectorModal extends Component<Props, State> {
  public state: Readonly<State> = {
    filteredItems: [],
    searchText: '',
  }

  private listRef = React.createRef<FixedSizeList>()

  public componentDidMount() {
    this.setState({
      filteredItems: this.props.items,
    })
  }

  public render() {
    const { handleComplete, selectBundle } = this.props

    const { searchText, filteredItems } = this.state

    this.resetScroll()

    return (
      <ModalBody>
        <ModalHeader>
          <CloseButton onClick={() => handleComplete()}>
            <CloseIconDark />
          </CloseButton>
        </ModalHeader>
        <ModalContainer>
          <ModalSidebar />

          <ModalMain>
            <TemplateSearch>
              <TemplateSearchInput
                value={searchText}
                handleChange={this.handleSearchChange}
              />
            </TemplateSearch>

            {filteredItems.length ? (
              <ListContainer>
                <CitationStyleSelectorList
                  listRef={this.listRef}
                  filteredItems={filteredItems}
                  selectBundle={selectBundle}
                />
                <FadingEdge />
              </ListContainer>
            ) : (
              <CitationStyleEmpty searchText={this.state.searchText} />
            )}
          </ModalMain>
        </ModalContainer>
      </ModalBody>
    )
  }

  private filterBundles = async (searchText: string) => {
    const { items } = this.props

    if (!searchText) {
      return items
    }

    const results = await fuzzysort.goAsync<Bundle>(searchText.trim(), items, {
      keys: ['csl.title'],
      limit: 250,
      allowTypo: false,
      threshold: -10000,
    })

    return results.map(result => result.obj)
  }

  private handleSearchChange = async (searchText: string) => {
    this.setState({ searchText })

    this.setState({
      filteredItems: await this.filterBundles(searchText),
    })
  }

  private resetScroll = () => {
    if (this.listRef.current) {
      this.listRef.current.scrollTo(0)
    }
  }
}
