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

import { Bundle } from '@manuscripts/manuscripts-json-schema'
import {
  CloseButton,
  ModalContainer,
  ModalHeader,
  ModalMain,
} from '@manuscripts/style-guide'
import fuzzysort from 'fuzzysort'
import React, { Component } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'

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
  height: ${(props) => props.theme.grid.unit * 8}px;
  background-image: linear-gradient(
    transparent,
    ${(props) => props.theme.colors.background.primary}
  );
`

const TemplateSearch = styled.div`
  flex-shrink: 0;
`

const ModalContainerInner = styled(ModalMain)`
  display: flex;
  flex-direction: column;
  height: calc(70vh - 24px - 32px);
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

  private sortPromise: Fuzzysort.CancelablePromise<
    Fuzzysort.KeysResults<Bundle>
  >

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
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={() => handleComplete()} />
        </ModalHeader>
        <ModalContainerInner>
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
        </ModalContainerInner>
      </ModalContainer>
    )
  }

  private filterBundles = async (searchText: string) => {
    const { items } = this.props

    if (!searchText) {
      return items
    }

    this.sortPromise = fuzzysort.goAsync<Bundle>(searchText.trim(), items, {
      keys: ['csl.title'],
      limit: 250,
      allowTypo: false,
      threshold: -10000,
    })

    const results = await this.sortPromise

    return results.map((result) => result.obj)
  }

  private handleSearchChange = async (searchText: string) => {
    this.setState({ searchText })

    if (this.sortPromise) {
      this.sortPromise.cancel()
    }

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
