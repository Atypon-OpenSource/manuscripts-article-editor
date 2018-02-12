import { FormikActions, FormikErrors } from 'formik'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { SignupErrors, SignupValues } from '../components/SignupForm'
import SignupPage from '../components/SignupPage'
import { signup } from '../lib/api'
import { authenticate } from '../store/authentication'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'
import { signupSchema } from '../validation'

class SignupPageContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps
> {
  private initialValues: SignupValues = {
    email: '',
    password: '',
    name: '',
    surname: '',
  }

  public render() {
    const { authentication } = this.props

    if (authentication.user) {
      return <Redirect to={'/'} />
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
      () => {
        setSubmitting(false)

        /* tslint:disable-next-line:no-any */
        this.props.dispatch<any>(authenticate())
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<SignupErrors> = {
          name: null,
          surname: null,
          email: null,
          password: null, // TODO: read these from the response
          submit: error.response
            ? error.response.data.error
            : 'There was an error',
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
