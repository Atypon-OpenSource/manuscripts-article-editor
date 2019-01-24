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
import CollaboratorsData from '../../data/CollaboratorsData'
import ProjectData from '../../data/ProjectData'
import ProjectInvitationsData from '../../data/ProjectInvitationsData'
import UserData from '../../data/UserData'
import { projectInvite } from '../../lib/api'
import {
  buildAuthorPriority,
  buildAuthorsAndAffiliations,
  buildSortedAuthors,
} from '../../lib/authors'
import { buildCollaborators } from '../../lib/collaborators'
import { AuthorItem, DropSide } from '../../lib/drag-drop-authors'
import { getCurrentUserId } from '../../lib/user'
import { InvitationValues } from '../collaboration/InvitationForm'
import { AuthorValues } from './AuthorForm'
import { Metadata } from './Metadata'

interface Props {
  collection: RxCollection<Model>
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveManuscript?: (manuscript: Partial<Manuscript>) => Promise<void>
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  handleSectionChange: (section: string) => void
}

interface State {
  editing: boolean
  expanded: boolean
  selectedAuthor: Contributor | null
  addingAuthors: boolean
  nonAuthors: UserProfile[]
  numberOfAddedAuthors: number
  addedAuthors: string[]
  isInvite: boolean
  invitationValues: InvitationValues
  invitationSent: boolean
}

class MetadataContainer extends React.PureComponent<Props, State> {
  public state: Readonly<State> = {
    editing: false,
    expanded: true,
    selectedAuthor: null,
    addingAuthors: false,
    nonAuthors: [],
    numberOfAddedAuthors: 0,
    addedAuthors: [],
    isInvite: false,
    invitationSent: false,
    invitationValues: {
      name: '',
      email: '',
      role: '',
    },
  }

  public render() {
    const {
      editing,
      selectedAuthor,
      addingAuthors,
      nonAuthors,
      expanded,
      numberOfAddedAuthors,
      addedAuthors,
      isInvite,
      invitationValues,
      invitationSent,
    } = this.state
    const { manuscript, modelMap } = this.props

    const {
      affiliations,
      authors,
      authorAffiliations,
    } = buildAuthorsAndAffiliations(this.props.modelMap)

    // TODO: editable prop

    return (
      <CollaboratorsData>
        {collaborators => (
          <UserData userID={getCurrentUserId()!}>
            {user => (
              <ProjectData projectID={manuscript.containerID}>
                {project => (
                  <ProjectInvitationsData projectID={manuscript.containerID}>
                    {invitations => {
                      return (
                        <Metadata
                          modelMap={modelMap}
                          saveTitle={debounce(this.saveTitle, 1000)}
                          authors={authors}
                          invitations={invitations}
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
                          openAddAuthors={this.startAddingAuthors(
                            buildCollaborators(project, collaborators),
                            invitations
                          )}
                          numberOfAddedAuthors={numberOfAddedAuthors}
                          nonAuthors={nonAuthors}
                          addedAuthors={addedAuthors}
                          isInvite={isInvite}
                          invitationValues={invitationValues}
                          handleAddingDoneCancel={this.handleAddingDoneCancel}
                          handleInvite={this.handleInvite}
                          handleInviteCancel={this.handleInviteCancel}
                          handleInvitationSubmit={this.handleInvitationSubmit(
                            user,
                            invitations
                          )}
                          handleDrop={this.handleDrop}
                          handleSectionChange={this.props.handleSectionChange}
                          updateAuthor={this.updateAuthor(user)}
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
      </CollaboratorsData>
    )
  }

  private updateAuthor = (invitingUser: UserProfile) => async (
    author: Contributor,
    invitedEmail: string
  ) => {
    const invitation = await this.getInvitation(invitingUser, invitedEmail)

    const updatedAuthor: Contributor = await this.props.saveModel({
      ...author,
      invitationID: invitation._id,
    })

    this.selectAuthor(updatedAuthor)
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

      await this.props.saveModel(author)

      this.setState({
        numberOfAddedAuthors: this.state.numberOfAddedAuthors + 1,
      })
    }

    if (person) {
      const author = buildContributor(
        person.bibliographicName,
        'author',
        priority,
        person.userID
      )

      const createdAuthor: Contributor = await this.props.saveModel(author)

      this.setState({
        addedAuthors: this.state.addedAuthors.concat(author.userID as string),
        numberOfAddedAuthors: this.state.numberOfAddedAuthors + 1,
      })

      this.selectAuthor(createdAuthor)
    }
  }

  private createAffiliation = async (name: string): Promise<Affiliation> => {
    const affiliation = buildAffiliation(name)

    return this.props.saveModel(affiliation)
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
  }

  private startAddingAuthors = (
    collaborators: UserProfile[],
    invitations: ProjectInvitation[]
  ) => () => {
    this.setState({ addingAuthors: true })

    const authors = buildSortedAuthors(this.props.modelMap)
    this.buildNonAuthors(authors, collaborators, invitations)
  }

  private handleAddingDoneCancel = () =>
    this.setState({ numberOfAddedAuthors: 0, addingAuthors: false })

  private handleInvite = (searchText: string) => {
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
    this.setState({ isInvite: false, invitationSent: false })

  private handleInvitationSubmit = (
    invitingUser: UserProfile,
    invitations: ProjectInvitation[]
  ) => async (values: InvitationValues): Promise<void> => {
    const { email, name, role } = values

    const projectID = this.props.manuscript.containerID
    const invitingID = invitingUser.userID

    const alreadyInvited = invitations.some(
      invitation =>
        invitation.projectID === projectID &&
        invitation.invitedUserEmail === email
    )

    await projectInvite(projectID, [{ email, name }], role)
    this.setState({ invitationSent: true })

    if (!alreadyInvited) {
      this.createInvitedAuthor(email, invitingID, name)
    }
  }

  private createInvitedAuthor = (
    invitedEmail: string,
    invitingID: string,
    name: string
  ) => {
    const collection = this.props.collection as RxCollection<ProjectInvitation>

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

  private buildInvitedAuthorsEmail = (
    authorInvitationIDs: string[],
    invitations: ProjectInvitation[]
  ) => {
    const invitedAuthorsEmail: string[] = []
    for (const invitation of invitations) {
      if (authorInvitationIDs.includes(invitation._id)) {
        invitedAuthorsEmail.push(invitation.invitedUserEmail)
      }
    }
    return invitedAuthorsEmail
  }

  private buildNonAuthors = (
    authors: Contributor[],
    collaborators: UserProfile[],
    invitations: ProjectInvitation[]
  ) => {
    const userIDs: string[] = authors.map(author => author.userID as string)
    const invitationsID: string[] = authors.map(author => author.invitationID!)

    const invitedAuthorsEmail: string[] = this.buildInvitedAuthorsEmail(
      invitationsID,
      invitations
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
      values.affiliations.map(item => this.props.saveModel(item))
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

  private getInvitation = (
    invitingUser: UserProfile,
    invitedEmail: string
  ): Promise<ProjectInvitation> => {
    return new Promise(resolve => {
      const collection = this.props.collection as RxCollection<
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
}

export default MetadataContainer
