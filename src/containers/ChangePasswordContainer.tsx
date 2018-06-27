import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import Modal from 'react-modal'
import { RouteComponentProps } from 'react-router'
import { ChangePasswordValues } from '../components/ChangePasswordForm'
import ChangePasswordPage from '../components/ChangePasswordPage'
import { FormErrors } from '../components/Form'
import { modalStyle } from '../components/Manage'
import { Main, Page } from '../components/Page'
import { changePassword } from '../lib/api'
import deviceId from '../lib/deviceId'
import token from '../lib/token'
import { changePasswordSchema } from '../validation'

class ChangePasswordContainer extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <Page>
        <Main>
          <Modal isOpen={true} ariaHideApp={false} style={modalStyle}>
            <ChangePasswordPage
              initialValues={{
                currentPassword: '',
                newPassword: '',
              }}
              validationSchema={changePasswordSchema}
              onSubmit={this.handleSubmit}
            />
          </Modal>
        </Main>
      </Page>
    )
  }

  private handleSubmit = (
    values: ChangePasswordValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<ChangePasswordValues | FormErrors>
  ) => {
    setErrors({})

    changePassword({
      ...values,
      deviceId,
    }).then(
      () => {
        setSubmitting(false)

        this.props.history.push('/')
      },

      error => {
        setSubmitting(false)
        if (error.response.data.notFound) {
          token.remove()
          window.location.href = '/'
        }

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

export default ChangePasswordContainer
