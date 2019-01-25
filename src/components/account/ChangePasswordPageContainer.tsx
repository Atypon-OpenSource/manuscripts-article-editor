import { Formik, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { changePassword } from '../../lib/api'
import { changePasswordSchema } from '../../validation'
import { FormErrors } from '../Form'
import { ChangePasswordMessage } from '../Messages'
import { ModalForm } from '../ModalForm'
import { ChangePasswordForm, ChangePasswordValues } from './ChangePasswordForm'

const ChangePasswordPageContainer: React.FunctionComponent<
  RouteComponentProps
> = ({ history }) => (
  <ModalForm
    title={<ChangePasswordMessage />}
    handleClose={() => history.goBack()}
  >
    <Formik<ChangePasswordValues>
      initialValues={{
        currentPassword: '',
        newPassword: '',
      }}
      validationSchema={changePasswordSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, actions) => {
        actions.setErrors({})

        try {
          await changePassword(values.currentPassword, values.newPassword)

          actions.setSubmitting(false)

          history.push('/')
        } catch (error) {
          actions.setSubmitting(false)

          const errors: FormikErrors<ChangePasswordValues & FormErrors> = {
            submit:
              error.response &&
              error.response.status === HttpStatusCodes.UNAUTHORIZED
                ? 'The password entered is incorrect'
                : 'There was an error',
          }

          actions.setErrors(errors)
        }
      }}
      component={ChangePasswordForm}
    />
  </ModalForm>
)

export default ChangePasswordPageContainer
