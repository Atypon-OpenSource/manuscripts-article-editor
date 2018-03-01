import { FormikActions, FormikErrors } from 'formik'
import * as httpStatusCode from 'http-status-codes'
import { parse } from 'qs'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { SignupConfirm } from '../components/SignupConfirm'
import { SignupErrors, SignupValues } from '../components/SignupForm'
import SignupPage from '../components/SignupPage'
import { signup, verify } from '../lib/api'
import { authenticate } from '../store/authentication'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'
import { signupSchema } from '../validation'

interface UserDetails {
  email: string
}

interface SignupPageContainerState {
  confirming: UserDetails | null
  error: boolean
}

class SignupPageContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps
> {
  public state: SignupPageContainerState = {
    confirming: null,
    error: false,
  }

  private initialValues: SignupValues = {
    email: '',
    password: '',
    name: '',
  }

  public componentDidMount() {
    const { confirmation_token: token } = parse(window.location.hash.substr(1))

    if (token) {
      verify({
        type: 'signup',
        token,
      })
        .then(() => {
          /* tslint:disable-next-line:no-any */
          this.props.dispatch<any>(authenticate())
        })
        .catch(() => {
          this.setState({
            error: true,
          })
        })
    }
  }

  public render() {
    const { authentication } = this.props
    const { confirming, error } = this.state

    if (authentication.user) {
      return <Redirect to={'/'} />
    }

    if (error) {
      return <div>There was an error.</div>
    }

    if (confirming) {
      return <SignupConfirm email={confirming.email} />
    }

    return (
      <SignupPage
        initialValues={this.initialValues}
        onSubmit={this.handleSubmit}
        validationSchema={signupSchema}
      />
    )
  }

  private handleSubmit = (
    values: SignupValues,
    { setSubmitting, setErrors }: FormikActions<SignupValues | SignupErrors>
  ) => {
    signup(values).then(
      response => {
        setSubmitting(false)

        this.setState({
          confirming: { email: values.email },
        })

        /* tslint:disable-next-line:no-any */
        this.props.dispatch<any>(authenticate())
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<SignupErrors> = {
          name: null,
          email: null,
          password: null, // TODO: read these from the response
          submit: null,
        }

        if (error.response) {
          // TODO: a button to re-send the confirmation email
          if (error.response.status === httpStatusCode.BAD_REQUEST) {
            errors.submit = 'Invalid Operation'
          } else if (error.response.status === httpStatusCode.CONFLICT) {
            errors.submit = 'The email address already registered'
          } else {
            errors.submit = 'An error occurred.'
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
)(SignupPageContainer)
