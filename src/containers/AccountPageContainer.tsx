import { Formik, FormikActions, FormikErrors } from 'formik'
import * as React from 'react'
import * as Modal from 'react-modal'
import { connect } from 'react-redux'
import { RouterProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import {
  AccountErrors,
  AccountForm,
  AccountValues,
} from '../components/AccountForm'
import { FormPage } from '../components/Form'
import { update } from '../lib/api'
import { authenticate } from '../store/authentication'
import {
  AuthenticationDispatchProps,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'
import { accountSchema } from '../validation'

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  content: {
    background: 'transparent',
    border: 'none',
  },
}

class AccountPageContainer extends React.Component<
  AuthenticationStateProps & AuthenticationDispatchProps & RouterProps
> {
  public render() {
    const { authentication: { user: initialValues } } = this.props

    if (!initialValues) {
      return <Redirect to={'/login'} />
    }

    return (
      <Modal isOpen={true} style={modalStyle}>
        <FormPage>
          <Formik
            initialValues={initialValues as AccountValues}
            validationSchema={accountSchema}
            isInitialValid={false}
            onSubmit={this.handleSubmit}
            component={AccountForm}
          />
        </FormPage>
      </Modal>
    )
  }

  private handleSubmit = (
    values: AccountValues,
    { setSubmitting, setErrors }: FormikActions<AccountValues | AccountErrors>
  ) => {
    update('account', '', values).then(
      () => {
        setSubmitting(false)

        this.props.history.push('/')

        /* tslint:disable-next-line:no-any */
        this.props.dispatch<any>(authenticate())
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<AccountErrors> = {
          givenName: null,
          phone: null,
          familyName: null,
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
)(AccountPageContainer)
