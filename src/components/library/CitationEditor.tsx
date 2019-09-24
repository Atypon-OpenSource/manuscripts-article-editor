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
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { ButtonGroup, PrimaryButton } from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { libraryItemMetadata } from '../../lib/library'
import { styled } from '../../theme/styled-components'
import { CitationSearch } from './CitationSearch'

const CitedItem = styled.div`
  padding: 16px 0;
  cursor: pointer;

  &:not(:last-of-type) {
    border-bottom: 1px solid #eee;
  }
`

const CitedItemTitle = styled(Title)``

const CitedItemAuthors = styled.div`
  margin-top: 4px;
  color: #777;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
  padding: 0 16px;
  font-family: ${props => props.theme.fontFamily};
  max-height: 70vh;
  overflow-y: auto;
`

const ActionButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  height: 24px;
`

const Actions = styled(ButtonGroup)`
  padding: 16px;
`

interface Props {
  filterLibraryItems: (query: string) => BibliographyItem[]
  importItems: (items: BibliographyItem[]) => Promise<BibliographyItem[]>
  handleCancel: () => void
  handleCite: (items: BibliographyItem[], query?: string) => Promise<void>
  handleRemove: (id: string) => void
  items: BibliographyItem[]
  projectID: string
  scheduleUpdate: () => void
  selectedText: string
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
    } = this.props
    const { searching } = this.state

    /*if (editing) {
      return <div>TODO…</div>
    }*/

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
            <CitedItem
              key={item._id}
              onClick={() => {
                if (item.DOI) {
                  window.open(`https://doi.org/${item.DOI}`)
                }
              }}
            >
              <CitedItemTitle value={item.title || 'Untitled'} />

              <CitedItemActionLine>
                <CitedItemAuthors>{libraryItemMetadata(item)}</CitedItemAuthors>

                <CitedItemActions>
                  {/*     <ActionButton
                    onClick={() => this.setState({ editing: item })}
                  >
                    <AnnotationEdit />
                  </ActionButton>*/}
                  <ActionButton
                    onMouseDown={event => {
                      event.preventDefault()

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

        <Actions>
          <PrimaryButton onClick={() => this.setState({ searching: true })}>
            Add Citation
          </PrimaryButton>
        </Actions>
      </div>
    )
  }
}

export default CitationEditor
