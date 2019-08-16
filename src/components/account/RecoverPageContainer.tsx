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

import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse, stringify } from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { TokenActions } from '../../data/TokenData'
import { resetPassword } from '../../lib/account'
import { sendPasswordRecovery } from '../../lib/api'
import { passwordSchema, recoverSchema } from '../../validation'
import { MessageBannerAction } from '../MessageBanner'
import { Main, Page } from '../Page'
import { PasswordErrors, PasswordValues } from './PasswordForm'
import PasswordPage from './PasswordPage'
import { RecoverErrors, RecoverValues } from './RecoverForm'
import RecoverPage from './RecoverPage'

interface Props {
  tokenActions: TokenActions
}

interface State {
  sent: string | null
  token: string
}

class RecoverPageContainer extends React.Component<
  Props & RouteComponentProps
> {
  public state: Readonly<State> = {
    sent: null,
    token: '',
  }

  private initialRecoverValues: RecoverValues = {
    email: '',
  }

  private initialPasswordValues: PasswordValues = {
    password: '',
  }

  public componentDidMount() {
    const { token } = parse(window.location.hash.substr(1))

    if (token) {
      this.setState({ token })
    }
  }

  public render() {
    const { sent, token } = this.state

    if (sent) {
      this.props.history.push('/login', {
        infoLoginMessage:
          'An email with password reset instructions has been sent. Follow the link in the email to reset your password.',
      })
    }

    return (
      <Page>
        <Main>
          {token ? (
            <PasswordPage
              initialValues={this.initialPasswordValues}
              validationSchema={passwordSchema}
              onSubmit={this.verifyRecovery}
            />
          ) : (
            <RecoverPage
              initialValues={this.initialRecoverValues}
              validationSchema={recoverSchema}
              onSubmit={this.sendRecovery}
            />
          )}
        </Main>
      </Page>
    )
  }

  private verifyRecovery = async (
    values: PasswordValues,
    { setSubmitting, setErrors }: FormikActions<PasswordValues | PasswordErrors>
  ) => {
    try {
      const token = await resetPassword(values.password, this.state.token)

      this.props.tokenActions.update(token)

      setSubmitting(false)

      window.location.href =
        '/projects#' +
        stringify({
          action: MessageBannerAction.resetPassword,
        })
    } catch (error) {
      setSubmitting(false)

      const errors: FormikErrors<PasswordErrors> = {}

      if (error.response) {
        if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
          errors.submit = 'Invalid or expired reset password link'
        } else if (error.response.status === HttpStatusCodes.BAD_REQUEST) {
          errors.submit = 'Invalid parameters'
        } else {
          errors.submit = 'An error occurred'
        }
      }

      setErrors(errors)
    }
  }

  private sendRecovery = async (
    values: RecoverValues,
    { setSubmitting, setErrors }: FormikActions<RecoverValues & RecoverErrors>
  ) => {
    try {
      await sendPasswordRecovery(values.email)

      setSubmitting(false)

      this.setState({
        sent: values.email,
      })
    } catch (error) {
      setSubmitting(false)

      const errors: FormikErrors<RecoverValues & RecoverErrors> = {}

      if (error.response) {
        if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
          errors.notFound = 'Invalid username or password'
        } else if (error.response.status === HttpStatusCodes.BAD_REQUEST) {
          errors.submit = 'Invalid parameters'
        } else {
          errors.submit = 'An error occurred'
        }
      }

      setErrors(errors)
    }
  }
}

export default RecoverPageContainer
