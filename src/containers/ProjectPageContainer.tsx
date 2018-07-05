import { debounce } from 'lodash-es'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument, RxError } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import ManuscriptsPage from '../components/ManuscriptsPage'
import { Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import { buildContributor, buildManuscript } from '../lib/commands'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { IntlProps, withIntl } from '../store/IntlProvider'
import { UserProps, withUser } from '../store/UserProvider'
import * as ObjectTypes from '../transformer/object-types'
import { Project, UserProfile } from '../types/components'
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
  projectID: string
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

  private saveProject = debounce(async (data: Partial<Project>) => {
    const { project } = this.state

    const prev = await this.getCollection()
      .findOne(project!.id)
      .exec()

    return prev!.atomicUpdate((doc: RxDocument<Project>) => {
      Object.entries(data).forEach(([key, value]) => {
        doc.set(key, value)
      })
    }) as Promise<RxDocument<Project>>
  }, 1000)

  public async componentDidMount() {
    const { projectID } = this.props.match.params

    try {
      this.subs.push(
        this.getCollection()
          .findOne({
            id: projectID,
            objectType: ObjectTypes.PROJECT,
          })
          .$.subscribe((doc: ProjectDocument | null) => {
            if (!doc) {
              throw new Error('Project not found')
            }

            this.setState({
              project: doc.toJSON(),
            })
          })
      )

      this.subs.push(
        this.getCollection()
          .find({
            containerID: projectID,
            objectType: ObjectTypes.MANUSCRIPT,
          })
          .sort({
            createdAt: -1,
          })
          .$.subscribe((manuscripts: ManuscriptDocument[]) => {
            this.setState({ manuscripts })
          })
      )
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
      <Page projectID={project.id}>
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
    return this.props.components.collection as RxCollection<{}>
  }

  // TODO: catch and handle errors
  private addManuscript: AddManuscript = async () => {
    // TODO: open up the template modal

    const { projectID } = this.props.match.params

    const user = this.props.user.data as UserProfile

    const manuscript = buildManuscript()
    const manuscriptID = manuscript.id

    const contributor = buildContributor(user.bibliographicName)

    await this.props.components.saveComponent(contributor, {
      projectID,
      manuscriptID,
    })

    await this.props.components.saveComponent(manuscript, {
      projectID,
      manuscriptID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
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

    const manuscriptID = doc.id

    // TODO: just set the _deleted property

    doc.remove().then(() =>
      this.getCollection()
        .find({ manuscriptID })
        .remove()
    )
  }
}

export default withComponents(withUser(withIntl(ProjectPageContainer)))
