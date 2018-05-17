import { AxiosError } from 'axios'
import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse } from 'qs'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { Main, Page } from '../components/Page'
import {
  PasswordErrors,
  PasswordHiddenValues,
  PasswordValues,
} from '../components/PasswordForm'
import PasswordPage from '../components/PasswordPage'
import { RecoverConfirm } from '../components/RecoverConfirm'
import { RecoverErrors, RecoverValues } from '../components/RecoverForm'
import RecoverPage from '../components/RecoverPage'
import { recoverPassword, resetPassword } from '../lib/api'
import deviceId from '../lib/deviceId'
import { UserProps, withUser } from '../store/UserProvider'
import { passwordSchema, recoverSchema } from '../validation'

interface State extends PasswordHiddenValues {
  sent: string | null
}

type Props = UserProps

class RecoverPageContainer extends React.Component<Props> {
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

    if (user.data) {
      return <Redirect to={'/'} />
    }

    if (sent) {
      return (
        <Page>
          <Main>
            <RecoverConfirm email={sent} />
          </Main>
        </Page>
      )
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

  private verifyRecovery = (
    values: PasswordValues,
    { setSubmitting, setErrors }: FormikActions<PasswordValues | PasswordErrors>
  ) => {
    const { token }: PasswordHiddenValues = this.state

    resetPassword({
      ...values,
      token,
      deviceId,
    }).then(
      response => {
        setSubmitting(false)

        this.props.user.fetch()
      },
      (error: AxiosError) => {
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
    )
  }

  private sendRecovery = (
    values: RecoverValues,
    { setSubmitting, setErrors }: FormikActions<RecoverValues | RecoverErrors>
  ) => {
    recoverPassword(values).then(
      () => {
        setSubmitting(false)

        this.setState({
          sent: values.email,
        })
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<RecoverErrors> = {}

        if (error.response) {
          if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
            errors.notFound = true
          } else if (error.response.status === HttpStatusCodes.BAD_REQUEST) {
            errors.submit = 'Invalid parameters'
          } else {
            errors.submit = 'An error occurred'
          }
        }

        setErrors(errors)
      }
    )
  }
}

export default withUser(RecoverPageContainer)
