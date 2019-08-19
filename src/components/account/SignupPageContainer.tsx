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

import { AxiosError } from 'axios'
import { FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse, stringify } from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { resendVerificationEmail, signup, verify } from '../../lib/api'
import { styled } from '../../theme/styled-components'
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

const FooterContainer = styled.div`
  padding-bottom: 10px;
  padding-left: 20px;
  height: 50px;
  margin: auto;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`

const HeavyLink = styled.a`
  color: inherit;
  font-weight: 500;
  text-decoration: none;
`

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
          <FooterContainer>
            <div>Copyright © 2019 Atypon Systems, LLC.</div>
            <HeavyLink href={'https://www.atypon.com/privacy-policy/'}>
              Privacy policy
            </HeavyLink>
          </FooterContainer>
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
