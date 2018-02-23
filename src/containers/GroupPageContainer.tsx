import { Formik, FormikActions, FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, RouteProps } from 'react-router'
import { RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { FormPage } from '../components/Form'
import { GroupErrors, GroupForm, GroupValues } from '../components/GroupForm'
import GroupPage from '../components/GroupPage'
import { waitForDB } from '../db'
import Spinner from '../icons/spinner'
import { ConnectedReduxProps } from '../store/types'
import { GroupInterface } from '../types/group'
import { ManuscriptInterface } from '../types/manuscript'
import { Person } from '../types/person'
import { groupSchema } from '../validation'

interface GroupPageContainerState {
  group: RxDocument<GroupInterface> | null
  members: Array<RxDocument<Person>> | null
  manuscripts: Array<RxDocument<ManuscriptInterface>> | null
  editing: boolean
  error: string | null
}

interface GroupPageContainerProps {
  id: string
}

interface GroupPageRoute extends Route<RouteProps> {
  id: string
}

class GroupPageContainer extends React.Component<
  GroupPageContainerProps &
    RouteComponentProps<GroupPageRoute> &
    ConnectedReduxProps<{}>
> {
  public state: GroupPageContainerState = {
    group: null,
    members: null,
    manuscripts: null,
    editing: false,
    error: null,
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    const { id } = this.props.match.params

    waitForDB
      .then(db => {
        this.subs.push(
          db.groups.findOne({ _id: id }).$.subscribe(group => {
            this.setState({ group })
          })
        )

        // TODO: how to fetch these people?
        this.subs.push(
          db.groupmembers.find({ group: id }).$.subscribe(members => {
            this.setState({ members })
          })
        )

        // TODO: how to fetch these manuscripts?
        this.subs.push(
          db.manuscripts
            .find({ group: id }) // TODO: does this mapping work?
            .$.subscribe(manuscripts => {
              this.setState({ manuscripts })
            })
        )
      })
      .catch((error: Error) => {
        this.setState({
          error: error.message,
        })
      })
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { group, members, manuscripts, editing } = this.state

    if (group === null || members === null || manuscripts === null) {
      return <Spinner />
    }

    if (editing) {
      return (
        <FormPage>
          <Formik
            initialValues={{
              name: group.name || '',
              description: group.description || '',
            }}
            validationSchema={groupSchema}
            isInitialValid={true}
            onSubmit={this.handleSubmit}
            render={(formikProps: FormikProps<GroupValues & GroupErrors>) => (
              <GroupForm
                {...formikProps}
                stopEditing={this.stopEditing}
                deleteGroup={this.deleteGroup}
              />
            )}
          />
        </FormPage>
      )
    }

    return (
      <GroupPage
        group={group}
        members={members}
        manuscripts={manuscripts}
        startEditing={this.startEditing}
      />
    )
  }

  private startEditing = () => {
    this.setState({
      editing: true,
    })
  }

  private stopEditing = () => {
    this.setState({
      editing: false,
    })
  }

  private deleteGroup = () => {
    // TODO: confirm

    const doc = this.state.group as RxDocument<GroupInterface>

    doc.remove().then(() => {
      this.props.history.push('/groups')
    })
  }

  private handleSubmit = (
    values: GroupValues,
    { setSubmitting, setErrors }: FormikActions<GroupValues | GroupErrors>
  ) => {
    const doc = this.state.group as RxDocument<GroupInterface>

    doc
      .update({
        $set: values,
      })
      .then(
        () => {
          setSubmitting(false)

          this.setState({
            editing: false,
          })
        },
        error => {
          setSubmitting(false)

          const errors: FormikErrors<GroupErrors> = {
            name: null,
            description: null,
            submit: error.response
              ? error.response.data.error
              : 'There was an error',
          }

          setErrors(errors)
        }
      )
  }
}

export default connect()(GroupPageContainer)
