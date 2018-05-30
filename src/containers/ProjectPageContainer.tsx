import { debounce } from 'lodash-es'
import React from 'react'
import { RouteComponentProps } from 'react-router'
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
import { CONTRIBUTOR, MANUSCRIPT, PROJECT } from '../transformer/object-types'
import {
  AnyComponent,
  ComponentDocument,
  Contributor,
  Manuscript,
  Project,
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
  project: Project | null
  manuscripts: ManuscriptDocument[] | null
  error: string | null
}

interface Props {
  id: string
}

interface RouteParams {
  id: string
}

class ProjectPageContainer extends React.Component<
  Props &
    ComponentsProps &
    RouteComponentProps<RouteParams> &
    IntlProps &
    UserProps,
  State
> {
  public state: Readonly<State> = {
    project: null,
    manuscripts: null,
    error: null,
  }

  private subs: Subscription[] = []

  private saveProject = debounce(async (values: Partial<Project>) => {
    await this.props.components.saveComponent('', {
      ...this.state.project,
      ...values,
    })
  }, 1000)

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
                project: (component as ProjectDocument).toJSON(),
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
        <ProjectSidebar
          manuscripts={manuscripts}
          project={{
            ...project,
            title: project.title || 'Untitled',
          }}
          saveProject={this.saveProject}
        />

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
  private addManuscript: AddManuscript = async () => {
    const { id: project } = this.props.match.params
    const { user } = this.props

    // TODO: this should never happen
    if (!user.data) {
      throw new Error('Not authenticated!')
    }

    // TODO: open up the template modal

    const id = generateID('manuscript') as string
    const owner = user.data.id.replace('|', '_')
    const now = Date.now()

    const contributor: Contributor = {
      id: generateID('contributor') as string,
      objectType: CONTRIBUTOR,
      priority: 0,
      role: 'author',
      affiliations: [],
      bibliographicName: {
        id: generateID('bibliographic_name') as string,
        ...user.data.bibliographicName,
      },
    }

    const manuscript: Manuscript = {
      id,
      project,
      objectType: MANUSCRIPT,
      owners: [owner],
      createdAt: now,
      updatedAt: now,
      sessionID,
      title: '',
    }

    try {
      const collection = this.getCollection()
      await collection.insert(contributor)

      await this.props.components.saveComponent(id, contributor)
      await this.props.components.saveComponent(id, manuscript)
      this.props.history.push(`/projects/${project}/manuscripts/${id}`)
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
    }
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
