import {
  Build,
  buildAffiliation,
  buildBibliographicName,
  buildContributor,
  PROJECT_INVITATION,
  USER_PROFILE,
} from '@manuscripts/manuscript-editor'
import {
  Affiliation,
  Contributor,
  Manuscript,
  Model,
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { debounce } from 'lodash-es'
import React from 'react'
import { Redirect } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import Spinner from '../../icons/spinner'
import { projectInvite } from '../../lib/api'
import {
  buildAuthorPriority,
  buildAuthorsAndAffiliations,
  buildSortedAuthors,
} from '../../lib/authors'
import { buildUserMap } from '../../lib/data'
import { AuthorItem, DropSide } from '../../lib/drag-drop-authors'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
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
  project: Project | null
  collaborators: UserProfile[]
  nonAuthors: UserProfile[]
  userMap: Map<string, UserProfile>
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
}

class MetadataContainer extends React.Component<
  Props & ModelsProps & UserProps,
  State
> {
  public state: Readonly<State> = {
    editing: false,
    expanded: true,
    selectedAuthor: null,
    addingAuthors: false,
    project: null,
    collaborators: [],
    nonAuthors: [],
    userMap: new Map(),
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
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    this.subs.push(this.loadUserMap())
    this.subs.push(this.loadProject())
    this.subs.push(this.loadInvitations())
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
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
      project,
      isInvite,
      invitationValues,
      removeAuthorIsOpen,
      createAuthorIsOpen,
    } = this.state
    const { manuscript, user } = this.props

    const {
      affiliations,
      authors,
      authorAffiliations,
    } = buildAuthorsAndAffiliations(this.props.modelMap)

    if (!project) {
      return <Spinner />
    }

    if (!user.loaded) {
      return <Spinner />
    }

    if (!user.data) {
      if (user.error) {
        return <Spinner color={'red'} />
      }

      return <Redirect to={'/login'} />
    }

    // TODO: editable prop

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
        user={user.data}
        addingAuthors={addingAuthors}
        startAddingAuthors={this.startAddingAuthors}
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
        handleInvitationSubmit={this.handleInvitationSubmit}
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
        updateAuthor={this.updateAuthor}
        getAuthorName={this.getAuthorName}
      />
    )
  }

  private updateAuthor = async (author: Contributor, invitedEmail: string) => {
    const invitation = await this.getInvitation(invitedEmail)
    author.invitationID = invitation._id
    const data = {
      ...author,
    }

    const result = await this.props.saveModel<Contributor>(data)
    this.selectAuthor(result)
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

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  private loadUserMap = () =>
    this.getCollection()
      .find({ objectType: USER_PROFILE })
      .$.subscribe(async (docs: Array<RxDocument<UserProfile>>) => {
        this.setState({
          userMap: await buildUserMap(docs),
        })
      })

  private loadProject = () =>
    this.getCollection()
      .findOne(this.props.manuscript.containerID)
      .$.subscribe(async (doc: RxDocument<Project>) => {
        if (!doc) return

        const project = doc.toJSON() as Project

        const getCollaborator = (id: string) =>
          this.state.userMap.get(id) as UserProfile

        const collaborators = [
          ...project.owners.map(getCollaborator),
          ...project.writers.map(getCollaborator),
          ...project.viewers.map(getCollaborator),
        ].filter(collaborator => collaborator)

        this.setState({ project, collaborators })
      })

  private loadInvitations = () =>
    this.getCollection()
      .find({
        objectType: PROJECT_INVITATION,
        projectID: this.getProjectID(),
      })
      .$.subscribe((docs: Array<RxDocument<ProjectInvitation>>) => {
        const invitations = docs.map(invitation => invitation.toJSON())

        this.setState({
          invitations,
        })
      })

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

      const result = await this.props.saveModel<Contributor>(
        author as Contributor
      )
      this.setState({
        addedAuthors: this.state.addedAuthors.concat(author.userID as string),
        addedAuthorsCount: this.state.addedAuthorsCount + 1,
      })
      this.selectAuthor(result)
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

  private startAddingAuthors = () => {
    this.setState({ addingAuthors: true })

    const authors = buildSortedAuthors(this.props.modelMap)
    this.buildCollaborators(authors, this.state.collaborators)
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
    this.setState({ searchText: '', isInvite: false })

  private getProjectID = () => this.props.manuscript.containerID

  private handleInvitationSubmit = async (
    values: InvitationValues
  ): Promise<void> => {
    const { email, name, role } = values

    const projectID = this.getProjectID()
    const invitingUser = this.props.user.data as UserProfile
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

    if (create) {
      this.createInvitedAuthor(email, invitingID, name)
    }
  }

  private createInvitedAuthor = (
    invitedEmail: string,
    invitingID: string,
    name: string
  ) =>
    this.getCollection()
      .findOne({
        objectType: PROJECT_INVITATION,
        projectID: this.getProjectID(),
        invitedUserEmail: invitedEmail,
        invitingUserID: invitingID,
      })
      .$.subscribe(async (doc: RxDocument<ProjectInvitation>) => {
        if (!doc) return
        const invitation = doc.toJSON() as ProjectInvitation
        const authors = buildSortedAuthors(this.props.modelMap)
        await this.createAuthor(
          buildAuthorPriority(authors),
          null,
          name,
          invitation._id
        )
      })

  private buildInvitedAuthorsEmail = (authorInvitationIDs: string[]) => {
    const invitedAuthorsEmail: string[] = []
    for (const invitation of this.state.invitations) {
      if (authorInvitationIDs.includes(invitation._id)) {
        invitedAuthorsEmail.push(invitation.invitedUserEmail)
      }
    }
    return invitedAuthorsEmail
  }

  private buildCollaborators = (
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
    invitedEmail: string
  ): Promise<ProjectInvitation> => {
    const invitingUser = this.props.user.data as UserProfile
    return new Promise(resolve => {
      this.getCollection()
        .findOne({
          objectType: PROJECT_INVITATION,
          projectID: this.getProjectID(),
          invitedUserEmail: invitedEmail,
          invitingUserID: invitingUser.userID,
        })
        .$.subscribe((doc: RxDocument<ProjectInvitation>) => {
          const invitation = doc.toJSON()
          resolve(invitation)
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

export default withModels<Props>(withUser(MetadataContainer))
