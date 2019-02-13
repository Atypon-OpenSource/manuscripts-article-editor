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

import { AxiosResponse } from 'axios'
import { FormikActions, FormikErrors } from 'formik'
import { LocationState } from 'history'
import * as HttpStatusCodes from 'http-status-codes'
import { parse } from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import config from '../../config'
import { TokenActions } from '../../data/TokenData'
import { login } from '../../lib/account'
import { resendVerificationEmail } from '../../lib/api'
import { loginSchema } from '../../validation'
import { AlertMessageType } from '../AlertMessage'
import { FormErrors } from '../Form'
import { Main, Page } from '../Page'
import { LoginValues } from './LoginForm'
import * as messages from './LoginMessages'
import LoginPage from './LoginPage'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

type AlertFunction = React.FunctionComponent

export enum ErrorName {
  GatewayInaccessibleError = 'GatewayInaccessibleError',
  AccountNotFoundError = 'AccountNotFoundError',
  InvalidClientApplicationError = 'InvalidClientApplicationError',
  InvalidCredentialsError = 'InvalidCredentialsError',
}

interface State {
  message?: AlertFunction
  submitErrorType?: string
}

interface HashData {
  error?: string
  access_token?: string
  token?: string
  email?: string
}

interface RouteLocationState {
  from?: LocationState
  action?: string
  loginMessage?: string
  verificationMessage?: string
  infoLoginMessage?: string
}

interface Props {
  tokenActions: TokenActions
}

class LoginPageContainer extends React.Component<
  Props & RouteComponentProps<{}, {}, RouteLocationState>,
  State
> {
  public state: Readonly<State> = {}

  private initialValues: LoginValues = {
    email: '',
    password: '',
  }

  public componentDidMount() {
    const {
      location: { hash, state, search },
    } = this.props

    if (hash.length > 1) {
      this.handleHash(hash.substr(1))
    }

    const { email, error_description: errorDescription } = parse(
      search.substr(1)
    )

    if (email) {
      this.initialValues.email = email
    }

    if (errorDescription) {
      // TODO: do something
    }

    if (state) {
      this.handleState(state)
    }
  }

  public render() {
    const { message: Message, submitErrorType } = this.state

    return (
      <Page>
        <Main>
          {Message && <Message />}

          <LoginPage
            initialValues={this.initialValues}
            validationSchema={loginSchema}
            submitErrorType={submitErrorType}
            onSubmit={async (values, actions) => {
              this.props.tokenActions.delete()

              try {
                const token = await login(values.email, values.password)

                this.props.tokenActions.update(token)

                this.redirectAfterLogin()
              } catch (error) {
                console.error(error) // tslint:disable-line:no-console

                if (error.response) {
                  this.handleErrorResponse(error.response, values, actions)
                } else {
                  this.setState({
                    message: messages.networkErrorMessage,
                  })
                }

                actions.setSubmitting(false)
              }
            }}
          />
        </Main>
      </Page>
    )
  }

  private handleHash = (hash: string) => {
    const { error, access_token: token }: HashData = parse(hash)

    if (error) {
      this.setState({
        message: () => messages.identityProviderErrorMessage(error),
      })
    } else if (token) {
      this.props.tokenActions.update(token)

      window.location.href = '/'
    }

    window.location.hash = ''
  }

  private handleState = (state: RouteLocationState) => {
    const { infoLoginMessage, loginMessage, verificationMessage } = state

    // TODO: pass message and messageType in state

    if (loginMessage) {
      this.setState({
        message: () => messages.warningLoginMessage(loginMessage),
      })
    } else if (verificationMessage) {
      this.setState({
        message: () => messages.verificationMessage(verificationMessage),
      })
    } else if (infoLoginMessage) {
      this.setState({
        message: () => messages.infoLoginMessage(infoLoginMessage),
      })
    }
  }

  private handleErrorResponse = (
    response: AxiosResponse,
    values: LoginValues,
    actions: FormikActions<LoginValues>
  ) => {
    const errorName = this.errorName(response)

    switch (errorName) {
      case ErrorName.GatewayInaccessibleError:
        this.setState({
          message: messages.gatewayInaccessibleErrorMessage,
        })
        return

      case ErrorName.InvalidCredentialsError:
      default:
        const errors: FormikErrors<LoginValues & FormErrors> = {
          submit: this.errorResponseMessage(response.status, values, errorName),
        }

        actions.setErrors(errors)

        this.setState({
          submitErrorType: errorName,
        })

        return
    }
  }

  // redirect if the user tried before login to access an authenticated route
  // (e.g. a bookmarked project, or a project invitation link)
  private redirectAfterLogin = () => {
    const { state } = this.props.location

    window.location.href = state && state.from ? state.from.pathname : '/'
  }

  private errorName = (response: AxiosResponse) => {
    const { data } = response

    if (!data) return null

    if (!data.error) return null

    const error = JSON.parse(data.error)

    return error ? error.name : null
  }

  private errorResponseMessage = (
    status: number,
    values: LoginValues,
    errorName: string
  ) => {
    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        return 'Invalid operation'

      case HttpStatusCodes.UNAUTHORIZED:
        if (errorName === ErrorName.AccountNotFoundError) {
          return 'No user exists with this email address.'
        } else if (errorName === ErrorName.InvalidClientApplicationError) {
          return `Client and server configuration do not match. Please report this to ${
            config.support.email
          }.`
        } else {
          return 'Invalid password.'
        }

      case HttpStatusCodes.FORBIDDEN:
        const resendVerificationData: ResendVerificationData = {
          message: 'Please verify your email address',
          email: values.email,
          type: AlertMessageType.warning,
        }

        this.setState({
          message: () =>
            messages.resendVerificationDataMessage(resendVerificationData, () =>
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
        message: undefined,
      })
    } catch (error) {
      const resendVerificationData: ResendVerificationData = {
        message: 'Re-sending verification email failed.',
        email,
        type: AlertMessageType.error,
      }
      this.setState({
        message: () =>
          messages.resendVerificationDataMessage(resendVerificationData, () =>
            this.resendVerificationEmail(email)
          ),
      })
    }
  }
}

export default LoginPageContainer
