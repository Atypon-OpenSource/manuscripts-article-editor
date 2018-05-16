import React from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router'
import { RxCollection, RxError } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import ManuscriptsPage from '../components/ManuscriptsPage'
import { Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import sessionID from '../lib/sessionID'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { IntlProps, withIntl } from '../store/IntlProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { generateID } from '../transformer/id'
import { MANUSCRIPT, PROJECT } from '../transformer/object-types'
import {
  AnyComponent,
  ComponentDocument,
  Manuscript,
} from '../types/components'
import {
  AddManuscript,
  ManuscriptDocument,
  RemoveManuscript,
  UpdateManuscript,
} from '../types/manuscript'
import { ProjectDocument } from '../types/project'
import ProjectSidebar from './ProjectSidebar'

interface State {
  project: ProjectDocument | null
  manuscripts: ManuscriptDocument[] | null
  error: string | null
}

interface ComponentProps {
  id: string
}

interface ComponentRoute extends Route<RouteProps> {
  id: string
}

type Props = ComponentProps &
  ComponentsProps &
  RouteComponentProps<ComponentRoute> &
  IntlProps &
  UserProps

class ProjectPageContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    project: null,
    manuscripts: null,
    error: null,
  }

  private subs: Subscription[] = []

  public async componentDidMount() {
    const { id } = this.props.match.params

    try {
      const sub = this.getCollection()
        .find({ project: id })
        .sort({ createdAt: -1 })
        .$.subscribe((components: ComponentDocument[]) => {
          if (!components.length) {
            throw new Error('Project not found')
          }

          for (const component of components) {
            if (component.objectType === PROJECT) {
              this.setState({
                project: component as ProjectDocument, // TODO: ProjectComponent and ManuscriptComponent
              })
              break
            }
          }

          const manuscripts = components.filter(
            component => component.objectType === MANUSCRIPT
          ) as ManuscriptDocument[]

          this.setState({ manuscripts })
        })

      this.subs.push(sub)
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console

      this.setState({
        error: error.message,
      })
    }
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { manuscripts, project } = this.state

    if (!manuscripts || !project) {
      return <Spinner />
    }

    return (
      <Page>
        <ProjectSidebar manuscripts={manuscripts} project={project} />

        <Main>
          <ManuscriptsPage
            manuscripts={manuscripts}
            addManuscript={this.addManuscript}
            updateManuscript={this.updateManuscript}
            removeManuscript={this.removeManuscript}
          />
        </Main>
      </Page>
    )
  }

  private getCollection() {
    return this.props.components.collection as RxCollection<AnyComponent>
  }

  // TODO: catch and handle errors
  private addManuscript: AddManuscript = () => {
    const { id: project } = this.props.match.params
    const { user } = this.props

    // TODO: this should never happen
    if (!user.data) {
      throw new Error('Not authenticated!')
    }

    // TODO: open up the template modal

    const id = generateID('manuscript') as string
    const owner = (user.data._id as string).replace('|', '_')
    const now = Date.now()

    const manuscript: Manuscript = {
      id,
      project,
      manuscript: id,
      objectType: MANUSCRIPT,
      owners: [owner],
      createdAt: now,
      updatedAt: now,
      sessionID,
      title: '',
    }

    this.getCollection()
      .insert(manuscript)
      .then((doc: ManuscriptDocument) => {
        this.props.history.push(
          `/projects/${project}/manuscripts/${doc.get('id')}`
        )
      })
      .catch((error: RxError) => {
        console.error(error) // tslint:disable-line
      })
  }

  // TODO: atomicUpdate?
  // TODO: catch and handle errors
  private updateManuscript: UpdateManuscript = (doc, data) => {
    doc
      .update({
        $set: data,
      })
      .then(() => {
        console.log('saved') // tslint:disable-line
      })
      .catch((error: RxError) => {
        console.error(error) // tslint:disable-line
      })
  }

  private removeManuscript: RemoveManuscript = doc => event => {
    event.preventDefault()

    const manuscript = doc.id

    // TODO: just set the _deleted property

    doc.remove().then(() =>
      this.getCollection()
        .find({
          manuscript,
        })
        .remove()
    )
  }
}

export default withComponents(withUser(withIntl(ProjectPageContainer)))
