import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import Spinner from '../../icons/spinner'
import { IntlProps, withIntl } from '../../store/IntlProvider'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import * as ObjectTypes from '../../transformer/object-types'
import { Manuscript, Project } from '../../types/models'

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

    if (!project || !manuscripts || !manuscripts.length) {
      return <Spinner />
    }

    return (
      <Redirect
        to={`/projects/${project._id}/manuscripts/${manuscripts[0]._id}`}
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
            objectType: ObjectTypes.MANUSCRIPT,
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
}

export default withModels(withUser(withIntl(ProjectPageContainer)))
