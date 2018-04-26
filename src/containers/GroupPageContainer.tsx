import { Formik, FormikActions, FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router'
import { RxError } from 'rxdb'
import { Subscription } from 'rxjs'
import { FormPage } from '../components/Form'
import { GroupErrors, GroupForm, GroupValues } from '../components/GroupForm'
import GroupPage from '../components/GroupPage'
import { IconBar, Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import { Db, waitForDB } from '../lib/rxdb'
import { MANUSCRIPT } from '../transformer/object-types'
import { CollaboratorDocument } from '../types/collaborator'
import { GroupDocument } from '../types/group'
import { ManuscriptDocument } from '../types/manuscript'
import { groupSchema } from '../validation'
import SidebarContainer from './SidebarContainer'

interface GroupPageContainerState {
  group: GroupDocument | null
  members: CollaboratorDocument[] | null
  manuscripts: ManuscriptDocument[] | null
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
  GroupPageContainerProps & RouteComponentProps<GroupPageRoute>
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
      .then((db: Db) => {
        this.subs.push(
          db.groups.findOne({ _id: id }).$.subscribe((group: GroupDocument) => {
            this.setState({ group })
          })
        )

        // TODO: how to fetch these people?
        this.subs.push(
          db.groupmembers
            .find({ group: id })
            .$.subscribe((members: CollaboratorDocument[]) => {
              this.setState({ members })
            })
        )

        // TODO: how to fetch these manuscripts?
        this.subs.push(
          db.components
            .find()
            .where('objectType')
            .eq(MANUSCRIPT)
            .and('group')
            .eq(id) // TODO: does this mapping work?
            .$.subscribe((manuscripts: ManuscriptDocument[]) => {
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

    return (
      <Page>
        <IconBar />
        <SidebarContainer />

        <Main>
          {editing ? (
            <FormPage>
              <Formik
                initialValues={{
                  name: group.name || '',
                  description: group.description || '',
                }}
                validationSchema={groupSchema}
                isInitialValid={true}
                onSubmit={this.handleSubmit}
                render={(
                  formikProps: FormikProps<GroupValues & GroupErrors>
                ) => (
                  <GroupForm
                    {...formikProps}
                    stopEditing={this.stopEditing}
                    deleteGroup={this.deleteGroup}
                  />
                )}
              />
            </FormPage>
          ) : (
            <GroupPage
              group={group}
              members={members}
              manuscripts={manuscripts}
              startEditing={this.startEditing}
            />
          )}
        </Main>
      </Page>
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

    const doc = this.state.group as GroupDocument

    doc
      .remove()
      .then(() => {
        this.props.history.push('/groups')
      })
      .catch((error: Error) => {
        this.setState({
          error: error.message,
        })
      })
  }

  private handleSubmit = (
    values: GroupValues,
    { setSubmitting, setErrors }: FormikActions<GroupValues | GroupErrors>
  ) => {
    const doc = this.state.group as GroupDocument

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
        (error: RxError) => {
          setSubmitting(false)

          const errors: FormikErrors<GroupErrors> = {
            submit: error ? 'There was an error' : undefined,
          }

          setErrors(errors)
        }
      )
  }
}

export default GroupPageContainer
