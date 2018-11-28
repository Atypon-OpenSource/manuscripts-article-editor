import { AxiosError } from 'axios'
import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse, stringify } from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { resendVerificationEmail, signup, verify } from '../../lib/api'
import { UserProps, withUser } from '../../store/UserProvider'
import { signupSchema } from '../../validation'
import { Main, Page } from '../Page'
import { Spinner } from '../Spinner'
import {
  gatewayInaccessibleErrorMessage,
  networkErrorMessage,
} from './LoginMessages'
import { SignupErrors, SignupValues } from './SignupForm'
import {
  signupVerifyConflictMessage,
  signupVerifyMessage,
  signupVerifyResendFailureMessage,
  signupVerifyResendSuccessMessage,
} from './SignupMessages'
import SignupPage from './SignupPage'

type AlertFunction = () => void
interface State {
  message: null | AlertFunction
  email: string | null
}

class SignupPageContainer extends React.Component<
  UserProps & RouteComponentProps<{}>,
  State
> {
  public state: Readonly<State> = {
    message: null,
    email: null,
  }

  private initialValues: SignupValues = {
    email: '',
    password: '',
    name: '',
    allowsTracking: false,
  }

  public async componentDidMount() {
    const { token, email } = parse(window.location.hash.substr(1))

    if (token) {
      try {
        await verify(token)

        this.props.history.push(`/login?${stringify({ email })}`, {
          verificationMessage: 'Your account is now verified.',
        })
      } catch (error) {
        this.props.history.push('/login', {
          verificationMessage: 'account-verification-failed',
        })
      }
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
          <SignupPage
            initialValues={this.initialValues}
            onSubmit={this.handleSubmit}
            validationSchema={signupSchema}
          />
        </Main>
      </Page>
    )
  }

  private handleSubmit = async (
    values: SignupValues,
    { setSubmitting, setErrors }: FormikActions<SignupValues | SignupErrors>
  ) => {
    const { name, email, password, allowsTracking } = values

    try {
      await signup(name, email, password, allowsTracking)

      setSubmitting(false)

      this.setState({
        message: () => signupVerifyMessage(email, this.resendVerificationEmail),
        email,
      })
    } catch (error) {
      setSubmitting(false)

      await this.handleError(error, setErrors, email)
    }
  }

  private handleError = async (
    error: AxiosError,
    setErrors: (
      errors: FormikErrors<SignupValues> | FormikErrors<SignupErrors>
    ) => void,
    email: string
  ) => {
    const errors: FormikErrors<SignupErrors> = {}

    if (error.response) {
      const { data } = error.response
      const name = JSON.parse(data.error).name

      if (
        data &&
        data.error &&
        name === 'ConflictingUnverifiedUserExistsError'
      ) {
        this.setState({
          message: () => signupVerifyConflictMessage(email),
          email: null,
        })

        await resendVerificationEmail(email)
      } else if (data && data.error && name === 'GatewayInaccessibleError') {
        this.setState({
          message: () => gatewayInaccessibleErrorMessage(),
        })
      } else {
        errors.submit = this.errorResponseMessage(error.response.status)

        setErrors(errors)
      }
    } else {
      this.setState({
        message: () => networkErrorMessage(),
      })
    }
  }

  private resendVerificationEmail = async () => {
    const email = this.state.email

    if (!email) return

    try {
      await resendVerificationEmail(email)

      this.setState({
        message: () => signupVerifyResendSuccessMessage(email),
      })
    } catch (error) {
      this.setState({
        message: () =>
          signupVerifyResendFailureMessage(email, this.resendVerificationEmail),
      })
    }
  }

  private errorResponseMessage = (status: number) => {
    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        return 'Invalid operation'

      case HttpStatusCodes.CONFLICT:
        return 'The email address is already registered'

      default:
        return 'An error occurred.'
    }
  }
}

export default withUser(SignupPageContainer)
