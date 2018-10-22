import { TextSelection } from 'prosemirror-state'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { INSERT, modelsKey } from '../../editor/config/plugins/models'
import schema from '../../editor/config/schema/index'
import { ToolbarDropdownProps } from '../../editor/Toolbar'
import { buildCitation } from '../../lib/commands'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { BIBLIOGRAPHY_ITEM } from '../../transformer/object-types'
import { BibliographyItem } from '../../types/models'

import { filterLibrary } from './LibraryContainer'
import { LibraryItems } from './LibraryItems'
import {
  LibraryPicker,
  LibraryPickerItems,
  // LibraryPickerSources,
} from './LibraryPicker'

interface State {
  library: Array<RxDocument<BibliographyItem>>
  query: string
  selectedSource: string
}

/*const sources = [
  {
    _id: 'library',
    name: 'Library',
  },
]*/

interface RouteParams {
  projectID: string
}

class LibraryPickerContainer extends React.Component<
  ToolbarDropdownProps & ModelsProps & RouteComponentProps<RouteParams>,
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
      .$.subscribe((library: Array<RxDocument<BibliographyItem>>) => {
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
    return this.props.models.collection as RxCollection<BibliographyItem>
  }

  private handleSelect = (item: BibliographyItem) => {
    const { state, view } = this.props

    const { selection } = state

    // TODO: is this enough/needed?
    const containingObject = selection.$anchor.parent

    const citation = buildCitation(containingObject.attrs.id, item._id)

    const citationNode = schema.nodes.citation.create({
      rid: citation._id,
    })

    // TODO: copy the bibliography item into the manuscript?
    const pos = selection.to

    let tr = state.tr
      .setMeta(modelsKey, { [INSERT]: [citation] })
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
>(withModels(LibraryPickerContainer))
