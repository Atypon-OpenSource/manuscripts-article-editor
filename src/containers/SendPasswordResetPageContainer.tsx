import { FormikActions, FormikErrors } from 'formik'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
  SendPasswordResetErrors,
  SendPasswordResetValues,
} from '../components/SendPasswordResetForm'
import SendPasswordResetPage from '../components/SendPasswordResetPage'
import { sendPasswordReset } from '../lib/api'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'
import { sendPasswordResetSchema } from '../validation'

class SendPasswordResetPageContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps
> {
  private initialValues: SendPasswordResetValues = {
    email: '',
  }

  public render() {
    const { authentication } = this.props

    if (authentication.user) {
      return <Redirect to={'/'} />
    }

    return (
      <SendPasswordResetPage
        initialValues={this.initialValues}
        validationSchema={sendPasswordResetSchema}
        onSubmit={this.handleSubmit}
      />
    )
  }

  private handleSubmit = (
    values: SendPasswordResetValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<SendPasswordResetValues | SendPasswordResetErrors>
  ) => {
    sendPasswordReset(values).then(
      () => {
        setSubmitting(false)

        // TODO: display success message
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<SendPasswordResetErrors> = {
          email: null, // TODO: read these from the response
          notFound: error.response && error.response.status === 404,
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
)(SendPasswordResetPageContainer)
