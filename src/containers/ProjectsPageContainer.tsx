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
import { CONTRIBUTOR, PROJECT } from '../transformer/object-types'
import {
  AnyComponent,
  AnyContainedComponent,
  Component,
  ComponentDocument,
  Contributor,
  Project,
  UserProfile,
} from '../types/components'
import {
  AddProject,
  // RemoveProject,
  // UpdateProject,
} from '../types/project'

export interface ProjectInfo extends Partial<Project> {
  contributors: Contributor[]
}

interface State {
  projects: ProjectInfo[] | null
}

class ProjectsPageContainer extends React.Component<
  UserProps & ComponentsProps & RouteComponentProps<{}>,
  State
> {
  public state: Readonly<State> = {
    projects: null,
  }

  private subs: Subscription[] = []

  public componentDidMount() {
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
      <Page>
        <ProjectsPage projects={projects} addProject={this.addProject} />
      </Page>
    )
  }

  private isProject = (component: Component): component is Project =>
    component.objectType === PROJECT

  private isProjectComponent = (projectID: string) => (
    component: AnyComponent
  ): component is AnyContainedComponent =>
    'containerID' in component && component.containerID === projectID

  // private sortNewestFirst = (a: Component, b: Component) =>
  //   Number(a.createdAt) - Number(b.createdAt)

  private sortByPriority = (a: Contributor, b: Contributor) =>
    Number(a.priority) - Number(b.priority)

  private loadComponents = () =>
    this.getCollection()
      .find({
        $or: [
          { objectType: CONTRIBUTOR },
          // { objectType: MANUSCRIPT },
          { objectType: PROJECT },
        ],
      })
      .$.subscribe((docs: ComponentDocument[]) => {
        const components: AnyComponent[] = docs.map(doc => doc.toJSON())

        const projects: ProjectInfo[] = []

        components.forEach(component => {
          if (this.isProject(component)) {
            const projectID = component.id

            const projectComponents = components.filter(
              this.isProjectComponent(projectID)
            )

            const contributors: Contributor[] = projectComponents
              .filter(component => component.objectType === CONTRIBUTOR)
              .sort(this.sortByPriority) as Contributor[]

            // const manuscripts: Manuscript[] = projectComponents
            //   .filter(component => component.objectType === MANUSCRIPT)
            //   .sort(this.sortNewestFirst) as Manuscript[]

            projects.push({
              id: component.id,
              objectType: component.objectType,
              title: component.title,
              owners: component.owners,
              // manuscripts,
              contributors,
            })
          }
        })

        this.setState({ projects })
      })

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
