import {
  ObjectTypes,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import Spinner from '../../icons/spinner'
import { buildUserMap } from '../../lib/data'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { ModalProps, withModal } from '../ModalProvider'
import ProjectsSidebar from '../projects/ProjectsSidebar'
import { TemplateSelector } from '../templates/TemplateSelector'

export interface ProjectInfo extends Partial<Project> {
  collaborators: UserProfile[]
}

interface State {
  projects: Project[] | null
  userMap: Map<string, UserProfile>
}

type Props = UserProps & ModelsProps & RouteComponentProps & ModalProps

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
        addProject={this.openTemplateSelector}
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
      .find({ objectType: ObjectTypes.Project })
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
      .find({ objectType: ObjectTypes.UserProfile })
      .$.subscribe(async (docs: Array<RxDocument<UserProfile>>) => {
        this.setState({
          userMap: await buildUserMap(docs),
        })
      })

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  private openTemplateSelector = () => {
    const { addModal, history, models, user } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        history={history}
        saveModel={models.saveModel}
        user={user.data!}
        handleComplete={handleClose}
      />
    ))
  }
}

export default withRouter<RouteComponentProps>(
  withModal(withModels(withUser(ProjectsModalContainer)))
)
