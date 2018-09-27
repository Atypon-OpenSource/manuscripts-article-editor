import { Formik, FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import {
  ChangePasswordForm,
  ChangePasswordValues,
} from '../components/ChangePasswordForm'
import { FormErrors } from '../components/Form'
import { ChangePasswordMessage } from '../components/Messages'
import ModalForm from '../components/ModalForm'
import { changePassword } from '../lib/api'
import { changePasswordSchema } from '../validation'

const initialValues = {
  currentPassword: '',
  newPassword: '',
}

class ChangePasswordPageContainer extends React.Component<
  RouteComponentProps<{}>
> {
  public render() {
    return (
      <ModalForm title={<ChangePasswordMessage />}>
        <Formik
          initialValues={initialValues}
          validationSchema={changePasswordSchema}
          isInitialValid={true}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
          component={ChangePasswordForm}
        />
      </ModalForm>
    )
  }

  private handleSubmit = async (
    values: ChangePasswordValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<ChangePasswordValues | FormErrors>
  ) => {
    setErrors({})

    try {
      await changePassword(values.currentPassword, values.newPassword)

      setSubmitting(false)

      this.props.history.push('/')
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
}

export default ChangePasswordPageContainer
