import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Page } from '../components/Page'
import { ProjectsPage } from '../components/ProjectsPage'
import Spinner from '../icons/spinner'
import {
  buildContributor,
  buildManuscript,
  buildProject,
} from '../lib/commands'
import sessionID from '../lib/sessionID'
import timestamp from '../lib/timestamp'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { PROJECT } from '../transformer/object-types'
import { Project, UserProfile } from '../types/components'
import {
  AddProject,
  ProjectDocument,
  // RemoveProject,
  // UpdateProject,
} from '../types/project'

interface State {
  projects: Project[]
  loaded: boolean
}

class ProjectsPageContainer extends React.Component<
  UserProps & ComponentsProps & RouteComponentProps<{}>,
  State
> {
  public state: Readonly<State> = {
    projects: [],
    loaded: false,
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    const sub = this.getCollection()
      .find({ objectType: PROJECT })
      .sort({ createdAt: -1 })
      .$.subscribe((projects: ProjectDocument[]) => {
        this.setState({
          projects: projects.map(project => project.toJSON()),
          loaded: true,
        })
      })

    this.subs.push(sub)
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { projects, loaded } = this.state
    const { user } = this.props

    if (!user.loaded) {
      return <Spinner />
    }

    if (!loaded) {
      return <Spinner />
    }

    return (
      <Page>
        <ProjectsPage projects={projects} addProject={this.addProject} />
      </Page>
    )
  }

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

    const contributor = buildContributor(user.bibliographicName)

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

  // TODO: atomicUpdate?
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
