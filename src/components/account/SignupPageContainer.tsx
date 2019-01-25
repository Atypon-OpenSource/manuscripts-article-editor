import { AxiosError } from 'axios'
import { FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse, stringify } from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { resendVerificationEmail, signup, verify } from '../../lib/api'
import { signupSchema } from '../../validation'
import { Main, Page } from '../Page'
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

const errorResponseMessage = (status: number) => {
  switch (status) {
    case HttpStatusCodes.BAD_REQUEST:
      return 'Invalid operation'

    case HttpStatusCodes.CONFLICT:
      return 'The email address is already registered'

    default:
      return 'An error occurred.'
  }
}

interface State {
  message?: () => void
  email?: string
}

class SignupPageContainer extends React.Component<
  RouteComponentProps<{}>,
  State
> {
  public state: Readonly<State> = {}

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
    const { message } = this.state

    return (
      <Page>
        <Main>
          {message && message()}
          <SignupPage
            initialValues={{
              email: '',
              password: '',
              name: '',
              allowsTracking: false,
            }}
            onSubmit={async (values, actions) => {
              const { name, email, password, allowsTracking } = values

              try {
                await signup(name, email, password, allowsTracking)

                actions.setSubmitting(false)

                this.setState({
                  message: () =>
                    signupVerifyMessage(email, this.resendVerificationEmail),
                  email,
                })
              } catch (error) {
                actions.setSubmitting(false)

                await this.handleError(error, actions.setErrors, email)
              }
            }}
            validationSchema={signupSchema}
          />
        </Main>
      </Page>
    )
  }

  private handleError = async (
    error: AxiosError,
    setErrors: (errors: FormikErrors<SignupValues & SignupErrors>) => void,
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
          email: undefined,
        })

        await resendVerificationEmail(email)
      } else if (data && data.error && name === 'GatewayInaccessibleError') {
        this.setState({
          message: () => gatewayInaccessibleErrorMessage(),
        })
      } else {
        errors.submit = errorResponseMessage(error.response.status)

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
}

export default SignupPageContainer
