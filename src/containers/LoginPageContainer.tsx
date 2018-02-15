import { FormikActions, FormikErrors } from 'formik'
import { parse } from 'qs'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { LoginErrors, LoginValues } from '../components/LoginForm'
import LoginPage from '../components/LoginPage'
import { login } from '../lib/api'
import token, { Token } from '../lib/token'
import { authenticate } from '../store/authentication'
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

    if (
      tokenData &&
      tokenData.access_token &&
      tokenData.token_type === 'bearer' &&
      tokenData.refresh_token &&
      tokenData.expires_in
    ) {
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
    login(values).then(
      () => {
        setSubmitting(false)

        /* tslint:disable-next-line:no-any */
        this.props.dispatch<any>(authenticate())
      },
      error => {
        setSubmitting(false)

        // TODO: use error and error description: show a "resend email verification" link if not confirmed

        const errors: FormikErrors<LoginErrors> = {
          email: null, // TODO: read these from the response
          password: null, // TODO: read these from the response
          // unauthorized: error.response && error.response.status === 401,
          submit:
            error.response && error.response.data.error_description
              ? error.response.data.error_description
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
)(LoginPageContainer)
