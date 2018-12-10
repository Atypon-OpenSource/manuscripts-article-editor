import {
  buildContributor,
  buildManuscript,
  MANUSCRIPT,
} from '@manuscripts/manuscript-editor'
import {
  Manuscript,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { parse, stringify } from 'qs'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import Spinner from '../../icons/spinner'
import { ContributorRole } from '../../lib/roles'
import { IntlProps, withIntl } from '../../store/IntlProvider'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { EmptyProjectPage } from './EmptyProjectPage'

interface State {
  project: Project | null
  manuscripts: Manuscript[] | null
  error: string | null
}

interface RouteParams {
  projectID: string
}

type CombinedProps = ModelsProps &
  RouteComponentProps<RouteParams> &
  IntlProps &
  UserProps

class ProjectPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    project: null,
    manuscripts: null,
    error: null,
  }

  private subs: Subscription[] = []

  public async componentDidMount() {
    const { projectID } = this.props.match.params

    this.loadModels(projectID)
  }

  public async componentWillReceiveProps(nextProps: CombinedProps) {
    const { projectID } = nextProps.match.params

    if (projectID !== this.props.match.params.projectID) {
      this.loadModels(projectID)
    }
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { manuscripts, project } = this.state
    const { message } = parse(window.location.hash.substr(1))

    if (!project || !manuscripts) {
      return <Spinner />
    }

    if (!manuscripts.length) {
      return (
        <EmptyProjectPage
          project={project}
          addManuscript={this.addManuscript}
        />
      )
    }

    return (
      <Redirect
        to={{
          pathname: `/projects/${project._id}/manuscripts/${
            manuscripts[0]._id
          }`,
          state: this.props.location.state,
        }}
      />
    )
  }

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  private loadModels(projectID: string) {
    this.setState({
      project: null,
      manuscripts: null,
    })

    try {
      this.subs.push(
        this.getCollection()
          .findOne(projectID)
          .$.subscribe((doc: RxDocument<Project> | null) => {
            if (doc) {
              this.setState({
                project: doc.toJSON(),
              })
            }
          })
      )

      this.subs.push(
        this.getCollection()
          .find({
            containerID: projectID,
            objectType: MANUSCRIPT,
          })
          .sort({
            createdAt: -1,
          })
          .$.subscribe((docs: Array<RxDocument<Manuscript>>) => {
            this.setState({
              manuscripts: docs.map(doc => doc.toJSON()),
            })
          })
      )
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console

      this.setState({
        error: error.message,
      })
    }
  }

  private addManuscript = async () => {
    // TODO: open up the template modal

    const { projectID } = this.props.match.params

    const user = this.props.user.data as UserProfile

    const manuscript = buildManuscript()
    const manuscriptID = manuscript._id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await this.props.models.saveModel(contributor, {
      projectID,
      manuscriptID,
    })

    await this.props.models.saveModel(manuscript, {
      projectID,
      manuscriptID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }
}

export default withModels(withUser(withIntl(ProjectPageContainer)))
