import { TextSelection } from 'prosemirror-state'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { LibraryItems } from '../components/LibraryItems'
import {
  LibraryPicker,
  LibraryPickerItems,
  // LibraryPickerSources,
} from '../components/LibraryPicker'
import { componentsKey, INSERT } from '../editor/config/plugins/components'
import schema from '../editor/config/schema'
import { ToolbarDropdownProps } from '../editor/Toolbar'
import { buildCitation } from '../lib/commands'
// import Title from '../editor/Title'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { BIBLIOGRAPHY_ITEM } from '../transformer/object-types'
import { BibliographyItem, ComponentCollection } from '../types/components'
import { LibraryDocument } from '../types/library'
import { filterLibrary } from './LibraryContainer'

interface State {
  library: LibraryDocument[]
  query: string
  selectedSource: string
}

/*const sources = [
  {
    id: 'library',
    name: 'Library',
  },
]*/

interface RouteParams {
  projectID: string
}

class LibraryPickerContainer extends React.Component<
  ToolbarDropdownProps & ComponentsProps & RouteComponentProps<RouteParams>,
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
        containerID: this.props.match.params.projectID,
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
    const { state, view } = this.props

    const { selection } = state

    // TODO: is this enough/needed?
    const containingObject = selection.$anchor.parent

    const citation = buildCitation(containingObject.attrs.id, item.id)

    const citationNode = schema.nodes.citation.create({
      rid: citation.id,
    })

    // TODO: copy the bibliography item into the manuscript?
    const pos = selection.to

    let tr = state.tr
      .setMeta(componentsKey, { [INSERT]: [citation] })
      .insert(pos, citationNode)

    // restore the selection
    tr = tr.setSelection(
      TextSelection.create(tr.doc, pos + citationNode.nodeSize)
    )

    view.focus()
    view.dispatch(tr)

    this.props.handleClose()
  }

  private handleQuery = (query: string) => {
    this.setState({ query })
  }
}

export default withRouter<
  ToolbarDropdownProps & RouteComponentProps<RouteParams>
>(withComponents(LibraryPickerContainer))
