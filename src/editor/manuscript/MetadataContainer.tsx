import { debounce } from 'lodash-es'
import React from 'react'
import { ComponentsProps, withComponents } from '../../store/ComponentsProvider'
import { generateID } from '../../transformer/id'
import {
  AFFILIATION,
  BIBLIOGRAPHIC_NAME,
  CONTRIBUTOR,
} from '../../transformer/object-types'
import {
  Affiliation,
  ComponentMap,
  Contributor,
  Manuscript,
} from '../../types/components'
import { DeleteComponent, SaveComponent } from '../Editor'
import { AuthorValues } from './AuthorForm'
import { buildAuthorsAndAffiliations } from './lib/authors'
import { Metadata } from './Metadata'

type SaveManuscript = (manuscript: Partial<Manuscript>) => Promise<void>

interface Props {
  manuscript: Manuscript
  componentMap: ComponentMap
  saveManuscript?: SaveManuscript
  saveComponent: SaveComponent
  deleteComponent: DeleteComponent
}

interface State {
  editing: boolean
  selectedAuthor: Contributor | null
}

class MetadataContainer extends React.Component<
  Props & ComponentsProps,
  State
> {
  public state: Readonly<State> = {
    editing: false,
    selectedAuthor: null,
  }

  public render() {
    const {
      affiliations,
      authors,
      authorAffiliations,
    } = buildAuthorsAndAffiliations(this.props.componentMap)

    // TODO: editable prop

    return (
      <Metadata
        saveTitle={debounce(this.saveTitle, 1000)}
        authors={authors}
        editing={this.state.editing}
        affiliations={affiliations}
        startEditing={this.startEditing}
        authorAffiliations={authorAffiliations}
        selectAuthor={this.selectAuthor}
        removeAuthor={this.removeAuthor}
        createAuthor={this.createAuthor}
        createAffiliation={this.createAffiliation}
        handleSaveAuthor={this.handleSaveAuthor}
        manuscript={this.props.manuscript}
        selectedAuthor={this.state.selectedAuthor}
        stopEditing={this.stopEditing}
      />
    )
  }

  private startEditing = () => {
    this.setState({ editing: true })
  }

  private stopEditing = () => {
    this.setState({
      editing: false,
      selectedAuthor: null,
    })
  }

  private saveTitle = async (title: string) => {
    await (this.props.saveManuscript as SaveManuscript)({
      id: this.props.manuscript.id,
      title,
    })
  }

  private createAuthor = async (priority: number) => {
    const author: Contributor = {
      id: generateID('contributor') as string,
      objectType: CONTRIBUTOR,
      role: 'author',
      priority,
      bibliographicName: {
        id: generateID('bibliographic_name') as string,
        objectType: BIBLIOGRAPHIC_NAME,
        given: '',
        family: '',
        suffix: '',
      },
    }

    await this.props.saveComponent(author)

    this.selectAuthor(author)
  }

  private createAffiliation = async (name: string) => {
    const affiliation: Affiliation = {
      id: generateID('affiliation') as string,
      objectType: AFFILIATION,
      name,
    }

    await this.props.saveComponent(affiliation)

    return affiliation
  }

  private selectAuthor = (selectedAuthor: Contributor) => {
    // TODO: make this switch without deselecting
    this.setState({ selectedAuthor: null }, () => {
      this.setState({ selectedAuthor })
    })
  }

  private deselectAuthor = () => {
    this.setState({ selectedAuthor: null })
  }

  private removeAuthor = async (author: Contributor) => {
    await this.props.deleteComponent(author.id)
    this.deselectAuthor()
  }

  private handleSaveAuthor = async (values: AuthorValues) => {
    const { selectedAuthor } = this.state

    if (!selectedAuthor) return

    // TODO: only save affiliations and grants that have changed

    await Promise.all(
      values.affiliations.map((item: Affiliation) =>
        this.props.saveComponent(item)
      )
    )

    // await Promise.all(
    //   values.grants.map((item: Grant) =>
    //     this.props.components.saveComponent(this.props.manuscript.id, item)
    //   )
    // )

    await this.props.saveComponent({
      ...selectedAuthor,
      ...values,
      affiliations: values.affiliations.map(item => item.id),
      // grants: props.values.grants.map(item => item.id),
    })

    // this.deselectAuthor()
  }
}

export default withComponents<Props>(MetadataContainer)
