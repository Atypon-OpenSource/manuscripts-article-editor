import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import {
  buildContributor,
  buildManuscript,
  buildProject,
} from '../lib/commands'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { PROJECT } from '../transformer/object-types'
import { AnyComponent, Project, UserProfile } from '../types/components'
import {
  AddProject,
  ProjectDocument,
  // RemoveProject,
  // UpdateProject,
} from '../types/project'
import ProjectsSidebar from './ProjectsSidebar'

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
        <ProjectsSidebar projects={projects} addProject={this.addProject} />

        <Main>
          {/*<ProjectsPage
            projects={projects}
            addProject={this.addProject}
            updateProject={this.updateProject}
            removeProject={this.removeProject}
          />*/}
        </Main>
      </Page>
    )
  }

  private getCollection() {
    return this.props.components.collection as RxCollection<AnyComponent>
  }

  // TODO: catch and handle errors
  private addProject: AddProject = async () => {
    // TODO: open up the template modal

    const user = this.props.user.data as UserProfile

    const owner = user.userID

    const collection = this.getCollection()

    const project = buildProject(owner)
    await collection.insert(project)

    const manuscript = buildManuscript(project.id, owner)
    const contributor = buildContributor(user)

    await this.props.components.saveComponent(manuscript.id, contributor)
    await this.props.components.saveComponent(manuscript.id, manuscript)

    this.props.history.push(
      `/projects/${project.id}/manuscripts/${manuscript.id}`
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
