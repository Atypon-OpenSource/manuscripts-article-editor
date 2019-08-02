/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  userAccountErrorMessage,
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

    const message = this.props.location.state
      ? this.props.location.state.errorMessage
      : null

    if (message === 'missing-user-profile') {
      this.setState({
        message: () => userAccountErrorMessage(),
      })
    }

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
            }}
            onSubmit={async (values, actions) => {
              const { name, email, password } = values

              try {
                await signup(name, email, password)

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
