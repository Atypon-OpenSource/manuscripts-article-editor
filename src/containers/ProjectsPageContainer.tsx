import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
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
import { getComponentFromDoc } from '../transformer/decode'
import { PROJECT, USER_PROFILE } from '../transformer/object-types'
import {
  Attachments,
  Component,
  Project,
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

interface State {
  projects: ProjectInfo[] | null
  userMap: Map<string, UserProfile>
}

class ProjectsPageContainer extends React.Component<
  UserProps & ComponentsProps & RouteComponentProps<{}>,
  State
> {
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
      <Page>
        <ProjectsPage projects={projects} addProject={this.addProject} />
      </Page>
    )
  }

  private isProject = (component: Component): component is Project =>
    component.objectType === PROJECT

  private loadComponents = () => {
    const collection = this.getCollection()

    return collection
      .find({ objectType: PROJECT })
      .$.subscribe(async (docs: Array<RxDocument<Project>>) => {
        const getCollaborator = (id: string) =>
          (this.state.userMap.get(id) as any) as UserProfile // tslint:disable-line:no-any 😥

        const projects: ProjectInfo[] = []

        for (const doc of docs) {
          const component = doc.toJSON()

          if (this.isProject(component)) {
            const collaborators = [
              ...component.owners.map(getCollaborator),
              ...component.writers.map(getCollaborator),
              ...component.viewers.map(getCollaborator),
            ]

            projects.push({
              id: component.id,
              objectType: component.objectType,
              title: component.title,
              collaborators,
            })
          }
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
