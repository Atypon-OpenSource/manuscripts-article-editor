import { AxiosError } from 'axios'
import { FormikActions, FormikErrors } from 'formik'
import * as httpStatusCodes from 'http-status-codes'
import { parse } from 'qs'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
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
import { authenticate } from '../store/authentication'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'
import { passwordSchema, recoverSchema } from '../validation'

interface RecoverPageContainerState extends PasswordHiddenValues {
  sent: string | null
}

class RecoverPageContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps
> {
  public state: RecoverPageContainerState = {
    sent: null,
    token: '',
    userId: '',
  }

  private initialRecoverValues: RecoverValues = {
    email: '',
  }

  private initialPasswordValues: PasswordValues = {
    password: '',
  }

  public componentDidMount() {
    const { token, userId } = parse(window.location.hash.substr(1))

    if (token && userId) {
      this.setState({ token, userId })
    }
  }

  public render() {
    const { authentication } = this.props
    const { sent, token, userId } = this.state

    if (authentication.user) {
      return <Redirect to={'/'} />
    }

    if (sent) {
      return <RecoverConfirm email={sent} />
    }

    if (token && userId) {
      return (
        <PasswordPage
          initialValues={this.initialPasswordValues}
          validationSchema={passwordSchema}
          onSubmit={this.verifyRecovery}
        />
      )
    }

    return (
      <RecoverPage
        initialValues={this.initialRecoverValues}
        validationSchema={recoverSchema}
        onSubmit={this.sendRecovery}
      />
    )
  }

  private verifyRecovery = (
    values: PasswordValues,
    { setSubmitting, setErrors }: FormikActions<PasswordValues | PasswordErrors>
  ) => {
    const { token, userId }: PasswordHiddenValues = this.state

    resetPassword({
      ...values,
      token,
      userId,
      deviceId: deviceId.get(),
    }).then(
      response => {
        setSubmitting(false)

        /* tslint:disable-next-line:no-any */
        this.props.dispatch<any>(authenticate())
      },
      (error: AxiosError) => {
        setSubmitting(false)

        const errors: FormikErrors<PasswordErrors> = {
          password: null, // TODO: read these from the response
          unauthorized: null,
          submit: null,
        }

        if (error.response) {
          if (error.response.status === httpStatusCodes.UNAUTHORIZED) {
            errors.submit = 'Invalid or expired reset password link'
          } else if (error.response.status === httpStatusCodes.BAD_REQUEST) {
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

        const errors: FormikErrors<RecoverErrors> = {
          email: null, // TODO: read these from the response
          notFound: false,
          submit: null,
        }

        if (error.response) {
          if (error.response.status === httpStatusCodes.UNAUTHORIZED) {
            errors.notFound = true
          } else if (error.response.status === httpStatusCodes.BAD_REQUEST) {
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

export default connect<AuthenticationStateProps, AuthenticationDispatchProps>(
  (state: ApplicationState) => ({
    authentication: state.authentication,
  })
)(RecoverPageContainer)
