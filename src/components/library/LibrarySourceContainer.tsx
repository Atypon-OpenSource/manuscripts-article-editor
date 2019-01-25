import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { Field, Form, Formik } from 'formik'
import React, { CSSProperties } from 'react'
import { LibrarySource } from '../../lib/sources'
import { styled } from '../../theme'
import { PrimarySubmitButton } from '../Button'
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

                const { items } = await source.search(query, 25)

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

    if (!source.fetch) {
      throw new Error('No fetch function defined')
    }

    source
      .fetch(item)
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
