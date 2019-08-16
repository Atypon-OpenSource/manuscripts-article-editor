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

import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { filterLibrary } from '../../lib/library'
import { Main } from '../Page'
import Panel from '../Panel'
import LibraryForm from './LibraryForm'
import { LibraryItems } from './LibraryItems'

interface Props {
  library: Map<string, BibliographyItem>
  handleDelete: (item: BibliographyItem) => Promise<string>
  handleQuery: (query: string) => void
  handleSave: (item: BibliographyItem) => Promise<BibliographyItem>
  projectID: string
  query: string | null
  selectedKeywords?: Set<string>
}

interface State {
  item: BibliographyItem | null
  items: Map<string, BibliographyItem>
  query: string
}

class LibraryContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    item: null,
    items: new Map(),
    query: '',
  }

  public render() {
    const {
      library,
      projectID,
      query,
      handleQuery,
      selectedKeywords,
    } = this.props
    const { item } = this.state

    return (
      <React.Fragment>
        <Main>
          <LibraryItems
            query={query}
            handleQuery={handleQuery}
            handleSelect={item => {
              this.setState({ item })
            }}
            hasItem={() => true}
            items={filterLibrary(library, query, selectedKeywords)}
            projectID={projectID}
            selectedKeywords={selectedKeywords}
          />
        </Main>

        <Panel
          name={'libraryItem'}
          side={'start'}
          direction={'row'}
          minSize={300}
        >
          {item && (
            <LibraryForm
              item={item}
              handleSave={async item => {
                await this.props.handleSave(item)
                this.setState({ item: null })
              }}
              handleDelete={async item => {
                await this.props.handleDelete(item)
                this.setState({ item: null })
              }}
              projectID={projectID}
            />
          )}
        </Panel>
      </React.Fragment>
    )
  }
}

export default LibraryContainer
