/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { AlertMessageType, FormErrors } from '@manuscripts/style-guide'
import { AxiosResponse } from 'axios'
import { FormikErrors, FormikHelpers } from 'formik'
import { LocationState } from 'history'
import { StatusCodes } from 'http-status-codes'
import decode from 'jwt-decode'
import { parse } from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import config from '../../config'
import { login } from '../../lib/account'
import { redirectToConnect, resendVerificationEmail } from '../../lib/api'
import redirectPathStorage from '../../lib/redirect-path'
import tokenHandler from '../../lib/token'
import { TokenPayload } from '../../lib/user'
import userID from '../../lib/user-id'
import { loginSchema } from '../../validation'
import { IntroPage } from '../IntroPage'
import { Loading } from '../Loading'
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
  action?: string
  error?: string
  access_token?: string
  token?: string
  email?: string
  redirect?: boolean | string
  error_description?: string
  recover?: string
}

interface RouteLocationState {
  from?: LocationState
  action?: string
  loginMessage?: string
  verificationMessage?: string
  infoLoginMessage?: string
  errorMessage?: string
}

class LoginPageContainer extends React.Component<
  // eslint-disable-next-line @typescript-eslint/ban-types
  RouteComponentProps<{}, {}, RouteLocationState>,
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

    const { email } = parse(search.substr(1))

    if (email) {
      this.initialValues.email = email as string
    }

    if (state) {
      this.handleState(state)
    }
  }

  public render() {
    const { message: Message, submitErrorType } = this.state

    const hash = this.props.location.hash
    const { access_token: token, redirect }: HashData = parse(hash.substr(1))

    if (token || redirect) {
      return <Loading />
    }

    if (config.connect.enabled) {
      return <IntroPage message={Message} />
    }

    return (
      <Page>
        <Main>
          <>
            {Message && <Message />}
            <LoginPage
              initialValues={this.initialValues}
              validationSchema={loginSchema}
              submitErrorType={submitErrorType}
              onSubmit={async (values, actions) => {
                tokenHandler.remove()

                try {
                  const { token, recover } = await login(
                    values.email,
                    values.password
                  )

                  tokenHandler.set(token)

                  const { userId } = decode<TokenPayload>(token)

                  userID.set(userId)

                  recover
                    ? window.location.assign('/retrieve-account')
                    : this.redirectAfterLogin()
                } catch (error) {
                  console.error(error)

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
          </>
        </Main>
      </Page>
    )
  }

  private isRedirectAction = (redirect: string | boolean): redirect is string =>
    redirect === 'login' || redirect === 'register'

  private handleHash = (hash: string) => {
    const {
      action,
      error,
      access_token: token,
      redirect,
      error_description,
      recover,
    }: HashData = parse(hash)

    if (error_description) {
      // TODO: do something
      console.error(error_description)
    }

    if (error) {
      this.setState({
        message: () => messages.identityProviderErrorMessage(error),
      })
    } else if (action === 'logout') {
      this.setState({
        message: () => messages.infoLoginMessage('You have been signed out'),
      })
    } else if (token) {
      tokenHandler.set(token)

      recover === 'true'
        ? window.location.assign('/retrieve-account')
        : this.redirectAfterLogin()
    }

    if (redirect && config.connect.enabled) {
      redirectToConnect(this.isRedirectAction(redirect) ? redirect : undefined)
    }
  }

  private handleState = (state: RouteLocationState) => {
    const {
      infoLoginMessage,
      loginMessage,
      verificationMessage,
      errorMessage,
    } = state

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
    } else if (errorMessage === 'missing-user-profile') {
      this.setState({
        message: () => messages.userAccountErrorMessage(),
      })
    }
  }

  private handleErrorResponse = (
    response: AxiosResponse,
    values: LoginValues,
    actions: FormikHelpers<LoginValues>
  ) => {
    const errorName = this.errorName(response)

    switch (errorName) {
      case ErrorName.GatewayInaccessibleError:
        this.setState({
          message: messages.gatewayInaccessibleErrorMessage,
        })
        return

      case ErrorName.InvalidCredentialsError:
      default: {
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
  }

  // redirect if the user tried before login to access an authenticated route
  // (e.g. a bookmarked project, but not a project invitation link,
  // that is handled with invitationTokenHandler and AcceptProjectInvitation component)
  private redirectAfterLogin = () => {
    const redirectPath = redirectPathStorage.get()

    if (redirectPath) {
      redirectPathStorage.remove()
      window.location.assign(redirectPath)
    } else {
      window.location.assign('/projects')
    }
  }

  private errorName = (response: AxiosResponse) => {
    const { data } = response

    if (!data) {
      return null
    }

    if (!data.error) {
      return null
    }

    const error = JSON.parse(data.error)

    return error ? error.name : null
  }

  private errorResponseMessage = (
    status: number,
    values: LoginValues,
    errorName: string
  ) => {
    switch (status) {
      case StatusCodes.BAD_REQUEST:
        return 'Invalid operation'

      case StatusCodes.UNAUTHORIZED:
        if (errorName === ErrorName.AccountNotFoundError) {
          return 'No user exists with this email address.'
        } else if (errorName === ErrorName.InvalidClientApplicationError) {
          return `Client and server configuration do not match. Please report this to ${config.support.email}.`
        } else {
          return 'Invalid password.'
        }

      case StatusCodes.FORBIDDEN: {
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
      }

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
