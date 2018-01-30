import { FormikActions, FormikErrors } from 'formik'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as yup from 'yup'
import { login } from '../api'
import { LoginErrors, LoginValues } from '../components/LoginForm'
import LoginPage from '../components/LoginPage'
import { authenticate } from '../redux/authentication'
import {
  AuthenticationActions,
  AuthenticationProps,
  AuthenticationState,
  State,
} from '../types'

class LoginPageContainer extends React.Component<AuthenticationProps> {
  private initialValues: LoginValues = {
    email: '',
    password: '',
  }

  private validationSchema = yup.object().shape({
    email: yup
      .string()
      .required()
      .matches(/^.+@.+\..+$/),
    password: yup.string().required(), // TODO: warn about strength
  })

  public render() {
    const { authentication } = this.props

    if (authentication.user) {
      return <Redirect to={'/'} />
    }

    return (
      <LoginPage
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
      />
    )
  }

  private handleSubmit = (
    values: LoginValues,
    { setSubmitting, setErrors }: FormikActions<LoginValues | LoginErrors>
  ) => {
    login(values).then(
      () => {
        setSubmitting(false)
        this.props.authenticate()
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<LoginErrors> = {
          email: null, // TODO: read these from the response
          password: null, // TODO: read these from the response
          unauthorized: error.response && error.response.status === 401,
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
)(LoginPageContainer)
