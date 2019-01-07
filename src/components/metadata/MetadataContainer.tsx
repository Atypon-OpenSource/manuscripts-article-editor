import {
  Build,
  buildAffiliation,
  buildBibliographicName,
  buildContributor,
} from '@manuscripts/manuscript-editor'
import {
  Affiliation,
  Contributor,
  Manuscript,
  Model,
  ObjectTypes,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { debounce } from 'lodash-es'
import React from 'react'
import { RxCollection } from 'rxdb'
import ProjectData from '../../data/ProjectData'
import ProjectInvitationsData from '../../data/ProjectInvitationsData'
import UserData from '../../data/UserData'
import UsersData from '../../data/UsersData'
import { projectInvite } from '../../lib/api'
import {
  buildAuthorPriority,
  buildAuthorsAndAffiliations,
  buildSortedAuthors,
} from '../../lib/authors'
import { buildCollaborators } from '../../lib/collaborators'
import { AuthorItem, DropSide } from '../../lib/drag-drop-authors'
import { getCurrentUserId } from '../../lib/user'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { InvitationValues } from '../collaboration/InvitationForm'
import { AuthorValues } from './AuthorForm'
import { Metadata } from './Metadata'

interface Props {
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveManuscript?: (manuscript: Partial<Manuscript>) => Promise<void>
  saveModel: <T extends Model>(model: Build<T>) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  handleSectionChange: (section: string) => void
}

interface State {
  editing: boolean
  expanded: boolean
  selectedAuthor: Contributor | null
  addingAuthors: boolean
  nonAuthors: UserProfile[]
  addedAuthorsCount: number
  searchingAuthors: boolean
  searchText: string
  searchResults: UserProfile[]
  addedAuthors: string[]
  isInvite: boolean
  invitationValues: InvitationValues
  invitations: ProjectInvitation[]
  removeAuthorIsOpen: boolean
  createAuthorIsOpen: boolean
  hovered: boolean
  invitationSent: boolean
}

class MetadataContainer extends React.Component<Props & ModelsProps, State> {
  public state: Readonly<State> = {
    editing: false,
    expanded: true,
    selectedAuthor: null,
    addingAuthors: false,
    nonAuthors: [],
    addedAuthorsCount: 0,
    searchingAuthors: false,
    searchText: '',
    searchResults: [],
    addedAuthors: [],
    invitations: [],
    isInvite: false,
    invitationValues: {
      name: '',
      email: '',
      role: '',
    },
    removeAuthorIsOpen: false,
    createAuthorIsOpen: false,
    hovered: false,
    invitationSent: false,
  }

  public render() {
    const {
      editing,
      selectedAuthor,
      addingAuthors,
      nonAuthors,
      expanded,
      addedAuthorsCount,
      searchingAuthors,
      searchText,
      addedAuthors,
      searchResults,
      isInvite,
      invitationValues,
      removeAuthorIsOpen,
      createAuthorIsOpen,
      invitationSent,
    } = this.state

    const { manuscript } = this.props

    const {
      affiliations,
      authors,
      authorAffiliations,
    } = buildAuthorsAndAffiliations(this.props.modelMap)

    // TODO: editable prop

    return (
      <UsersData>
        {users => (
          <UserData userID={getCurrentUserId()!}>
            {user => (
              <ProjectData projectID={manuscript.containerID}>
                {project => (
                  <ProjectInvitationsData projectID={manuscript.containerID}>
                    {invitations => {
                      const collaborators = buildCollaborators(project, users)

                      return (
                        <Metadata
                          saveTitle={debounce(this.saveTitle, 1000)}
                          authors={authors}
                          editing={editing}
                          affiliations={affiliations}
                          startEditing={this.startEditing}
                          authorAffiliations={authorAffiliations}
                          selectAuthor={this.selectAuthor}
                          removeAuthor={this.removeAuthor}
                          createAuthor={this.createAuthor}
                          createAffiliation={this.createAffiliation}
                          handleSaveAuthor={this.handleSaveAuthor}
                          manuscript={manuscript}
                          selectedAuthor={selectedAuthor}
                          stopEditing={this.stopEditing}
                          toggleExpanded={this.toggleExpanded}
                          expanded={expanded}
                          project={project}
                          user={user}
                          addingAuthors={addingAuthors}
                          startAddingAuthors={this.startAddingAuthors(
                            collaborators
                          )}
                          nonAuthors={nonAuthors}
                          addedAuthorsCount={addedAuthorsCount}
                          searchingAuthors={searchingAuthors}
                          searchText={searchText}
                          addedAuthors={addedAuthors}
                          searchResults={searchResults}
                          isInvite={isInvite}
                          invitationValues={invitationValues}
                          checkInvitations={this.checkInvitations}
                          handleAddingDoneCancel={this.handleAddingDoneCancel}
                          handleSearchChange={this.handleSearchChange}
                          handleSearchFocus={this.handleSearchFocus}
                          handleInvite={this.handleInvite}
                          handleInviteCancel={this.handleInviteCancel}
                          handleInvitationSubmit={this.handleInvitationSubmit(
                            user
                          )}
                          handleDrop={this.handleDrop}
                          removeAuthorIsOpen={removeAuthorIsOpen}
                          handleRemoveAuthor={this.handleRemoveAuthor}
                          handleSectionChange={this.props.handleSectionChange}
                          authorExist={this.authorExist}
                          createAuthorIsOpen={createAuthorIsOpen}
                          handleCreateAuthor={this.handleCreateAuthor}
                          isRejected={this.isRejected}
                          hovered={this.state.hovered}
                          handleHover={this.handleHover}
                          updateAuthor={this.updateAuthor(user)}
                          getAuthorName={this.getAuthorName}
                          invitationSent={invitationSent}
                        />
                      )
                    }}
                  </ProjectInvitationsData>
                )}
              </ProjectData>
            )}
          </UserData>
        )}
      </UsersData>
    )
  }

  private updateAuthor = (invitingUser: UserProfile) => async (
    author: Contributor,
    invitedEmail: string
  ) => {
    const invitation = await this.getInvitation(invitingUser, invitedEmail)

    const updatedAuthor = await this.props.saveModel<Contributor>({
      ...author,
      invitationID: invitation._id,
    })

    this.selectAuthor(updatedAuthor)
  }

  private handleHover = () => {
    this.setState({
      hovered: !this.state.hovered,
    })
  }

  private handleCreateAuthor = () => {
    if (this.state.createAuthorIsOpen) {
      this.setState({
        searchText: '',
      })
    }
    this.setState({
      createAuthorIsOpen: !this.state.createAuthorIsOpen,
    })
  }

  private handleRemoveAuthor = () => {
    this.setState({ removeAuthorIsOpen: !this.state.removeAuthorIsOpen })
  }

  private authorExist = () => {
    const name = this.state.searchText
    const [given, ...family] = name.split(' ')
    const authors = buildSortedAuthors(this.props.modelMap)
    for (const author of authors) {
      if (
        author.bibliographicName.given!.toLowerCase() === given.toLowerCase() &&
        author.bibliographicName.family!.toLowerCase() ===
          family.join(' ').toLowerCase()
      ) {
        return true
      }
    }
    return false
  }

  private toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }

  private startEditing = () => {
    this.setState({ editing: true })
  }

  private stopEditing = () => {
    this.setState({
      editing: false,
      selectedAuthor: null,
      addingAuthors: false,
      isInvite: false,
      searchText: '',
    })
  }

  private saveTitle = async (title: string) => {
    await this.props.saveManuscript!({
      _id: this.props.manuscript._id,
      title,
    })
  }

  private createAuthor = async (
    priority: number,
    person?: UserProfile | null,
    name?: string,
    invitationID?: string
  ) => {
    if (name) {
      const [given, ...family] = name.split(' ')

      const bibName = buildBibliographicName({
        given,
        family: family.join(' '),
      })

      const author = invitationID
        ? buildContributor(bibName, 'author', priority, undefined, invitationID)
        : buildContributor(bibName, 'author', priority)

      await this.props.saveModel<Contributor>(author as Contributor)

      this.setState({
        addedAuthorsCount: this.state.addedAuthorsCount + 1,
        searchText: '',
      })
    }

    if (person) {
      const author = buildContributor(
        person.bibliographicName,
        'author',
        priority,
        person.userID
      )

      const createdAuthor = await this.props.saveModel<Contributor>(
        author as Contributor
      )

      this.setState({
        addedAuthors: this.state.addedAuthors.concat(author.userID as string),
        addedAuthorsCount: this.state.addedAuthorsCount + 1,
      })

      this.selectAuthor(createdAuthor)
    }
  }

  private createAffiliation = async (name: string): Promise<Affiliation> => {
    const affiliation = buildAffiliation(name)

    return this.props.saveModel<Affiliation>(affiliation)
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
    await this.props.deleteModel(author._id)
    this.deselectAuthor()
    if (this.state.addedAuthors.includes(author.userID as string)) {
      const index = this.state.addedAuthors.indexOf(author.userID as string)
      this.state.addedAuthors.splice(index, 1)
    }
    this.handleRemoveAuthor()
  }

  private startAddingAuthors = (collaborators: UserProfile[]) => () => {
    this.setState({ addingAuthors: true })

    const authors = buildSortedAuthors(this.props.modelMap)
    this.buildNonAuthors(authors, collaborators)
  }

  private handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ searchText: event.currentTarget.value })

    this.search(event.currentTarget.value)
  }

  private search = (searchText: string) => {
    const { nonAuthors } = this.state

    if (!nonAuthors || !searchText) {
      return this.setState({ searchResults: [] })
    }

    searchText = searchText.toLowerCase()

    const searchResults: UserProfile[] = nonAuthors.filter(person => {
      if (searchText.includes('@')) {
        return person.email && person.email.toLowerCase().includes(searchText)
      }

      const personName = [
        person.bibliographicName.given,
        person.bibliographicName.family,
      ]
        .filter(part => part)
        .join(' ')
        .toLowerCase()

      return personName && personName.includes(searchText)
    })

    this.setState({ searchResults })
  }

  private handleSearchFocus = () =>
    this.setState({
      searchingAuthors: !this.state.searchingAuthors,
    })

  private handleAddingDoneCancel = () =>
    this.setState({
      addedAuthorsCount: 0,
      addingAuthors: false,
      searchText: '',
    })

  private handleInvite = () => {
    const { searchText } = this.state
    const invitationValues = {
      name: '',
      email: '',
      role: 'Writer',
    }

    if (searchText.includes('@')) {
      invitationValues.email = searchText
    } else {
      invitationValues.name = searchText
    }

    this.setState({ invitationValues, isInvite: true })
  }

  private handleInviteCancel = () =>
    this.setState({ searchText: '', isInvite: false, invitationSent: false })

  private handleInvitationSubmit = (invitingUser: UserProfile) => async (
    values: InvitationValues
  ): Promise<void> => {
    const { email, name, role } = values

    const projectID = this.props.manuscript.containerID
    const invitingID = invitingUser.userID

    let create = true
    for (const invitation of this.state.invitations) {
      if (
        invitation.projectID === projectID &&
        invitation.invitedUserEmail === email
      ) {
        create = false
        break
      }
    }

    await projectInvite(projectID, [{ email, name }], role)
    this.setState({ invitationSent: true })

    if (create) {
      this.createInvitedAuthor(email, invitingID, name)
    }
  }

  private createInvitedAuthor = (
    invitedEmail: string,
    invitingID: string,
    name: string
  ) => {
    const collection = this.props.models.collection as RxCollection<
      ProjectInvitation
    >

    const sub = collection
      .findOne({
        objectType: ObjectTypes.ProjectInvitation,
        projectID: this.props.manuscript.containerID,
        invitedUserEmail: invitedEmail,
        invitingUserID: invitingID,
      })
      .$.subscribe(async doc => {
        if (doc) {
          sub.unsubscribe()

          const invitation = doc.toJSON()
          const authors = buildSortedAuthors(this.props.modelMap)

          await this.createAuthor(
            buildAuthorPriority(authors),
            null,
            name,
            invitation._id
          )
        }
      })
  }

  private buildInvitedAuthorsEmail = (authorInvitationIDs: string[]) => {
    const invitedAuthorsEmail: string[] = []
    for (const invitation of this.state.invitations) {
      if (authorInvitationIDs.includes(invitation._id)) {
        invitedAuthorsEmail.push(invitation.invitedUserEmail)
      }
    }
    return invitedAuthorsEmail
  }

  private buildNonAuthors = (
    authors: Contributor[],
    collaborators: UserProfile[]
  ) => {
    const userIDs: string[] = authors.map(author => author.userID as string)
    const invitationsID: string[] = authors.map(author => author.invitationID!)

    const invitedAuthorsEmail: string[] = this.buildInvitedAuthorsEmail(
      invitationsID
    )

    const nonAuthors: UserProfile[] = collaborators.filter(
      person =>
        !userIDs.includes(person.userID) &&
        !invitedAuthorsEmail.includes(person.email as string)
    )

    this.setState({ nonAuthors })
  }

  private handleSaveAuthor = async (values: AuthorValues) => {
    const { selectedAuthor } = this.state

    if (!selectedAuthor) return

    // TODO: only save affiliations and grants that have changed

    await Promise.all(
      values.affiliations.map((item: Affiliation) =>
        this.props.saveModel<Affiliation>(item)
      )
    )

    const author = {
      ...selectedAuthor,
      ...values,
      affiliations: values.affiliations.map(item => item._id),
    }

    delete author.containerID

    await this.props.saveModel<Contributor>(author)
  }

  private handleDrop = async (
    source: AuthorItem,
    target: AuthorItem,
    side: DropSide,
    authors: Contributor[]
  ) => {
    if (source.index > target.index) {
      const addIndex = side === 'after' ? 1 : 0

      authors[source.index].priority = (target.priority as number) + addIndex

      await this.props.saveModel<Contributor>(authors[source.index])
      await this.decreasePriority(source, target, authors, addIndex)
    } else if (source.index < target.index) {
      const subIndex = side === 'before' ? 1 : 0

      authors[source.index].priority = (target.priority as number) - subIndex

      await this.props.saveModel<Contributor>(authors[source.index])
      await this.increasePriority(source, target, authors, subIndex)
    }
  }

  private async decreasePriority(
    source: AuthorItem,
    target: AuthorItem,
    authors: Contributor[],
    addIndex: number
  ) {
    for (let idx = source.index - 1; idx >= target.index + addIndex; idx--) {
      authors[idx].priority = Number(authors[idx].priority) + 1
      await this.props.saveModel<Contributor>(authors[idx])
    }
  }

  private async increasePriority(
    source: AuthorItem,
    target: AuthorItem,
    authors: Contributor[],
    subIndex: number
  ) {
    for (let idx = source.index + 1; idx <= target.index - subIndex; idx++) {
      authors[idx].priority = Number(authors[idx].priority) - 1
      await this.props.saveModel<Contributor>(authors[idx])
    }
  }

  private checkInvitations = (author: Contributor) => {
    for (const invitation of this.state.invitations) {
      if (invitation._id === author.invitationID) {
        return !invitation.acceptedAt
      }
    }
    return false
  }

  private isRejected = (invitationID: string) => {
    for (const invitation of this.state.invitations) {
      if (invitation._id === invitationID) {
        return false
      }
    }
    return true
  }

  private getInvitation = (
    invitingUser: UserProfile,
    invitedEmail: string
  ): Promise<ProjectInvitation> => {
    return new Promise(resolve => {
      const collection = this.props.models.collection as RxCollection<
        ProjectInvitation
      >

      const sub = collection
        .findOne({
          objectType: ObjectTypes.ProjectInvitation,
          projectID: this.props.manuscript.containerID,
          invitedUserEmail: invitedEmail,
          invitingUserID: invitingUser.userID,
        })
        .$.subscribe(doc => {
          if (doc) {
            sub.unsubscribe()
            resolve(doc.toJSON())
          }
        })
    })
  }

  private getAuthorName = (author: Contributor) => {
    const name = !author.bibliographicName.given
      ? 'Author '
      : author.bibliographicName.given + ' ' + author.bibliographicName.family
    return name
  }
}

export default withModels<Props>(MetadataContainer)
