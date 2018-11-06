import {
  buildContributor,
  buildManuscript,
  buildProject,
  PROJECT,
  timestamp,
  USER_PROFILE,
} from '@manuscripts/manuscript-editor'
import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import Spinner from '../../icons/spinner'
import { buildUserMap } from '../../lib/data'
import { ContributorRole } from '../../lib/roles'
import sessionID from '../../lib/sessionID'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import ProjectsSidebar from '../projects/ProjectsSidebar'

export interface ProjectInfo extends Partial<Project> {
  collaborators: UserProfile[]
}

interface State {
  projects: Project[] | null
  userMap: Map<string, UserProfile>
}

type Props = UserProps & ModelsProps & RouteComponentProps

class ProjectsModalContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    projects: null,
    userMap: new Map(),
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    this.subs.push(this.loadUserMap())
    this.subs.push(this.loadComponents())
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { projects } = this.state
    const { user } = this.props

    if (!user.loaded) {
      return <Spinner />
    }

    if (!projects) {
      return <Spinner />
    }

    return (
      <ProjectsSidebar
        projects={projects}
        addProject={this.addProject}
        getCollaborators={this.getCollaborators}
      />
    )
  }

  private getCollaborators = (project: Project) => {
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
}

export default withRouter<RouteComponentProps>(
  withModels(withUser(ProjectsModalContainer))
)
