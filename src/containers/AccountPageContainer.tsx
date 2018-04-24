import { FormikActions, FormikErrors } from 'formik'
import * as React from 'react'
// import * as Modal from 'react-modal'
import { RouterProps } from 'react-router'
import { AccountErrors, AccountValues } from '../components/AccountForm'
import AccountPage from '../components/AccountPage'
import { UserProps, withUser } from '../store/UserProvider'
import { User } from '../types/user'
import { accountSchema } from '../validation'

// const modalStyle = {
//   overlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//   },
//   content: {
//     background: 'transparent',
//     border: 'none',
//   },
// }

class AccountPageContainer extends React.Component<UserProps & RouterProps> {
  public render() {
    const initialValues = this.props.user.data as User

    // TODO: remove this once the User object has the correct fields
    if (initialValues.name && !initialValues.givenName) {
      ;[
        initialValues.givenName,
        initialValues.familyName,
      ] = initialValues.name.split(/\s+/, 2)
    }

    if (!initialValues.phone) {
      initialValues.phone = ''
    }

    return (
      // <Modal isOpen={true} style={modalStyle}>
      <AccountPage
        initialValues={initialValues}
        validationSchema={accountSchema}
        onSubmit={this.handleSubmit}
      />
      // </Modal>
    )
  }

  private handleSubmit = (
    values: AccountValues,
    { setSubmitting, setErrors }: FormikActions<AccountValues | AccountErrors>
  ) => {
    setErrors({})

    this.props.user.update(values).then(
      () => {
        setSubmitting(false)

        this.props.history.push('/')

        // this.props.user.fetch()
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<AccountErrors> = {
          submit: error.response
            ? error.response.data.error
            : 'There was an error',
        }

        setErrors(errors)
      }
    )
  }
}

export default withUser(AccountPageContainer)
