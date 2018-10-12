import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse } from 'qs'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Spinner from '../../icons/spinner'
import { login } from '../../lib/account'
import { databaseCreator } from '../../lib/db'
import token, { Token } from '../../lib/token'
import { UserProps, withUser } from '../../store/UserProvider'
import { loginSchema } from '../../validation'
import { FormErrors } from '../Form'
import { Main, Page } from '../Page'
import { LoginValues } from './LoginForm'
import LoginPage from './LoginPage'

interface State {
  error: boolean
  verificationMessage: string
  loginMessage: string | null
}

interface ErrorMessage {
  error: string
}

class LoginPageContainer extends React.Component<
  UserProps & RouteComponentProps,
  State
> {
  public state: Readonly<State> = {
    error: false,
    verificationMessage: '',
    loginMessage: '',
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

    if (tokenData && Object.keys(tokenData).length) {
      if (tokenData.error) {
        this.setState({
          error: true,
        })
      } else {
        token.set(tokenData)

        this.props.user.fetch()
      }
      window.location.hash = ''
    }
    const state = this.props.location.state
    if (state) {
      this.setState({
        verificationMessage: state.verificationMessage,
        loginMessage: state.loginMessage || null,
      })
    }
  }

  public render() {
    const { user } = this.props
    const { error } = this.state
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
            verificationMessage={this.state.verificationMessage}
            loginMessage={this.state.loginMessage}
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
        errors.submit = this.errorResponseMessage(error.response.status)
      }

      setErrors(errors)
    }
  }

  private errorResponseMessage = (status: number) => {
    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        return 'Invalid operation'

      case HttpStatusCodes.UNAUTHORIZED:
        return 'Invalid username or password'

      case HttpStatusCodes.FORBIDDEN:
        // TODO: show a "resend email verification" link if not confirmed
        return 'Please verify your email address'

      default:
        return 'An error occurred.'
    }
  }
}

export default withUser(LoginPageContainer)
