import { FormikActions, FormikErrors } from 'formik'
import { LocationState } from 'history'
import * as HttpStatusCodes from 'http-status-codes'
import { parse } from 'qs'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Spinner from '../../icons/spinner'
import { login } from '../../lib/account'
import { resendVerificationEmail } from '../../lib/api'
import { databaseCreator } from '../../lib/db'
import token, { Token } from '../../lib/token'
import { UserProps, withUser } from '../../store/UserProvider'
import { loginSchema } from '../../validation'
import { AlertMessageType } from '../AlertMessage'
import { FormErrors } from '../Form'
import { Main, Page } from '../Page'
import { LoginValues } from './LoginForm'
import LoginPage from './LoginPage'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

interface State {
  error: boolean
  verificationMessage?: string
  loginMessage?: string
  resendVerificationData?: ResendVerificationData
  googleLoginError?: string
  infoLoginMessage?: string
}

interface ErrorMessage {
  error: string
}

interface Message {
  message: string
}

interface VerificationData {
  token: string
  email: string
}

interface RouteLocationState {
  from?: LocationState
  loginMessage?: string
  verificationMessage?: string
  infoLoginMessage?: string
}

class LoginPageContainer extends React.Component<
  UserProps & RouteComponentProps<{}, {}, RouteLocationState>,
  State
> {
  public state: Readonly<State> = {
    error: false,
  }

  private initialValues: LoginValues = {
    email: '',
    password: '',
  }

  // tslint:disable-next-line:cyclomatic-complexity
  public async componentDidMount() {
    // TODO: needs state
    const hashData: Token & ErrorMessage & VerificationData & Message = parse(
      window.location.hash.substr(1)
    )

    if (hashData && Object.keys(hashData).length) {
      if (hashData.error) {
        this.setState({ googleLoginError: hashData.error })
      } else if (hashData.access_token) {
        token.set(hashData)

        this.props.user.fetch()
        window.location.href = '/'
      }
      if (hashData.message) {
        this.setState({ infoLoginMessage: hashData.message })
      }
      window.location.hash = ''
    }

    const { email, error_description: errorDescription } = parse(
      this.props.location.search.substr(1)
    )

    if (email) {
      this.initialValues.email = email
    }

    if (errorDescription) {
      // TODO: do something
    }

    const { state } = this.props.location

    if (state) {
      this.setState({
        loginMessage: state.loginMessage,
        verificationMessage: state.verificationMessage,
        infoLoginMessage: state.infoLoginMessage,
      })
    }
  }
  public render() {
    const { user } = this.props
    const {
      // error,
      verificationMessage,
      loginMessage,
      resendVerificationData,
      googleLoginError,
      infoLoginMessage,
    } = this.state

    if (!user.loaded) {
      return <Spinner />
    }

    if (user.data) {
      return <Redirect to={'/welcome'} />
    }

    return (
      <Page>
        <Main>
          <LoginPage
            initialValues={this.initialValues}
            validationSchema={loginSchema}
            onSubmit={this.handleSubmit}
            verificationMessage={verificationMessage}
            loginMessage={loginMessage}
            resendVerificationData={resendVerificationData}
            googleLoginError={googleLoginError}
            resendVerificationEmail={this.resendVerificationEmail}
            infoLoginMessage={infoLoginMessage}
          />
        </Main>
      </Page>
    )
  }

  private handleSubmit = async (
    values: LoginValues,
    { setSubmitting, setErrors }: FormikActions<LoginValues & FormErrors>
  ) => {
    try {
      const db = await databaseCreator

      await login(values.email, values.password, db)

      const { state } = this.props.location

      // redirect if the user tried before login to access an authenticated route
      // (e.g. a bookmarked project, or a project invitation link)
      window.location.href = state && state.from ? state.from.pathname : '/'
    } catch (error) {
      setSubmitting(false)

      const errors: FormikErrors<FormErrors> = {}

      if (error.response) {
        errors.submit = this.errorResponseMessage(error.response.status, values)
      }

      setErrors(errors)
    }
  }

  private errorResponseMessage = (status: number, values: LoginValues) => {
    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        return 'Invalid operation'

      case HttpStatusCodes.UNAUTHORIZED:
        return 'Invalid username or password'

      case HttpStatusCodes.FORBIDDEN:
        this.setState({
          resendVerificationData: {
            message: 'Please verify your email address',
            email: values.email,
            type: AlertMessageType.warning,
          },
        })
        break
      default:
        return 'An error occurred.'
    }
  }

  private resendVerificationEmail = async (email: string) => {
    try {
      await resendVerificationEmail(email)

      this.setState({
        resendVerificationData: undefined,
      })
    } catch (error) {
      this.setState({
        resendVerificationData: {
          email,
          message: 'Re-sending verification email failed.',
          type: AlertMessageType.error,
        },
      })
    }
  }
}

export default withUser(LoginPageContainer)
