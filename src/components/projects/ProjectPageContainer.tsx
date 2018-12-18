import {
  Manuscript,
  ObjectTypes,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import Spinner from '../../icons/spinner'
import { IntlProps, withIntl } from '../../store/IntlProvider'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { ModalProps, withModal } from '../ModalProvider'
import { TemplateSelector } from '../templates/TemplateSelector'
import { EmptyProjectPage } from './EmptyProjectPage'

interface State {
  project: Project | null
  manuscripts: Manuscript[] | null
  error: string | null
}

interface RouteParams {
  projectID: string
}

type CombinedProps = ModalProps &
  ModelsProps &
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

    if (!project || !manuscripts) {
      return <Spinner />
    }

    if (!manuscripts.length) {
      return (
        <EmptyProjectPage
          project={project}
          openTemplateSelector={this.openTemplateSelector}
        />
      )
    }

    return (
      <Redirect
        to={{
          pathname: `/projects/${project._id}/manuscripts/${
            manuscripts[0]._id
          }`,
          hash: window.location.hash,
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
            objectType: ObjectTypes.Manuscript,
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

  private openTemplateSelector = () => {
    const { addModal, history, match, models, user } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        history={history}
        projectID={match.params.projectID}
        saveModel={models.saveModel}
        user={user.data!}
        handleComplete={handleClose}
      />
    ))
  }
}

export default withModal(withModels(withUser(withIntl(ProjectPageContainer))))
