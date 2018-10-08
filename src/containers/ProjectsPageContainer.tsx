import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import AcceptInvitationMessages from '../components/AcceptInvitationMessages'
import { Main, Page } from '../components/Page'
import { ProjectsPage } from '../components/ProjectsPage'
import Spinner from '../icons/spinner'
import { acceptProjectInvitation } from '../lib/api'
import {
  buildContributor,
  buildManuscript,
  buildProject,
} from '../lib/commands'
import { ContributorRole } from '../lib/roles'
import sessionID from '../lib/sessionID'
import timestamp from '../lib/timestamp'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { getComponentFromDoc } from '../transformer/decode'
import {
  PROJECT,
  PROJECT_INVITATION,
  USER_PROFILE,
} from '../transformer/object-types'
import {
  Attachments,
  Project,
  ProjectInvitation,
  UserProfile,
} from '../types/components'
import {
  AddProject,
  // RemoveProject,
  // UpdateProject,
} from '../types/project'

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
  UserProps & ComponentsProps & RouteComponentProps<{}>,
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
    this.subs.push(this.loadComponents())
    const invitationToken = window.localStorage.getItem('invitationToken')
    if (invitationToken) {
      window.localStorage.removeItem('invitationToken')
      const invitation = await this.loadInvitation(invitationToken)
      if (invitation) {
        await this.acceptInvitation(invitation.id)
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

  private loadComponents = () => {
    const collection = this.getCollection()

    return collection
      .find({ objectType: PROJECT })
      .$.subscribe(async (docs: Array<RxDocument<Project>>) => {
        const projects: Project[] = []

        for (const doc of docs) {
          const component = doc.toJSON()

          projects.push(component)
        }

        this.setState({ projects })
      })
  }

  // TODO: move this to a data provider that owns the map of user profiles
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

  private getCollection() {
    return this.props.components.collection as RxCollection<{}>
  }

  // TODO: catch and handle errors
  private addProject: AddProject = async () => {
    // TODO: open up the template modal

    const user = this.props.user.data as UserProfile

    const owner = user.userID

    const collection = this.getCollection()

    const project = buildProject(owner) as Project

    const now = timestamp()
    project.createdAt = now
    project.updatedAt = now
    project.sessionID = sessionID

    const projectID = project.id

    await collection.insert(project)

    const manuscript = buildManuscript()
    const manuscriptID = manuscript.id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await this.props.components.saveComponent(contributor, {
      manuscriptID,
      projectID,
    })

    await this.props.components.saveComponent(manuscript, {
      manuscriptID,
      projectID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private loadInvitation = (invitationId: string) =>
    this.getCollection()
      .findOne({
        objectType: PROJECT_INVITATION,
        id: invitationId,
      })
      .exec()
      .then(invitation => {
        if (invitation) {
          return invitation.toJSON() as ProjectInvitation
        }
      })

  private acceptInvitation = async (invitationID: string) => {
    await acceptProjectInvitation(invitationID).catch(() => {
      alert('Invitation not found')
    })
  }

  // TODO: catch and handle errors
  // private updateProject: UpdateProject = (doc, data) => {
  //   doc
  //     .update({
  //       $set: data,
  //     })
  //     .then(() => {
  //       console.log('saved') // tslint:disable-line
  //     })
  //     .catch((error: RxError) => {
  //       console.error(error) // tslint:disable-line
  //     })
  // }
  //
  // private removeProject: RemoveProject = doc => event => {
  //   event.preventDefault()
  //
  //   const collection = this.props.components.collection as RxCollection<
  //     AnyComponent
  //   >
  //
  //   const project = doc.id
  //
  //   // TODO: just set the _deleted property
  //
  //   doc.remove().then(() =>
  //     collection
  //       .find({
  //         project,
  //       })
  //       .remove()
  //   )
  // }
}

export default withComponents(withUser(ProjectsPageContainer))
