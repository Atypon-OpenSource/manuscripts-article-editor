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
import LoginPageMessages from './LoginMessages'
import LoginPage from './LoginPage'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

interface State {
  error: boolean
  verificationMessage: string | null
  loginMessage: string | null
  resendVerificationData: ResendVerificationData | null
  googleLoginError: string | null
  infoLoginMessage: string | null
  networkError: boolean | null
  gatewayInaccessible: boolean | null
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
    error: false,
    googleLoginError: null,
    infoLoginMessage: null,
    loginMessage: null,
    networkError: null,
    resendVerificationData: null,
    verificationMessage: null,
    gatewayInaccessible: null,
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
      this.setState({
        loginMessage: state.loginMessage || null,
        verificationMessage: state.verificationMessage || null,
        infoLoginMessage: state.infoLoginMessage || null,
      })
    }
  }

  public updateState = (
    hashData: Token & ErrorMessage & VerificationData & Action
  ) => {
    if (hashData && Object.keys(hashData).length) {
      if (hashData.error) {
        this.setState({ googleLoginError: hashData.error })
      } else if (hashData.access_token) {
        token.set(hashData)

        fetchUser(this.props.user)
        window.location.href = '/'
      }
      if (hashData.action === 'logout') {
        this.setState({ infoLoginMessage: 'You have been logged out.' })
      }
      window.location.hash = ''
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
      networkError,
      gatewayInaccessible,
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
          <LoginPageMessages
            verificationMessage={verificationMessage}
            googleLoginError={googleLoginError}
            loginMessage={loginMessage}
            resendVerificationData={resendVerificationData}
            resendVerificationEmail={this.resendVerificationEmail}
            infoLoginMessage={infoLoginMessage}
            networkError={networkError}
            gatewayInaccessible={gatewayInaccessible}
          />
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
            gatewayInaccessible: true,
          })
        } else {
          errors.submit = this.errorResponseMessage(
            error.response.status,
            values
          )
          setErrors(errors)
        }
      } else {
        this.setState({ networkError: true })
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
        resendVerificationData: null,
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
