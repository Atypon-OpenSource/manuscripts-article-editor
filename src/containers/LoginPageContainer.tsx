import { FormikActions, FormikErrors } from 'formik'
import * as httpStatusCode from 'http-status-codes'
import { parse } from 'qs'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { LoginErrors, LoginValues } from '../components/LoginForm'
import LoginPage from '../components/LoginPage'
import { login } from '../lib/api'
import deviceId from '../lib/deviceId'
import token, { Token } from '../lib/token'
import { authenticate, authenticateSuccess } from '../store/authentication'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'
import { loginSchema } from '../validation'

class LoginPageContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps
> {
  private initialValues: LoginValues = {
    email: '',
    password: '',
  }

  public componentDidMount() {
    const tokenData: Token = parse(window.location.hash.substr(1))

    if (tokenData && tokenData.access_token && tokenData.sync_session) {
      token.set(tokenData)

      /* tslint:disable-next-line:no-any */
      this.props.dispatch<any>(authenticate())
    }
  }

  public render() {
    const { authentication } = this.props

    if (authentication.user) {
      return <Redirect to={'/'} />
    }

    return (
      <LoginPage
        initialValues={this.initialValues}
        validationSchema={loginSchema}
        onSubmit={this.handleSubmit}
      />
    )
  }

  private handleSubmit = (
    values: LoginValues,
    { setSubmitting, setErrors }: FormikActions<LoginValues | LoginErrors>
  ) => {
    login({
      ...values,
      deviceId: deviceId.get(),
    }).then(
      response => {
        setSubmitting(false)

        /* tslint:disable-next-line:no-any */
        this.props.dispatch<any>(
          authenticateSuccess({
            name: response.data.user.name,
            email: response.data.user.email,
          })
        )
      },
      error => {
        setSubmitting(false)

        // TODO: use error and error description: show a "resend email verification" link if not confirmed
        const errors: FormikErrors<LoginErrors> = {
          email: null, // TODO: read these from the response
          password: null, // TODO: read these from the response
          submit: null,
        }

        if (error.response) {
          if (error.response.status === httpStatusCode.BAD_REQUEST) {
            errors.submit = 'Invalid Operation'
          } else if (error.response.status === httpStatusCode.FORBIDDEN) {
            errors.submit = 'Invalid username or password'
          } else {
            errors.submit = 'An error occurred.'
          }
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
)(LoginPageContainer)
