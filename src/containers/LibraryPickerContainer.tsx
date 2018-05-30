import { EditorState } from 'prosemirror-state'
import React from 'react'
import { LibraryItems } from '../components/LibraryItems'
import {
  LibraryPicker,
  LibraryPickerItems,
  // LibraryPickerSources,
} from '../components/LibraryPicker'
import { componentsKey, INSERT } from '../editor/config/plugins/components'
import schema from '../editor/config/schema'
import { Dispatch } from '../editor/config/types'
// import Title from '../editor/Title'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { generateID } from '../transformer/id'
import {
  BIBLIOGRAPHY_ITEM,
  CITATION,
  CITATION_ITEM,
} from '../transformer/object-types'
import {
  BibliographyItem,
  Citation,
  ComponentCollection,
} from '../types/components'
import { LibraryDocument } from '../types/library'
import { filterLibrary } from './LibraryContainer'

interface State {
  library: LibraryDocument[]
  query: string
  selectedSource: string
}

interface Props {
  state: EditorState
  dispatch: Dispatch
  handleClose: () => void
}

/*const sources = [
  {
    id: 'library',
    name: 'Library',
  },
]*/

class LibraryPickerContainer extends React.Component<
  Props & ComponentsProps,
  State
> {
  public state = {
    library: [],
    query: '',
    selectedSource: 'library',
  }

  public componentDidMount() {
    this.getCollection()
      .find({
        objectType: BIBLIOGRAPHY_ITEM,
      })
      .sort({
        updatedAt: 'desc',
      })
      .$.subscribe((library: LibraryDocument[]) => {
        this.setState({ library })
      })
  }

  public render() {
    const { query, library, selectedSource } = this.state

    return (
      <LibraryPicker>
        {/*<LibraryPickerSources
          sources={sources}
          selectedSource={selectedSource}
          selectSource={this.selectSource}
        />*/}
        <LibraryPickerItems>
          {selectedSource === 'library' && (
            <LibraryItems
              query={query}
              handleQuery={this.handleQuery}
              handleSelect={this.handleSelect}
              hasItem={() => true}
              items={filterLibrary(library, query)}
            />
          )}
        </LibraryPickerItems>
      </LibraryPicker>
    )
  }

  /*private selectSource = (selectedSource: string) => {
    this.setState({ selectedSource })
  }*/

  private getCollection() {
    return this.props.components.collection as ComponentCollection
  }

  private handleSelect = (item: BibliographyItem) => {
    const { state, dispatch } = this.props

    // TODO: is this enough/needed?
    const containingElement = state.tr.selection.$anchor.parent

    const citation: Citation = {
      id: generateID('citation') as string,
      objectType: CITATION,
      containingElement: containingElement.attrs.id,
      embeddedCitationItems: [
        {
          bibliographyItem: item.id,
          id: generateID('citation_item') as string,
          objectType: CITATION_ITEM,
        },
      ],
    }

    const citationNode = schema.nodes.citation.create({
      rid: citation.id,
    })
    // TODO: copy the bibliography item into the manuscript?

    const tr = state.tr
      .setMeta(componentsKey, { [INSERT]: [citation] })
      .insert(state.tr.selection.to, citationNode)

    // TODO: restore selection

    dispatch(tr)

    this.props.handleClose()
  }

  private handleQuery = (query: string) => {
    this.setState({ query })
  }
}

export default withComponents(LibraryPickerContainer)
