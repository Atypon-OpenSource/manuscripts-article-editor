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
import { fetchUser } from '../../lib/fetchUser'
import token, { Token } from '../../lib/token'
import { UserProps, withUser } from '../../store/UserProvider'
import { loginSchema } from '../../validation'
import { AlertMessageType } from '../AlertMessage'
import { FormErrors } from '../Form'
import { Main, Page } from '../Page'
import { LoginValues } from './LoginForm'
import {
  gatewayInaccessibleErrorMessage,
  identityProviderErrorMessage,
  infoLoginMessage,
  networkErrorMessage,
  resendVerificationDataMessage,
  verificationMessage,
  warningLoginMessage,
} from './LoginMessages'
import LoginPage from './LoginPage'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

type AlertFunction = () => void

interface State {
  message: null | AlertFunction
}

interface ErrorMessage {
  error: string
}

interface Action {
  action: string
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
    message: null,
  }

  private initialValues: LoginValues = {
    email: '',
    password: '',
  }

  public async componentDidMount() {
    // TODO: needs state
    const hashData: Token & ErrorMessage & VerificationData & Action = parse(
      window.location.hash.substr(1)
    )

    this.updateState(hashData)

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
      if (state.loginMessage) {
        this.setState({
          message: () => warningLoginMessage(state.loginMessage!),
        })
      }
      if (state.verificationMessage) {
        this.setState({
          message: () => verificationMessage(state.verificationMessage!),
        })
      }
      if (state.infoLoginMessage) {
        this.setState({
          message: () => infoLoginMessage(state.infoLoginMessage!),
        })
      }
    }
  }

  public updateState = (
    hashData: Token & ErrorMessage & VerificationData & Action
  ) => {
    if (hashData && Object.keys(hashData).length) {
      if (hashData.error) {
        this.setState({
          message: () => identityProviderErrorMessage(hashData.error),
        })
      } else if (hashData.access_token) {
        token.set(hashData)

        fetchUser(this.props.user)
        window.location.href = '/'
      }
      if (hashData.action === 'logout') {
        this.setState({
          message: () => infoLoginMessage('You have been logged out.'),
        })
      }
      window.location.hash = ''
    }
  }

  public render() {
    const { user } = this.props
    const { message } = this.state

    if (!user.loaded) {
      return <Spinner />
    }

    if (user.data) {
      return <Redirect to={'/'} />
    }

    return (
      <Page>
        <Main>
          {message && message()}
          <LoginPage
            initialValues={this.initialValues}
            validationSchema={loginSchema}
            onSubmit={this.handleSubmit}
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
        const { data } = error.response
        if (
          data &&
          data.error &&
          JSON.parse(data.error).name === 'GatewayInaccessibleError'
        ) {
          this.setState({
            message: () => gatewayInaccessibleErrorMessage(),
          })
        } else {
          errors.submit = this.errorResponseMessage(
            error.response.status,
            values
          )
          setErrors(errors)
        }
      } else {
        this.setState({
          message: () => networkErrorMessage(),
        })
      }
    }
  }

  private errorResponseMessage = (status: number, values: LoginValues) => {
    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        return 'Invalid operation'

      case HttpStatusCodes.UNAUTHORIZED:
        return 'Invalid username or password'

      case HttpStatusCodes.FORBIDDEN:
        const resendVerificationData: ResendVerificationData = {
          message: 'Please verify your email address',
          email: values.email,
          type: AlertMessageType.warning,
        }

        this.setState({
          message: () =>
            resendVerificationDataMessage(resendVerificationData, () =>
              this.resendVerificationEmail(values.email)
            ),
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
        message: null,
      })
    } catch (error) {
      const resendVerificationData: ResendVerificationData = {
        message: 'Re-sending verification email failed.',
        email,
        type: AlertMessageType.error,
      }
      this.setState({
        message: () =>
          resendVerificationDataMessage(resendVerificationData, () =>
            this.resendVerificationEmail(email)
          ),
      })
    }
  }
}

export default withUser(LoginPageContainer)
