import { AxiosError } from 'axios'
import { FormikActions, FormikErrors } from 'formik'
import * as qs from 'qs'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
  PasswordErrors,
  PasswordHiddenValues,
  PasswordValues,
} from '../components/PasswordForm'
import PasswordPage from '../components/PasswordPage'
import { password } from '../lib/api'
import { authenticate } from '../store/authentication'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'
import { passwordSchema } from '../validation'

class PasswordPageContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps
> {
  private initialValues: PasswordValues = {
    password: '',
  }

  public render() {
    const { authentication } = this.props

    if (authentication.user) {
      return <Redirect to={'/'} />
    }

    return (
      <PasswordPage
        initialValues={this.initialValues}
        validationSchema={passwordSchema}
        onSubmit={this.handleSubmit}
      />
    )
  }

  private handleSubmit = (
    values: PasswordValues,
    { setSubmitting, setErrors }: FormikActions<PasswordValues | PasswordErrors>
  ) => {
    const { token, email }: PasswordHiddenValues = qs.parse(
      window.location.search
    )

    // TODO: read this earlier and show an error if there's no email or token?

    password({ ...values, email, token }).then(
      () => {
        setSubmitting(false)

        /* tslint:disable-next-line:no-any */
        this.props.dispatch<any>(authenticate())
      },
      (error: AxiosError) => {
        setSubmitting(false)

        const errors: FormikErrors<PasswordErrors> = {
          password: null, // TODO: read these from the response
          unauthorized: error.response && error.response.status === 401,
          submit: error.response
            ? error.response.data.error
            : 'There was an error',
        }

        setErrors(errors)
      }
    )
  }
}

export default connect<AuthenticationStateProps, AuthenticationDispatchProps>(
  (state: ApplicationState) => ({
    authentication: state.authentication,
  })
)(PasswordPageContainer)
