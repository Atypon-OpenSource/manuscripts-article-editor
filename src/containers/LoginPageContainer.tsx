import { FormikActions, FormikErrors } from 'formik'
import * as httpStatusCode from 'http-status-codes'
import { parse } from 'qs'
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { LoginErrors, LoginValues } from '../components/LoginForm'
import LoginPage from '../components/LoginPage'
import { login } from '../lib/api'
import deviceId from '../lib/deviceId'
import token, { Token } from '../lib/token'
import { UserProps, withUser } from '../store/UserProvider'
import { loginSchema } from '../validation'

interface LoginPageContainerState {
  error: boolean
}

interface ErrorMessage {
  error: string
}

class LoginPageContainer extends React.Component<UserProps> {
  public state: LoginPageContainerState = {
    error: false,
  }

  private initialValues: LoginValues = {
    email: '',
    password: '',
  }

  public componentDidMount() {
    // TODO: needs state
    const tokenData: Token & ErrorMessage = parse(
      window.location.hash.substr(1)
    )

    window.location.hash = ''

    if (tokenData && Object.keys(tokenData).length) {
      if (tokenData.error) {
        this.setState({
          error: true,
        })
      } else {
        token.set(tokenData)

        this.props.user.fetch()
      }
    }
  }

  public render() {
    const { user } = this.props
    const { error } = this.state

    if (user.data) {
      return <Redirect to={'/welcome'} />
    }

    if (error) {
      return <div>There was an error.</div>
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
      deviceId,
    }).then(
      response => {
        setSubmitting(false)

        this.props.user.fetch()
      },
      error => {
        setSubmitting(false)

        // TODO: use error and error description: show a "resend email verification" link if not confirmed
        const errors: FormikErrors<LoginErrors> = {}

        if (error.response) {
          if (error.response.status === httpStatusCode.BAD_REQUEST) {
            errors.submit = 'Invalid Operation'
          } else if (error.response.status === httpStatusCode.UNAUTHORIZED) {
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

export default withUser(LoginPageContainer)
