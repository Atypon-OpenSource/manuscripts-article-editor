import AnnotationRemove from '@manuscripts/assets/react/AnnotationRemove'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { issuedYear, shortAuthorsString } from '../../lib/library'
import { styled } from '../../theme'
import { PrimaryButton } from '../Button'
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

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
`

interface Props {
  filterLibraryItems: (query: string) => BibliographyItem[]
  handleCite: (items: BibliographyItem[], query?: string) => Promise<void>
  handleRemove: (id: string) => void
  handleUpdate: (id: string, data: Partial<BibliographyItem>) => void
  items: BibliographyItem[]
  projectID: string
  selectedText: string
  scheduleUpdate: () => void
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
    const { items, handleCite, selectedText, scheduleUpdate } = this.props
    const { searching } = this.state

    /*if (editing) {
      return <div>TODO…</div>
    }*/

    if (searching || !items.length) {
      return (
        <CitationSearch
          query={selectedText}
          filterLibraryItems={this.props.filterLibraryItems}
          handleCite={handleCite}
          handleCancel={() => this.setState({ searching: false })}
          scheduleUpdate={scheduleUpdate}
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
                <CitedItemAuthors>
                  {shortAuthorsString(item)} {issuedYear(item)}
                </CitedItemAuthors>

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
