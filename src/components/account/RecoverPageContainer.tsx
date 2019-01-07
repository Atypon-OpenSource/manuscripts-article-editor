import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse, stringify } from 'qs'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { resetPassword } from '../../lib/account'
import { sendPasswordRecovery } from '../../lib/api'
import { UserProps, withUser } from '../../store/UserProvider'
import { passwordSchema, recoverSchema } from '../../validation'
import { MessageBannerAction } from '../MessageBanner'
import { Main, Page } from '../Page'
import { Spinner } from '../Spinner'
import { PasswordErrors, PasswordValues } from './PasswordForm'
import PasswordPage from './PasswordPage'
import { RecoverErrors, RecoverValues } from './RecoverForm'
import RecoverPage from './RecoverPage'

interface State {
  sent: string | null
  token: string
}

class RecoverPageContainer extends React.Component<
  UserProps & RouteComponentProps<{}>
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
    const { user } = this.props
    const { sent, token } = this.state

    if (!user.loaded) {
      return <Spinner />
    }

    if (user.data) {
      return <Redirect to={'/'} />
    }

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
      await resetPassword(values.password, this.state.token)

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

export default withUser(RecoverPageContainer)
