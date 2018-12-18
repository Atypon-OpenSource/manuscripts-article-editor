import {
  ObjectTypes,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Formik, FormikActions, FormikErrors, FormikProps } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { logout } from '../../lib/account'
import { deleteAccount } from '../../lib/api'
import { databaseCreator } from '../../lib/db'
import { isOwner } from '../../lib/roles'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { UserProps, withUser } from '../../store/UserProvider'
import { deleteAccountSchema } from '../../validation'
import { FormErrors } from '../Form'
import { DeleteAccountMessage } from '../Messages'
import ModalForm from '../ModalForm'
import { DeleteAccountForm, DeleteAccountValues } from './DeleteAccountForm'

const initialValues = {
  password: '',
}

interface State {
  projects: Project[] | null
}

type Props = UserProps & RouteComponentProps<{}> & ModelsProps
class DeleteAccountPageContainer extends React.Component<Props> {
  public state: Readonly<State> = {
    projects: null,
  }
  private subs: Subscription[] = []

  public componentDidMount() {
    this.subs.push(this.loadProjects())
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    if (!this.state.projects) {
      return null
    }

    return (
      <ModalForm title={<DeleteAccountMessage />}>
        <Formik
          initialValues={initialValues}
          validationSchema={deleteAccountSchema}
          isInitialValid={true}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
          render={(props: FormikProps<DeleteAccountValues & FormErrors>) => (
            <DeleteAccountForm
              {...props}
              deletedProjects={this.findUserProjects() as Project[]}
            />
          )}
        />
      </ModalForm>
    )
  }

  private handleSubmit = async (
    values: DeleteAccountValues,
    {
      setErrors,
      setSubmitting,
    }: FormikActions<DeleteAccountValues | FormErrors>
  ) => {
    setErrors({})

    try {
      await deleteAccount(values.password)

      setSubmitting(false)

      const db = await databaseCreator
      await logout(db)

      window.location.href = '/signup'
    } catch (error) {
      setSubmitting(false)

      const errors: FormikErrors<FormErrors> = {
        submit:
          error.response &&
          error.response.status === HttpStatusCodes.UNAUTHORIZED
            ? 'The password entered is incorrect'
            : 'There was an error',
      }

      setErrors(errors)
    }
  }

  private loadProjects = () => {
    const collection = this.getCollection()

    return collection
      .find({ objectType: ObjectTypes.Project })
      .$.subscribe(async (docs: Array<RxDocument<Project>>) => {
        const projects: Project[] = []

        for (const doc of docs) {
          projects.push(doc.toJSON())
        }

        this.setState({ projects })
      })
  }

  private findUserProjects() {
    const user = this.props.user.data as UserProfile
    const projects: Project[] | null = this.state.projects
    if (projects) {
      const deletedProjects: Project[] = projects.filter(
        project => project.owners.length === 1 && isOwner(project, user.userID)
      )
      return deletedProjects
    }
  }

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }
}

export default withModels(withUser(DeleteAccountPageContainer))
