import {
  buildContributor,
  buildManuscript,
  buildProject,
  timestamp,
} from '@manuscripts/manuscript-editor'
import {
  ObjectTypes,
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import Spinner from '../../icons/spinner'
import { acceptProjectInvitation } from '../../lib/api'
import { buildUserMap } from '../../lib/data'
import { ContributorRole } from '../../lib/roles'
import sessionID from '../../lib/sessionID'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import AcceptInvitationMessages from '../collaboration/AcceptInvitationMessages'
import { Main, Page } from '../Page'
import { ProjectsPage } from './ProjectsPage'

export interface ProjectInfo extends Partial<Project> {
  collaborators: UserProfile[]
}

export const projectListCompare = (
  a: ProjectInfo | Project,
  b: ProjectInfo | Project
) => {
  // sort untitled projects to the top
  if (!a.title) {
    return b.title ? -1 : Number(b.createdAt) - Number(a.createdAt)
  }

  return (
    String(a.title).localeCompare(String(b.title)) ||
    Number(b.createdAt) - Number(a.createdAt)
  )
}

interface State {
  projects: Project[] | null
  userMap: Map<string, UserProfile>
  invitationAccepted: boolean | null
}

class ProjectsPageContainer extends React.Component<
  UserProps & ModelsProps & RouteComponentProps<{}>,
  State
> {
  public state: Readonly<State> = {
    projects: null,
    userMap: new Map(),
    invitationAccepted: null,
  }

  private subs: Subscription[] = []

  public async componentDidMount() {
    this.subs.push(this.loadUserMap())
    this.subs.push(this.loadProjects())
    const invitationToken = window.localStorage.getItem('invitationToken')
    if (invitationToken) {
      window.localStorage.removeItem('invitationToken')
      const invitation = await this.loadInvitation(invitationToken)
      if (invitation) {
        await acceptProjectInvitation(invitation._id)
          .then(() => this.setState({ invitationAccepted: true }))
          .catch(() => this.setState({ invitationAccepted: false }))
      } else {
        this.setState({ invitationAccepted: false })
      }
    }
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { projects, invitationAccepted } = this.state
    const { user } = this.props

    if (!user.loaded) {
      return <Spinner />
    }

    if (!projects) {
      return <Spinner />
    }

    return (
      <Page>
        <Main>
          <AcceptInvitationMessages invitationAccepted={invitationAccepted} />
          <ProjectsPage
            projects={projects}
            addProject={this.addProject}
            getCollaborators={this.getCollaborators}
          />
        </Main>
      </Page>
    )
  }

  private getCollaborators = (project: Project): UserProfile[] => {
    const getCollaborator = (id: string) => this.state.userMap.get(id)

    return [
      ...project.owners.map(getCollaborator),
      ...project.writers.map(getCollaborator),
      ...project.viewers.map(getCollaborator),
    ].filter(collaborator => collaborator) as UserProfile[]
  }

  private loadProjects = () => {
    const collection = this.getCollection()

    return collection
      .find({ objectType: ObjectTypes.Project })
      .$.subscribe(async (docs: Array<RxDocument<Project>>) => {
        const projects: Project[] = []

        for (const doc of docs) {
          projects.push(doc.toJSON())
        }

        this.setState({ projects })
      })
  }

  // TODO: move this to a data provider that owns the map of user profiles
  private loadUserMap = () =>
    this.getCollection()
      .find({ objectType: ObjectTypes.UserProfile })
      .$.subscribe(async (docs: Array<RxDocument<UserProfile>>) => {
        this.setState({
          userMap: await buildUserMap(docs),
        })
      })

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  // TODO: catch and handle errors
  private addProject = async () => {
    // TODO: open up the template modal

    const user = this.props.user.data as UserProfile

    const owner = user.userID

    const collection = this.getCollection()

    const project = buildProject(owner) as Project

    const now = timestamp()
    project.createdAt = now
    project.updatedAt = now
    project.sessionID = sessionID

    const projectID = project._id

    await collection.insert(project)

    const manuscript = buildManuscript()
    const manuscriptID = manuscript._id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await this.props.models.saveModel(contributor, {
      manuscriptID,
      projectID,
    })

    await this.props.models.saveModel(manuscript, {
      manuscriptID,
      projectID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private loadInvitation = (invitationId: string) =>
    this.getCollection()
      .findOne(invitationId)
      .exec()
      .then(invitation => {
        if (invitation) {
          return invitation.toJSON() as ProjectInvitation
        }
      })
}

export default withModels(withUser(ProjectsPageContainer))
