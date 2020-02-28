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

import AnnotationRemove from '@manuscripts/assets/react/AnnotationRemove'
import {
  BibliographyItem,
  Citation,
} from '@manuscripts/manuscripts-json-schema'
import {
  ButtonGroup,
  IconButton,
  PrimaryButton,
} from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import styled from 'styled-components'
import { shortLibraryItemMetadata } from '../../lib/library'
import { CitationSearch } from './CitationSearch'
import { DisplaySchemeSelector } from './DisplaySchemeSelector'

const CitedItem = styled.div`
  padding: ${props => props.theme.grid.unit * 4}px 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${props => props.theme.colors.border.secondary};
  }
`

const CitedItemTitle = styled(Title)``

const CitedItemMetadata = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  flex: 1;
  font-weight: ${props => props.theme.font.weight.light};
  margin-top: ${props => props.theme.grid.unit}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CitedItemActionLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
`

const CitedItemActions = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`

const CitedItems = styled.div`
  padding: 0 ${props => props.theme.grid.unit * 4}px;
  font-family: ${props => props.theme.font.family.sans};
  max-height: 70vh;
  overflow-y: auto;
`

const ActionButton = styled(IconButton).attrs({
  size: 24,
})``

const Actions = styled.div`
  margin: ${props => props.theme.grid.unit * 4}px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Options = styled.details`
  margin: ${props => props.theme.grid.unit * 4}px;
`

const OptionsSummary = styled.summary`
  cursor: pointer;

  &:focus {
    outline: 1px solid ${props => props.theme.colors.border.tertiary};
  }
`

interface Props {
  filterLibraryItems: (query: string) => Promise<BibliographyItem[]>
  importItems: (items: BibliographyItem[]) => Promise<BibliographyItem[]>
  handleCancel: () => void
  handleCite: (items: BibliographyItem[], query?: string) => Promise<void>
  handleRemove: (id: string) => void
  items: BibliographyItem[]
  projectID: string
  scheduleUpdate: () => void
  selectedText: string
  citation: Citation
  updateCitation: (data: Partial<Citation>) => Promise<void>
}

interface State {
  editing: BibliographyItem | null
  searching: boolean
}

class CitationEditor extends React.Component<Props, State> {
  public state: Readonly<State> = {
    editing: null,
    searching: false,
  }

  public render() {
    const {
      items,
      handleCite,
      selectedText,
      importItems,
      filterLibraryItems,
      citation,
      updateCitation,
    } = this.props
    const { searching } = this.state

    // if (editing) {
    //   return <div>TODO…</div>
    // }

    if (searching) {
      return (
        <CitationSearch
          query={selectedText}
          filterLibraryItems={filterLibraryItems}
          importItems={importItems}
          handleCite={handleCite}
          handleCancel={() => this.setState({ searching: false })}
        />
      )
    }

    if (!items.length) {
      return (
        <CitationSearch
          query={selectedText}
          filterLibraryItems={filterLibraryItems}
          importItems={importItems}
          handleCite={handleCite}
          handleCancel={this.props.handleCancel}
        />
      )
    }

    return (
      <div>
        <CitedItems>
          {items.map(item => (
            <CitedItem key={item._id}>
              <CitedItemTitle value={item.title || 'Untitled'} />

              <CitedItemActionLine>
                <CitedItemMetadata>
                  {shortLibraryItemMetadata(item)}
                </CitedItemMetadata>

                <CitedItemActions>
                  <ActionButton
                    onClick={() => {
                      if (confirm('Delete this cited item?')) {
                        this.props.handleRemove(item._id)
                      }
                    }}
                  >
                    <AnnotationRemove />
                  </ActionButton>
                </CitedItemActions>
              </CitedItemActionLine>
            </CitedItem>
          ))}
        </CitedItems>

        <Options>
          <OptionsSummary>Options</OptionsSummary>

          <DisplaySchemeSelector
            citation={citation}
            updateCitation={updateCitation}
          />
        </Options>

        <Actions>
          <ButtonGroup>
            <PrimaryButton onClick={() => this.setState({ searching: true })}>
              Add Citation
            </PrimaryButton>
          </ButtonGroup>
        </Actions>
      </div>
    )
  }
}

export default CitationEditor
