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
          isInitialValid={false}
          onSubmit={this.handleSubmit}
          component={DeleteAccountForm}
        />
      </ModalForm>
    )
  }

  private handleSubmit = (
    values: DeleteAccountValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<DeleteAccountValues | FormErrors>
  ) => {
    setErrors({})

    deleteAccount(values).then(
      () => {
        setSubmitting(false)

        this.props.history.push('/')
      },
      error => {
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
    )
  }
}

export default DeleteAccountPageContainer
