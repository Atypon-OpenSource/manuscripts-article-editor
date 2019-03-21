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

import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { filterLibrary } from '../../lib/library'
import { styled } from '../../theme/styled-components'
import { Main } from '../Page'
import Panel from '../Panel'
import LibraryForm from './LibraryForm'
import { LibraryItems } from './LibraryItems'

const StyledMain = styled(Main)`
  border-right: 1px solid
    ${props => props.theme.colors.sidebar.background.selected};
`

interface Props {
  library: Map<string, BibliographyItem>
  handleDelete: (item: BibliographyItem) => Promise<string>
  handleSave: (item: BibliographyItem) => Promise<BibliographyItem>
  projectID: string
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
    const { library, projectID } = this.props
    const { item, query } = this.state

    return (
      <React.Fragment>
        <StyledMain>
          <LibraryItems
            query={query}
            handleQuery={value => {
              this.setState({
                query: value === query ? '' : value,
              })
            }}
            handleSelect={item => {
              this.setState({ item })
            }}
            hasItem={() => true}
            items={filterLibrary(library, query)}
            projectID={projectID}
          />
        </StyledMain>

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
