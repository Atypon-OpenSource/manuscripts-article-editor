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
import { PrimarySubmitButton } from '@manuscripts/style-guide'
import { Field, Form, Formik } from 'formik'
import React, { CSSProperties } from 'react'
import config from '../../config'
import { LibrarySource } from '../../lib/sources'
import { styled } from '../../theme/styled-components'
import { Main } from '../Page'
import { LibraryItem } from './LibraryItem'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Results = styled.div`
  flex: 1;
  overflow-y: auto;
`

const SearchContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
`

const searchStyle: CSSProperties = {
  padding: 4,
  margin: 5,
  fontSize: '0.9em',
  flex: 1,
  WebkitAppearance: 'none',
  border: '1px solid #ccc',
  borderRadius: 5,
}

interface Values {
  query: string
}

interface State {
  items: Array<Partial<BibliographyItem>>
  query: string
}

interface Props {
  source: LibrarySource
  handleAdd: (item: BibliographyItem) => void
  hasItem: (item: BibliographyItem) => boolean
}

class LibrarySourceContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    items: [],
    query: '',
  }

  public render() {
    const { items, query } = this.state

    return (
      <React.Fragment>
        <Main>
          <Container>
            <Formik<Values>
              initialValues={{ query }}
              onSubmit={async values => {
                const { query } = values

                this.setState({ query })

                const { source } = this.props

                if (!source.search) {
                  throw new Error('No search function defined')
                }

                const { items } = await source.search(
                  query,
                  25,
                  config.support.email
                )

                this.setState({ items })
              }}
            >
              <Form>
                <SearchContainer>
                  <Field
                    type={'search'}
                    name={'query'}
                    placeholder={'Search terms…'}
                    style={searchStyle}
                    autoComplete={'off'}
                    autoFocus={true}
                  />
                  <PrimarySubmitButton>Search</PrimarySubmitButton>
                </SearchContainer>
              </Form>
            </Formik>

            <Results>
              {items.map((item: BibliographyItem) => (
                <LibraryItem
                  key={item.DOI}
                  handleSelect={this.handleAdd}
                  hasItem={this.props.hasItem}
                  item={item}
                />
              ))}
            </Results>
          </Container>
        </Main>
      </React.Fragment>
    )
  }

  private handleAdd = (item: BibliographyItem) => {
    const { source, hasItem } = this.props

    if (hasItem(item)) {
      alert('Already added')
      return
    }

    if (!item.DOI) {
      throw new Error('No DOI available')
    }

    if (!source.fetch) {
      throw new Error('No fetch function defined')
    }

    source
      .fetch(item.DOI, config.support.email)
      .then(this.props.handleAdd)
      .then(() => {
        // TODO: 'adding' state
        console.log('added') // tslint:disable-line:no-console
      })
      .catch((error: Error) => {
        // TODO: 'failed' state
        console.error('failed to add', error) // tslint:disable-line:no-console
      })
  }
}

export default LibrarySourceContainer
