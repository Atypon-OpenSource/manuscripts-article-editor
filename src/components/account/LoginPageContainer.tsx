import { FormikActions, FormikErrors } from 'formik'
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
  verificationMessage: string
  loginMessage: string | null
  resendVerificationData: ResendVerificationData | null
}

interface ErrorMessage {
  error: string
}

interface VerificationData {
  token: string
  email: string
}

class LoginPageContainer extends React.Component<
  UserProps & RouteComponentProps,
  State
> {
  public state: Readonly<State> = {
    error: false,
    verificationMessage: '',
    loginMessage: '',
    resendVerificationData: null,
  }

  private initialValues: LoginValues = {
    email: '',
    password: '',
  }

  public async componentDidMount() {
    // TODO: needs state
    const hashData: Token & ErrorMessage & VerificationData = parse(
      window.location.hash.substr(1)
    )

    if (hashData && Object.keys(hashData).length) {
      if (hashData.error) {
        this.setState({ error: true })
      } else {
        token.set(hashData)

        this.props.user.fetch()
      }
      window.location.hash = ''
    }

    const { email } = parse(this.props.location.search.substr(1))

    if (email) {
      this.initialValues.email = email
    }

    const state = this.props.location.state
    if (state) {
      this.setState({
        loginMessage: state.loginMessage || null,
        verificationMessage: state.verificationMessage,
      })
    }
  }

  public render() {
    const { user } = this.props
    const {
      error,
      verificationMessage,
      loginMessage,
      resendVerificationData,
    } = this.state
    if (!user.loaded) {
      return <Spinner />
    }

    if (user.data) {
      return <Redirect to={'/welcome'} />
    }

    if (error) {
      return <div>There was an error.</div>
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
            resendVerificationEmail={this.resendVerificationEmail}
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

      window.location.href = '/'
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

      this.setState({ resendVerificationData: null })
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
