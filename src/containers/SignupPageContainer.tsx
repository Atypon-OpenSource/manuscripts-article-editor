import { FormikActions, FormikErrors } from 'formik'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as yup from 'yup'
import { signup } from '../client'
import { SignupErrors, SignupValues } from '../components/SignupForm'
import SignupPage from '../components/SignupPage'
import { authenticate } from '../redux/authentication'
import {
  AuthenticationActions,
  AuthenticationProps,
  AuthenticationState,
  State,
} from '../types'

class SignupPageContainer extends React.Component<AuthenticationProps> {
  private validationSchema = yup.object().shape({
    email: yup
      .string()
      .required()
      .matches(/^.+@.+\..+$/),
    password: yup
      .string()
      .required()
      .min(3), // TODO: warn about strength?
    name: yup
      .string()
      .required()
      .min(1),
    surname: yup
      .string()
      .required()
      .min(2),
  })

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
        validationSchema={this.validationSchema}
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
        this.props.authenticate()
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

export default connect<AuthenticationState, AuthenticationActions>(
  (state: State) => ({
    authentication: state.authentication,
  }),
  {
    authenticate,
  }
)(SignupPageContainer)
