import { Formik, FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import {
  DeleteAccountForm,
  DeleteAccountValues,
} from '../components/DeleteAccountForm'
import { FormErrors } from '../components/Form'
import { DeleteAccountMessage } from '../components/Messages'
import ModalForm from '../components/ModalForm'
import { deleteAccount } from '../lib/api'
import { removeDB } from '../lib/rxdb'
import { deleteAccountSchema } from '../validation'

const initialValues = {
  password: '',
}

class DeleteAccountPageContainer extends React.Component<
  RouteComponentProps<{}>
> {
  public render() {
    return (
      <ModalForm title={<DeleteAccountMessage />}>
        <Formik
          initialValues={initialValues}
          validationSchema={deleteAccountSchema}
          isInitialValid={true}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
          component={DeleteAccountForm}
        />
      </ModalForm>
    )
  }

  private handleSubmit = (
    values: DeleteAccountValues,
    actions: FormikActions<DeleteAccountValues | FormErrors>
  ) => {
    actions.setErrors({})

    deleteAccount(values).then(
      async () => {
        actions.setSubmitting(false)
        await removeDB()
        window.location.href = '/signup'
      },
      error => {
        actions.setSubmitting(false)

        const errors: FormikErrors<FormErrors> = {
          submit:
            error.response &&
            error.response.status === HttpStatusCodes.UNAUTHORIZED
              ? 'The password entered is incorrect'
              : 'There was an error',
        }

        actions.setErrors(errors)
      }
    )
  }
}

export default DeleteAccountPageContainer
