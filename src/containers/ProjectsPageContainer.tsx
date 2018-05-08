import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxError } from 'rxdb'
import { Subscription } from 'rxjs'
import { Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import sessionID from '../lib/sessionID'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { generateID } from '../transformer/id'
import { PROJECT } from '../transformer/object-types'
import { AnyComponent, Project } from '../types/components'
import {
  AddProject,
  ProjectDocument,
  // RemoveProject,
  // UpdateProject,
} from '../types/project'
import ProjectsSidebar from './ProjectsSidebar'

interface State {
  projects: ProjectDocument[]
  loaded: boolean
}

type Props = UserProps & ComponentsProps & RouteComponentProps<{}>

class ProjectsPageContainer extends React.Component<Props, State> {
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
          projects,
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
  private addProject: AddProject = () => {
    const { user } = this.props

    // TODO: this should never happen
    if (!user.data) {
      throw new Error('Not authenticated!')
    }

    // TODO: open up the template modal

    const id = generateID('project') as string
    const owner = (user.data._id as string).replace('|', '_')
    const now = Date.now()

    const project: Project = {
      id,
      project: id,
      objectType: PROJECT,
      owners: [owner],
      createdAt: now,
      updatedAt: now,
      sessionID,
      title: '',
    }

    this.getCollection()
      .insert(project)
      .then((doc: ProjectDocument) => {
        this.props.history.push(`/projects/${doc.get('id')}`)
      })
      .catch((error: RxError) => {
        console.error(error) // tslint:disable-line
      })
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
