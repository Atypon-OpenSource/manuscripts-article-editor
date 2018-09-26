import { FormikActions, FormikErrors } from 'formik'
import { debounce } from 'lodash-es'
import React from 'react'
import { Redirect } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import {
  InvitationErrors,
  InvitationValues,
} from '../../components/InvitationForm'
import Spinner from '../../icons/spinner'
import { projectInvite } from '../../lib/api'
import {
  buildAffiliation,
  buildBibliographicName,
  buildContributor,
} from '../../lib/commands'
import { ComponentsProps, withComponents } from '../../store/ComponentsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { getComponentFromDoc } from '../../transformer/decode'
import {
  PROJECT_INVITATION,
  USER_PROFILE,
} from '../../transformer/object-types'
import {
  Affiliation,
  Attachments,
  ComponentMap,
  Contributor,
  Manuscript,
  Project,
  ProjectInvitation,
  UserProfile,
} from '../../types/components'
import { DeleteComponent, SaveComponent } from '../Editor'
import { AuthorValues } from './AuthorForm'
import {
  buildAuthorPriority,
  buildAuthorsAndAffiliations,
  buildSortedAuthors,
} from './lib/authors'
import { AuthorItem, DropSide } from './lib/drag-drop'
import { Metadata } from './Metadata'

type SaveManuscript = (manuscript: Partial<Manuscript>) => Promise<void>

interface Props {
  manuscript: Manuscript
  componentMap: ComponentMap
  saveManuscript?: SaveManuscript
  saveComponent: SaveComponent
  deleteComponent: DeleteComponent
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
  isRemovePopperOpen: boolean
}

class MetadataContainer extends React.Component<
  Props & ComponentsProps & UserProps,
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
    isRemovePopperOpen: false,
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
      isRemovePopperOpen,
    } = this.state
    const { manuscript, user } = this.props

    const {
      affiliations,
      authors,
      authorAffiliations,
    } = buildAuthorsAndAffiliations(this.props.componentMap)

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
        isRemovePopperOpen={isRemovePopperOpen}
        handleRemovePopperOpen={this.handleRemovePopperOpen}
        handleSectionChange={this.props.handleSectionChange}
      />
    )
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
    return this.props.components.collection as RxCollection<{}>
  }

  private handleRemovePopperOpen = () =>
    this.setState({ isRemovePopperOpen: !this.state.isRemovePopperOpen })

  private loadUserMap = () =>
    this.getCollection()
      .find({ objectType: USER_PROFILE })
      .$.subscribe(
        async (docs: Array<RxDocument<UserProfile & Attachments>>) => {
          const users = await Promise.all(
            docs.map(doc => getComponentFromDoc<UserProfile>(doc))
          )

          const userMap = users.reduce((output, user) => {
            output.set(user.userID, user)
            return output
          }, new Map())

          this.setState({ userMap })
        }
      )

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
    await (this.props.saveManuscript as SaveManuscript)({
      id: this.props.manuscript.id,
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
        ? buildContributor(bibName, 'author', priority, null, invitationID)
        : buildContributor(bibName, 'author', priority)
      await this.props.saveComponent<Contributor>(author as Contributor)
      this.setState({
        addedAuthorsCount: this.state.addedAuthorsCount + 1,
      })
    }

    if (person) {
      const author = buildContributor(
        person.bibliographicName,
        'author',
        priority,
        person.userID
      )

      const result = await this.props.saveComponent<Contributor>(
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

    return this.props.saveComponent<Affiliation>(affiliation)
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
    if (this.state.addedAuthors.includes(author.userID as string)) {
      const index = this.state.addedAuthors.indexOf(author.userID as string)
      this.state.addedAuthors.splice(index, 1)
    }
  }

  private startAddingAuthors = () => {
    this.setState({ addingAuthors: true })

    const authors = buildSortedAuthors(this.props.componentMap)
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
      role: '',
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

  private handleInvitationSubmit = (
    values: InvitationValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<InvitationValues | InvitationErrors>
  ) => {
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

    projectInvite(projectID, [{ email, name }], role, 'message').then(
      () => {
        setSubmitting(false)
        if (create) {
          this.createInvitedAuthor(email, invitingID, name)
        }
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<InvitationErrors> = {}

        if (error.response) {
          errors.submit = error.response
        }

        setErrors(errors)
      }
    )
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
        const authors = buildSortedAuthors(this.props.componentMap)
        await this.createAuthor(
          buildAuthorPriority(authors),
          null,
          name,
          invitation.id
        )
      })

  private buildInvitedAuthorsEmail = (authorInvitationIDs: string[]) => {
    const invitedAuthorsEmail: string[] = []
    for (const invitation of this.state.invitations) {
      if (authorInvitationIDs.includes(invitation.id)) {
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

  private handleDrop = async (
    source: AuthorItem,
    target: AuthorItem,
    side: DropSide,
    authors: Contributor[]
  ) => {
    if (source.index > target.index) {
      const addIndex = side === 'after' ? 1 : 0

      authors[source.index].priority = (target.priority as number) + addIndex

      await this.props.saveComponent<Contributor>(authors[source.index])
      await this.decreasePriority(source, target, authors, addIndex)
    } else if (source.index < target.index) {
      const subIndex = side === 'before' ? 1 : 0

      authors[source.index].priority = (target.priority as number) - subIndex

      await this.props.saveComponent<Contributor>(authors[source.index])
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
      authors[idx].priority =
        authors[idx].priority !== undefined
          ? (authors[idx].priority as number) + 1
          : undefined
      await this.props.saveComponent<Contributor>(authors[idx])
    }
  }

  private async increasePriority(
    source: AuthorItem,
    target: AuthorItem,
    authors: Contributor[],
    subIndex: number
  ) {
    for (let idx = source.index + 1; idx <= target.index - subIndex; idx++) {
      authors[idx].priority =
        authors[idx].priority !== undefined
          ? (authors[idx].priority as number) - 1
          : undefined
      await this.props.saveComponent<Contributor>(authors[idx])
    }
  }

  private checkInvitations = (author: Contributor) => {
    for (const invitation of this.state.invitations) {
      if (invitation.id === author.invitationID) {
        return !invitation.acceptedAt
      }
    }
    return false
  }
}

export default withComponents<Props>(withUser(MetadataContainer))
