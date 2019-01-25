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
