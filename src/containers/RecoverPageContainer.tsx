import { AxiosError } from 'axios'
import { FormikActions, FormikErrors } from 'formik'
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
import { recover, verify } from '../lib/api'
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
  }

  private initialRecoverValues: RecoverValues = {
    email: '',
  }

  private initialPasswordValues: PasswordValues = {
    password: '',
  }

  public componentDidMount() {
    const { recovery_token: token } = parse(window.location.hash.substr(1))

    if (token) {
      this.setState({ token })
    }
  }

  public render() {
    const { authentication } = this.props
    const { sent, token } = this.state

    if (authentication.user) {
      return <Redirect to={'/'} />
    }

    if (sent) {
      return <RecoverConfirm email={sent} />
    }

    if (token) {
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
    const { token }: PasswordHiddenValues = this.state

    verify({
      ...values,
      token,
      type: 'recovery',
    }).then(
      () => {
        setSubmitting(false)

        /* tslint:disable-next-line:no-any */
        this.props.dispatch<any>(authenticate())
      },
      (error: AxiosError) => {
        setSubmitting(false)

        const errors: FormikErrors<PasswordErrors> = {
          password: null, // TODO: read these from the response
          unauthorized: error.response && error.response.status === 401,
          submit: null,
        }

        if (error.response) {
          if (error.response.data.msg) {
            errors.submit = error.response.data.msg
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
    recover(values).then(
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
          submit: 'There was an error',
        }

        if (error.response) {
          if (error.response.status === 404) {
            errors.notFound = true
          }

          if (error.response.data.error_description) {
            errors.submit = error.response.data.error_description
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
