import { Formik, FormikActions, FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router'
import { RxError } from 'rxdb'
import { Subscription } from 'rxjs'
import {
  CollaboratorErrors,
  CollaboratorForm,
  CollaboratorValues,
} from '../components/CollaboratorForm'
import CollaboratorPage from '../components/CollaboratorPage'
import { FormPage } from '../components/Form'
import { IconBar, Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import { Db, waitForDB } from '../lib/rxdb'
import { MANUSCRIPT } from '../transformer/object-types'
import { CollaboratorDocument } from '../types/collaborator'
import { ManuscriptDocument } from '../types/manuscript'
import { collaboratorSchema } from '../validation'
import SidebarContainer from './SidebarContainer'

interface CollaboratorPageContainerState {
  collaborator: CollaboratorDocument | null
  manuscripts: ManuscriptDocument[] | null
  editing: boolean
  error: string | null
}

interface CollaboratorPageContainerProps {
  id: string
}

interface CollaboratorPageRoute extends Route<RouteProps> {
  id: string
}

class CollaboratorPageContainer extends React.Component<
  CollaboratorPageContainerProps & RouteComponentProps<CollaboratorPageRoute>
> {
  public state: CollaboratorPageContainerState = {
    collaborator: null,
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
          db.collaborators
            .findOne({ _id: id })
            .$.subscribe((collaborator: CollaboratorDocument) => {
              this.setState({ collaborator })
            })
        )

        this.subs.push(
          db.components
            .find()
            .where('objectType')
            .eq(MANUSCRIPT)
            .and('collaborator')
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
    const { collaborator, manuscripts, editing } = this.state

    if (collaborator === null || manuscripts === null) {
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
                  name: collaborator.name || '',
                  surname: collaborator.surname || '',
                }}
                validationSchema={collaboratorSchema}
                isInitialValid={true}
                onSubmit={this.handleSubmit}
                render={(
                  formikProps: FormikProps<
                    CollaboratorValues & CollaboratorErrors
                  >
                ) => (
                  <CollaboratorForm
                    {...formikProps}
                    stopEditing={this.stopEditing}
                    deleteCollaborator={this.deleteCollaborator}
                  />
                )}
              />
            </FormPage>
          ) : (
            <CollaboratorPage
              collaborator={collaborator}
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

  private deleteCollaborator = () => {
    // TODO: confirm

    const doc = this.state.collaborator as CollaboratorDocument

    doc
      .remove()
      .then(() => {
        this.props.history.push('/collaborators')
      })
      .catch((error: Error) => {
        this.setState({
          error: error.message,
        })
      })
  }

  private handleSubmit = (
    values: CollaboratorValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<CollaboratorValues | CollaboratorErrors>
  ) => {
    const doc = this.state.collaborator as CollaboratorDocument

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

          // TODO: handle database errors instead of axios errors

          const errors: FormikErrors<CollaboratorErrors> = {
            submit: error.message ? 'There was an error' : undefined,
          }

          setErrors(errors)
        }
      )
  }
}

export default CollaboratorPageContainer
